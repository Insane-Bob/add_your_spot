<template>
  <Teleport to="body">
    <div class="backdrop" @click.self="$emit('close')">
      <div class="browser-window">

        <!-- BROWSER CHROME TOP BAR -->
        <div class="browser-bar">
          <div class="browser-traffic">
            <button class="traffic-btn traffic-close" @click="$emit('close')" :aria-label="t('close')">
              <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
                <line x1="1" y1="1" x2="5" y2="5" stroke="rgba(0,0,0,0.5)" stroke-width="1.5" stroke-linecap="round"/>
                <line x1="5" y1="1" x2="1" y2="5" stroke="rgba(0,0,0,0.5)" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
            <span class="traffic-btn traffic-min"></span>
            <span class="traffic-btn traffic-max"></span>
          </div>

          <div class="browser-addressbar">
            <svg class="addr-lock" width="10" height="11" viewBox="0 0 10 11" fill="none">
              <rect x="1.5" y="4.5" width="7" height="6" rx="1" stroke="#6B7280" stroke-width="1.2"/>
              <path d="M3 4.5V3a2 2 0 014 0v1.5" stroke="#6B7280" stroke-width="1.2" stroke-linecap="round"/>
            </svg>
            <span class="addr-text">add-your-spots/{{ point.title ? slugify(point.title) : '…' }}</span>
          </div>
        </div>

        <!-- BROWSER TABS BAR -->
        <div class="tabs-bar">
          <div class="tab tab--active">
            <svg width="12" height="14" viewBox="0 0 16 19" fill="none" class="tab-favicon">
              <path d="M8 0C4.686 0 2 2.686 2 6c0 4.125 6 11 6 11s6-6.875 6-11c0-3.314-2.686-6-6-6z" fill="#E8521A"/>
              <circle cx="8" cy="6" r="2" fill="white" opacity="0.7"/>
            </svg>
            <span class="tab-title">{{ point.title || t('favoriteSpots') }}</span>
            <button class="tab-close" @click="$emit('close')">
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <line x1="1" y1="1" x2="7" y2="7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <line x1="7" y1="1" x2="1" y2="7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <div class="tab tab--inactive">
            <span class="tab-ghost"></span>
          </div>
          <div class="tab tab--inactive">
            <span class="tab-ghost"></span>
          </div>
          <div class="tab-new">+</div>
        </div>

        <!-- PAGE CONTENT -->
        <div class="page">

          <!-- HERO BAND -->
          <div class="hero">
            <div class="hero__texture"></div>
            <div class="hero__grid"></div>
            <div class="hero__inner">
              <div class="hero__meta">
                <div class="hero__pin-badge">
                  <svg width="14" height="17" viewBox="0 0 16 19" fill="none">
                    <path d="M8 0C4.686 0 2 2.686 2 6c0 4.125 6 11 6 11s6-6.875 6-11c0-3.314-2.686-6-6-6z" fill="#E8521A"/>
                    <circle cx="8" cy="6" r="2" fill="white" opacity="0.7"/>
                  </svg>
                  <span>{{ t('favoriteSpots') }}</span>
                </div>
              </div>

              <h1 class="hero__title">{{ point.title }}</h1>

              <p v-if="point.author" class="hero__author">
                <span class="hero__author-line"></span>
                <span>{{ point.author }}</span>
              </p>
            </div>

            <!-- Category-->
            <div v-if="point.category && categories[point.category]"
                 class="hero__corner-tag"
                 :style="{ '--cat-color': categories[point.category].color }">
              <div class="corner-icon-wrap">
                <img :src="categories[point.category].icon" :alt="getCategoryLabel(point.category)" class="corner-icon" />
              </div>
            </div>
            <div v-else class="hero__corner-tag hero__corner-tag--empty">
              <div class="corner-icon-wrap corner-icon-wrap--empty">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.5">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- BODY AREA -->
          <div class="body-area">
            <div class="body-area__left">
              <!-- Description card -->
              <div class="desc-card">
                <div class="desc-card__label">
                  <span class="desc-card__label-dot"></span>
                  {{ t('description') || 'Description' }}
                </div>
                <p class="desc-card__text">{{ point.description || getEmptyMessage() }}</p>
              </div>
            </div>

            <!-- Map placeholder card -->
            <div class="map-card">
              <div class="map-card__inner">
                <div class="map-bg">
                  <div class="map-grid-h" v-for="i in 5" :key="'h'+i"></div>
                  <div class="map-grid-v" v-for="i in 5" :key="'v'+i"></div>
                  <div class="map-road map-road--h map-road--1"></div>
                  <div class="map-road map-road--h map-road--2"></div>
                  <div class="map-road map-road--v map-road--3"></div>
                </div>
                <div class="map-pin-wrap">
                  <div class="map-pin-pulse"></div>
                  <svg width="28" height="34" viewBox="0 0 16 19" fill="none" class="map-pin-icon">
                    <path d="M8 0C4.686 0 2 2.686 2 6c0 4.125 6 11 6 11s6-6.875 6-11c0-3.314-2.686-6-6-6z" fill="#E8521A"/>
                    <circle cx="8" cy="6" r="2" fill="white" opacity="0.8"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { categories } from '../config/categories.js'
import { getLabel } from '../config/i18n.js'

const props = defineProps({
  point: Object,
  language: { type: String, default: 'de' }
})
defineEmits(['close'])

const t = (key) => getLabel(key, props.language)
const getCategoryLabel = (key) => getLabel(`categories.${key}`, props.language)
const getEmptyMessage = () => props.language === 'en'
  ? 'No description has been added for this spot yet.'
  : 'Für diesen Ort wurde noch keine Beschreibung hinzugefügt.'
const slugify = (str) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;1,9..144,400&family=Syne:wght@600;800&display=swap');

/* ─── TOKENS ─────────────────────────────────────────────── */
:root {
  --ink:      #111118;
  --ink-soft: #4B4B6A;
  --cream:    #F2EDE7;
  --chrome:   #E4E2DC;
  --chrome2:  #D6D3CC;
  --accent:   #E8521A;
  --purple:   #6B6BB5;
  --white:    #FFFFFF;
}

/* ─── BACKDROP ───────────────────────────────────────────── */
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(8, 8, 22, 0.65);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: clamp(1rem, 4vw, 2.5rem);
  animation: fadein 0.22s ease-out both;
}
@keyframes fadein { from { opacity: 0 } to { opacity: 1 } }

/* ─── BROWSER WINDOW ─────────────────────────────────────── */
.browser-window {
  width: 100%;
  max-width: 860px;
  border-radius: 14px;
  overflow: hidden;
  box-shadow:
    0 0 0 1.5px rgba(255,255,255,0.08),
    0 8px 0 0 #111118,
    0 32px 80px rgba(0,0,0,0.55),
    inset 0 1px 0 rgba(255,255,255,0.12);
  animation: slideup 0.38s cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes slideup {
  from { opacity: 0; transform: translateY(28px) scale(0.97) }
  to   { opacity: 1; transform: translateY(0) scale(1) }
}

/* Corner icon */
.hero__corner-tag {
  position: absolute;
  top: 12px;
  right: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  transition: opacity 0.2s;
}
.corner-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--cat-color, #E8521A);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2);
  transition: background 0.25s;
}
.corner-icon-wrap--empty {
  background: rgba(255,255,255,0.08);
  border: 1.5px dashed rgba(255,255,255,0.2);
  box-shadow: none;
}
.corner-icon {
  width: 19px;
  height: 19px;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

/* ─── TOP CHROME BAR ─────────────────────────────────────── */
.browser-bar {
  background: linear-gradient(180deg, #DDDAD3 0%, #CCC9C1 100%);
  border-bottom: 1px solid #B8B4AC;
  height: 36px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 10px;
  user-select: none;
}

/* Traffic lights */
.browser-traffic {
  display: flex;
  gap: 7px;
  align-items: center;
  flex-shrink: 0;
}
.traffic-btn {
  width: 13px;
  height: 13px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
}
.traffic-close  { background: #FF5F57; border: 1px solid #E0443E; }
.traffic-min    { background: #FFBD2E; border: 1px solid #DFA123; cursor: default; }
.traffic-max    { background: #28C840; border: 1px solid #1DAD2B; cursor: default; }
.traffic-close svg { opacity: 0; transition: opacity 0.1s; }
.traffic-close:hover svg { opacity: 1; }

/* Address bar */
.browser-addressbar {
  flex: 1;
  min-width: 0;
  height: 28px;
  background: rgba(255,255,255,0.72);
  border: 1px solid rgba(0,0,0,0.12);
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 10px;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.07);
}
.addr-lock { flex-shrink: 0; }
.addr-text {
  font-family: 'DM Mono', monospace;
  font-size: 11.5px;
  color: #3A3A3A;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.01em;
}

/* Browser actions (share etc.) */
.browser-actions {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-shrink: 0;
}
.browser-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgba(0,0,0,0.08);
  display: block;
}

/* ─── TABS BAR ───────────────────────────────────────────── */
.tabs-bar {
  background: #C8C5BE;
  border-bottom: 1px solid #B0ADA6;
  height: 28px;
  display: flex;
  align-items: flex-end;
  padding: 0 10px;
  gap: 2px;
}
.tab {
  height: 24px;
  border-radius: 6px 6px 0 0;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 8px 0 7px;
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  max-width: 200px;
  min-width: 50px;
  flex-shrink: 0;
  position: relative;
}
.tab--active {
  background: #F2EDE7;
  border: 1px solid #B0ADA6;
  border-bottom: none;
  color: #111118;
}
.tab--inactive {
  background: rgba(0,0,0,0.05);
  color: #888;
  cursor: default;
}
.tab-favicon { flex-shrink: 0; }
.tab-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  letter-spacing: -0.01em;
}
.tab-close {
  background: none;
  border: none;
  cursor: pointer;
  color: #888;
  padding: 2px;
  display: flex;
  align-items: center;
  border-radius: 3px;
  margin-left: auto;
  flex-shrink: 0;
}
.tab-close:hover { background: rgba(0,0,0,0.1); color: #333; }
.tab-ghost {
  display: block;
  width: 60px;
  height: 8px;
  background: rgba(0,0,0,0.08);
  border-radius: 4px;
}
.tab-new {
  color: #888;
  font-size: 16px;
  line-height: 1;
  padding: 0 8px;
  cursor: pointer;
  height: 24px;
  display: flex;
  align-items: center;
}

/* ─── PAGE ───────────────────────────────────────────────── */
.page {
  background: #F2EDE7;
  display: flex;
  flex-direction: column;
}

/* ─── HERO ───────────────────────────────────────────────── */
.hero {
  background: #1C1C3A;
  padding: 16px clamp(18px, 4vw, 32px) 14px;
  position: relative;
  overflow: hidden;
}
/* Subtle dot texture */
.hero__texture {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
  background-size: 22px 22px;
  pointer-events: none;
}
/* Grid lines */
.hero__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
}

.hero__inner {
  position: relative;
  z-index: 1;
}

.hero__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

/* Category pill */
.cat-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 999px;
  padding: 4px 12px 4px 6px;
  font-family: 'Syne', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.85);
  backdrop-filter: blur(4px);
}
.cat-pill__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--cat-color, #E8521A);
  flex-shrink: 0;
}
.cat-pill__icon {
  width: 14px;
  height: 14px;
  object-fit: contain;
  filter: brightness(0) invert(1);
  opacity: 0.8;
}

/* Pin badge */
.hero__pin-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(232, 82, 26, 0.18);
  border: 1px solid rgba(232, 82, 26, 0.4);
  border-radius: 999px;
  padding: 4px 12px 4px 8px;
  font-family: 'Syne', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #E8521A;
}

/* Title */
.hero__title {
  font-family: 'Fraunces', serif;
  font-weight: 700;
  font-size: clamp(22px, 4vw, 36px);
  color: #FFFFFF;
  margin: 0 0 6px;
  line-height: 1.05;
  letter-spacing: -0.02em;
  text-wrap: balance;
}

/* Author */
.hero__author {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-size: 13px;
  color: rgba(255,255,255,0.5);
  margin: 0;
}
.hero__author-line {
  display: block;
  width: 28px;
  height: 1.5px;
  background: #E8521A;
  flex-shrink: 0;
}

/* ─── BODY AREA ──────────────────────────────────────────── */
.body-area {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0;
  flex: 1;
}

/* ─── DESCRIPTION CARD ───────────────────────────────────── */
.desc-card {
  padding: 16px clamp(16px, 3vw, 28px) 12px;
  border-right: 1px solid #D9D5CE;
}
.desc-card__label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Syne', sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #9996B0;
  margin-bottom: 8px;
}
.desc-card__label-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #E8521A;
  display: block;
  flex-shrink: 0;
}
.desc-card__text {
  font-family: 'Fraunces', serif;
  font-size: clamp(13px, 1.8vw, 14px);
  font-weight: 300;
  color: #2E2E50;
  line-height: 1.65;
  margin: 0;
  padding-bottom: 10px;
}

/* ─── MAP CARD ───────────────────────────────────────────── */
.map-card {
  width: clamp(120px, 22vw, 180px);
  display: flex;
  flex-direction: column;
  border-left: 1px solid #D9D5CE;
  flex-shrink: 0;
}
.map-card__inner {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: #E8E5F0;
  min-height: 100px;
}

/* Decorative map BG */
.map-bg {
  position: absolute;
  inset: 0;
}
.map-grid-h {
  position: absolute;
  left: 0; right: 0;
  height: 1px;
  background: rgba(107,107,181,0.12);
}
.map-grid-h:nth-child(1) { top: 20% }
.map-grid-h:nth-child(2) { top: 40% }
.map-grid-h:nth-child(3) { top: 60% }
.map-grid-h:nth-child(4) { top: 80% }
.map-grid-v {
  position: absolute;
  top: 0; bottom: 0;
  width: 1px;
  background: rgba(107,107,181,0.12);
}
.map-grid-v:nth-child(6)  { left: 20% }
.map-grid-v:nth-child(7)  { left: 40% }
.map-grid-v:nth-child(8)  { left: 60% }
.map-grid-v:nth-child(9)  { left: 80% }
.map-road {
  position: absolute;
  background: rgba(255,255,255,0.7);
}
.map-road--h { left: 0; right: 0; height: 8px; }
.map-road--v { top: 0; bottom: 0; width: 8px; }
.map-road--1 { top: calc(50% - 4px) }
.map-road--2 { top: calc(30% - 4px); opacity: 0.5 }
.map-road--3 { left: calc(40% - 4px) }

.map-pin-wrap {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.map-pin-pulse {
  position: absolute;
  bottom: -2px;
  width: 24px;
  height: 10px;
  background: rgba(232,82,26,0.25);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.6 }
  50% { transform: scale(1.3); opacity: 0.3 }
}
.map-pin-icon {
  filter: drop-shadow(0 3px 6px rgba(232,82,26,0.4));
  position: relative;
  z-index: 1;
  animation: float 3s ease-in-out infinite;
}
@keyframes float {
  0%, 100% { transform: translateY(0) }
  50% { transform: translateY(-4px) }
}

.map-card__footer {
  background: #1C1C3A;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 7px;
  font-family: 'Syne', sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.6);
  cursor: pointer;
  transition: color 0.15s;
}
.map-card__footer:hover { color: #E8521A; }

/* ─── STATUS BAR ─────────────────────────────────────────── */
.statusbar {
  background: #E8E4DC;
  border-top: 1px solid #D9D5CE;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}
.statusbar__ready {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  color: #28C840;
  letter-spacing: 0.5px;
}
.statusbar__url {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  color: #9996B0;
}

/* ─── RESPONSIVE ─────────────────────────────────────────── */
@media (max-width: 768px) {
  .backdrop {
    padding: -20px;
    align-items: flex-end;
  }
  .browser-window {
    max-width: 100%;
    border-radius: 14px 14px 0 0;
    max-height: 92vh;
    overflow-y: auto;
  }
  .hero__title {
    font-size: 26px;
  }
  .corner-icon {
    width: 65px;
    height: 65px;
  }
}

@media (max-width: 600px) {
  .body-area {
    grid-template-columns: 1fr;
  }
  .map-card {
    width: 100%;
    border-left: none;
    border-top: 1px solid #D9D5CE;
    min-height: 100px;
  }
  .map-card__inner {
    min-height: 100px;
  }
  .desc-card {
    padding: 14px 16px 12px;
    border-right: none;
  }
  .hero {
    padding: 14px 16px 12px;
  }
  .corner-icon {
    width: 55px;
    height: 55px;
    margin-right: 5px;
  }
  .browser-actions { display: none; }
  .tab--inactive { display: none; }
  .tab-new { display: none; }
}

@media (max-width: 420px) {
  .browser-bar { padding: 0 10px; }
  .addr-text { font-size: 9.5px; }
  .desc-card__text {
    font-size: 13px;
  }
  .hero__title {
    font-size: 22px;
  }
  .corner-icon {
    width: 48px;
    height: 48px;
  }
}
</style>
