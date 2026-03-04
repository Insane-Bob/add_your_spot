<template>
  <div id="map" class="map-container"></div>

  <img
    src="/add_your_spot_logo.png"
    alt="Add Your Spot"
    class="project-logo"
  />

  <!-- Modal / InfoCard -->
  <Modal
    v-if="showModal"
    :newPoint="newPoint"
    :language="language"
    @save="savePoint"
    @close="showModal = false"
  />

  <InfoCard
    v-if="selectedPoint"
    :point="selectedPoint"
    :language="language"
    @close="selectedPoint = null"
  />
</template>

<script setup>
import { ref, onMounted, watch, nextTick, defineProps } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Modal from './Modal.vue'
import InfoCard from './InfoCard.vue'
import { categories } from '../config/categories.js'
import { SEED_POINTS } from '../config/seedPoints.js'
import { roadColorForHighway, roadWeightForHighway, roadPriority } from '../config/roads.js'

defineProps({
  language: {
    type: String,
    default: 'de'
  }
})

const points       = ref([...SEED_POINTS])
const selectedPoint = ref(null)
const showModal    = ref(false)
const newPoint     = ref(null)

let map = null
const markers = {}
let roadsLayer = null
let roadRefreshTimer = null

// Charger les points sauvegardés du localStorage s'ils existent
const saved = localStorage.getItem('mapPoints')
if (saved) {
  try {
    const parsed = JSON.parse(saved)
    if (Array.isArray(parsed) && parsed.length > 0) {
      points.value = parsed
    }
  } catch (e) {
    console.warn('Erreur lors du chargement des points sauvegardés:', e)
    // Garder les SEED_POINTS par défaut
  }
}

watch(points, val => {
  localStorage.setItem('mapPoints', JSON.stringify(val))
}, { deep: true })

onMounted(() => {
  nextTick(() => {
    // Initialize map centered on Salzburg
    map = L.map('map', {
      center: [47.8095, 13.0550], // Salzburg coordinates
      zoom: 13,
      zoomControl: true
    })

    // Dedicated pane keeps custom roads consistently visible above tiles.
    if (!map.getPane('roadsPane')) {
      map.createPane('roadsPane')
      map.getPane('roadsPane').style.zIndex = '420'
    }

    // Add OpenStreetMap tile layer with minimal black and white style
    L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
      maxZoom: 20
    }).addTo(map)

    // Add click handler for adding new points
    map.on('click', handleMapClick)

    // Keep roads synced with current viewport.
    map.on('moveend', scheduleRoadRefresh)

    // Load existing points
    points.value.forEach(point => {
      if (point.lat && point.lng && point.category && categories[point.category]) {
        addMarkerToMap(point)
      }
    })

    loadRoadOverlay()
  })
})

function scheduleRoadRefresh() {
  clearTimeout(roadRefreshTimer)
  roadRefreshTimer = setTimeout(() => {
    loadRoadOverlay()
  }, 220)
}


async function loadRoadOverlay() {
  if (!map) return

  const bounds = map.getBounds()
  const south = bounds.getSouth()
  const west = bounds.getWest()
  const north = bounds.getNorth()
  const east = bounds.getEast()

  const query = `[out:json][timeout:20];way["highway"](${south},${west},${north},${east});out geom;`

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query
    })

    if (!response.ok) {
      console.warn('Road overlay request failed:', response.status)
      return
    }
    const data = await response.json()

    if (roadsLayer) {
      map.removeLayer(roadsLayer)
    }

    roadsLayer = L.layerGroup().addTo(map)

    const ways = (data.elements || [])
      .filter(element => element.type === 'way' && element.tags?.highway && element.geom?.length)
      // Draw low-priority roads first so main roads stay visible on top.
      .sort((a, b) => roadPriority(a.tags.highway) - roadPriority(b.tags.highway))

    for (const element of ways) {
      const latLngs = element.geom.map(node => [node.lat, node.lon])
      const highway = element.tags.highway

      L.polyline(latLngs, {
        color: roadColorForHighway(highway),
        weight: roadWeightForHighway(highway),
        opacity: 0.95,
        interactive: false,
        lineCap: 'round',
        lineJoin: 'round',
        pane: 'roadsPane'
      }).addTo(roadsLayer)
    }
  } catch (error) {
    console.warn('Road overlay unavailable:', error)
  }
}


function handleMapClick(e) {
  newPoint.value = {
    lat: e.latlng.lat,
    lng: e.latlng.lng
  }
  showModal.value = true
}

function addMarkerToMap(point) {
  if (!point.category || !categories[point.category]) return

  const color = categories[point.category].color
  const category = categories[point.category]

  // Créer un cercle au lieu d'un marqueur
  const circle = L.circleMarker([point.lat, point.lng], {
    radius: 12,
    fillColor: color,
    color: color,
    weight: 3,
    opacity: 1,
    fillOpacity: 0.9,
    className: 'map-circle-marker'
  }).addTo(map)

  circle.bindTooltip(
    `<div class="tooltip-content">
      <span class="tooltip-icon-wrap">
        <img src="${category.icon}" alt="${category.label}" class="tooltip-icon" />
      </span>
      <div class="tooltip-text">
        <strong>${point.title}</strong>
        <small>${category.label}</small>
      </div>
    </div>`,
    {
      permanent: false,
      direction: 'top',
      offset: [0, -14],
      className: 'custom-tooltip'
    }
  )

  circle.bindPopup(`<strong>${point.title}</strong>${point.author ? '<br/>by ' + point.author : ''}`)

  circle.on('click', () => {
    selectedPoint.value = point
  })

  circle.on('mouseover', function() {
    this.setRadius(16)
    this.setStyle({ weight: 4, opacity: 1, fillOpacity: 1 })
  })

  circle.on('mouseout', function() {
    this.setRadius(12)
    this.setStyle({ weight: 3, opacity: 1, fillOpacity: 0.9 })
  })

  markers[point.id] = circle
}

function savePoint(data) {
  const point = { id: Date.now(), ...data }
  points.value.push(point)
  addMarkerToMap(point)
  showModal.value = false

  // Confirmation de sauvegarde
  console.log('✅ Punkt gespeichert:', point)
  console.log('📊 Alle Punkte (zum Kopieren in SEED_POINTS):', JSON.stringify(points.value, null, 2))
}
</script>

<style>
.map-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

/* Override Leaflet default styles */
.leaflet-container {
  background: #f5f5f5;
  width: 100%;
  height: 100%;
}

.leaflet-popup-content-wrapper {
  background: rgba(20, 18, 15, 0.95);
  color: rgba(255,255,255,0.9);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  font-family: 'DM Sans', system-ui, sans-serif;
}

.leaflet-popup-content {
  margin: 10px 12px;
  font-size: 13px;
  line-height: 1.4;
}

.leaflet-popup-tip {
  background: rgba(20, 18, 15, 0.95);
  border: 1px solid rgba(255,255,255,0.1);
}

/* Custom marker styles with scale hover effect */
.custom-marker {
  cursor: pointer !important;
  transition: all 0.3s ease !important;
}

.custom-marker img {
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
  transform: scale(1);
}

.marker-hover img,
.custom-marker:hover img {
  transform: scale(1.35);
  filter: drop-shadow(0 4px 12px rgba(201, 168, 76, 0.6))
          drop-shadow(0 0 8px rgba(201, 168, 76, 0.4));
  animation: pulse 1.5s ease-in-out infinite;
  cursor: pointer;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1.35);
  }
  50% {
    transform: scale(1.45);
  }
}

/* Cursor styles on map for better UX */
.leaflet-container {
  cursor: crosshair;
}

.leaflet-grab {
  cursor: grab;
}

.leaflet-dragging .leaflet-grab {
  cursor: grabbing;
}

/* Make all markers obviously hoverable with scale effect */
.leaflet-marker-icon {
  transition: transform 0.3s ease, filter 0.3s ease;
}

.leaflet-marker-icon:hover {
  transform: scale(1.2);
  cursor: pointer;
  filter: brightness(1.1);
}

/* Keep road overlay lines crisp above tiles, below markers/popups. */
.leaflet-overlay-pane svg {
  shape-rendering: geometricPrecision;
}

/* Circle marker styles */
.map-circle-marker {
  cursor: pointer !important;
  transition: all 0.3s ease !important;
}

.leaflet-pane .leaflet-overlay-pane path {
  transition: stroke-width 0.3s ease, opacity 0.3s ease !important;
}

/* Custom tooltip styles */
:global(.custom-tooltip) {
  background: rgba(18, 18, 18, 0.96) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  border-radius: 8px !important;
  padding: 8px 12px !important;
  font-family: 'DM Sans', system-ui, sans-serif !important;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5) !important;
  max-width: 220px !important;
  white-space: nowrap !important;
}

:global(.leaflet-tooltip-top::before) {
  border-top-color: rgba(18, 18, 18, 0.96) !important;
}

:global(.tooltip-content) {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
}

:global(.tooltip-icon-wrap) {
  width: 24px;
  height: 24px;
  min-width: 24px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

:global(.tooltip-icon) {
  width: 16px;
  height: 16px;
  object-fit: contain;
  display: block;
}

:global(.tooltip-text) {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 2px;
}

:global(.custom-tooltip strong),
:global(.custom-tooltip small) {
  display: block;
}

:global(.custom-tooltip strong) {
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.3;
}

:global(.custom-tooltip small) {
  color: rgba(255, 255, 255, 0.6);
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

:global(.leaflet-tooltip-right::before) {
  border-right-color: rgba(26, 26, 26, 0.95) !important;
}

.project-logo {
  position: fixed;
  left: -30px;
  bottom: -30px;
  width: 250px;
  height: auto;
  z-index: 900;
  pointer-events: none;
  opacity: 0.92;
}
</style>
