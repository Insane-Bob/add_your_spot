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
import { ref, onMounted, nextTick, defineProps } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Modal from './Modal.vue'
import InfoCard from './InfoCard.vue'
import { categories } from '../config/categories.js'
import { roadColorForHighway, roadWeightForHighway, roadPriority } from '../config/roads.js'

defineProps({
  language: {
    type: String,
    default: 'de'
  }
})

const points        = ref([])
const selectedPoint = ref(null)
const showModal     = ref(false)
const newPoint      = ref(null)

let map = null
let roadsLayer = null
let roadRefreshTimer = null

/* ---------------------------
   LOAD POINTS FROM DATABASE
---------------------------- */
async function loadPoints() {
  try {
    const res = await fetch('/api/point')
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
    const data = await res.json()

    points.value = data

    data.forEach(point => {
      if (point.lat && point.lng && point.category && categories[point.category]) {
        addMarkerToMap(point)
      }
    })

  } catch (err) {
    console.error('Erreur chargement points:', err)
    // Fallback: utiliser les seed points si l'API échoue
    points.value = []
  }
}

/* ---------------------------
   MAP INIT
---------------------------- */
onMounted(() => {
  nextTick(async () => {

    map = L.map('map', {
      center: [47.8095, 13.0550],
      zoom: 13,
      zoomControl: true
    })

    if (!map.getPane('roadsPane')) {
      map.createPane('roadsPane')
      map.getPane('roadsPane').style.zIndex = '420'
    }

    const apiKey = import.meta.env.VITE_STADIA_KEY

    L.tileLayer(
      `https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png?api_key=${apiKey}`,
      {
        attribution: '&copy; Stadia Maps &copy; OpenStreetMap contributors',
        maxZoom: 20
      }
    ).addTo(map)

    map.on('click', handleMapClick)
    map.on('moveend', scheduleRoadRefresh)

    await loadPoints()
    loadRoadOverlay()
  })
})

/* ---------------------------
   ROAD OVERLAY
---------------------------- */
function scheduleRoadRefresh() {
  clearTimeout(roadRefreshTimer)
  roadRefreshTimer = setTimeout(loadRoadOverlay, 250)
}

async function loadRoadOverlay() {
  if (!map) return

  const bounds = map.getBounds()
  const query = `
    [out:json][timeout:20];
    way["highway"](${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()});
    out geom;
  `

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query
    })

    if (!response.ok) return

    const data = await response.json()

    if (roadsLayer) map.removeLayer(roadsLayer)
    roadsLayer = L.layerGroup().addTo(map)

    const ways = (data.elements || [])
      .filter(el => el.type === 'way' && el.tags?.highway && el.geom?.length)
      .sort((a, b) => roadPriority(a.tags.highway) - roadPriority(b.tags.highway))

    for (const el of ways) {
      const latLngs = el.geom.map(n => [n.lat, n.lon])

      L.polyline(latLngs, {
        color: roadColorForHighway(el.tags.highway),
        weight: roadWeightForHighway(el.tags.highway),
        opacity: 0.95,
        interactive: false,
        lineCap: 'round',
        lineJoin: 'round',
        pane: 'roadsPane'
      }).addTo(roadsLayer)
    }

  } catch (err) {
    console.warn('Overlay unavailable:', err)
  }
}

/* ---------------------------
   CLICK → CREATE POINT
---------------------------- */
function handleMapClick(e) {
  newPoint.value = {
    lat: e.latlng.lat,
    lng: e.latlng.lng
  }
  showModal.value = true
}

/* ---------------------------
   ADD MARKER
---------------------------- */
function addMarkerToMap(point) {
  if (!point.category || !categories[point.category]) return

  const category = categories[point.category]
  const color = category.color

  const circle = L.circleMarker([point.lat, point.lng], {
    radius: 12,
    fillColor: color,
    color: color,
    weight: 3,
    opacity: 1,
    fillOpacity: 0.9
  }).addTo(map)

  circle.bindTooltip(
    `<strong>${point.title}</strong><br/><small>${category.label}</small>`,
    { direction: 'top', offset: [0, -12] }
  )

  circle.on('click', () => {
    selectedPoint.value = point
  })

  circle.on('mouseover', function () {
    this.setRadius(16)
  })

  circle.on('mouseout', function () {
    this.setRadius(12)
  })
}

/* ---------------------------
   SAVE POINT TO DATABASE
---------------------------- */
async function savePoint(data) {
  try {
    const res = await fetch('/api/point', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    })

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    const savedPoint = await res.json()

    points.value.push(savedPoint)
    addMarkerToMap(savedPoint)
    showModal.value = false

    console.log('✅ Point sauvegardé:', savedPoint)

  } catch (err) {
    console.error('Erreur sauvegarde:', err)
    alert('Erreur lors de la sauvegarde: ' + err.message)
  }
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
