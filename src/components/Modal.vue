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
            <span class="addr-text">add-your-spots/new-spot</span>
          </div>
        </div>

        <!-- BROWSER TABS BAR -->
        <div class="tabs-bar">
          <div class="tab tab--active">
            <svg width="12" height="14" viewBox="0 0 16 19" fill="none" class="tab-favicon">
              <path d="M8 0C4.686 0 2 2.686 2 6c0 4.125 6 11 6 11s6-6.875 6-11c0-3.314-2.686-6-6-6z" fill="#E8521A"/>
              <circle cx="8" cy="6" r="2" fill="white" opacity="0.7"/>
            </svg>
            <span class="tab-title">{{ t('newSpot') }}</span>
            <button class="tab-close" @click="$emit('close')">
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <line x1="1" y1="1" x2="7" y2="7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <line x1="7" y1="1" x2="1" y2="7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <div class="tab tab--inactive"><span class="tab-ghost"></span></div>
          <div class="tab tab--inactive"><span class="tab-ghost"></span></div>
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
              <h1 class="hero__title">{{ t('newSpot') }}</h1>
            </div>

            <!-- Category icon in corner (dynamique si sélectionnée) -->
            <div v-if="category && categories[category]"
                 class="hero__corner-tag"
                 :style="{ '--cat-color': categories[category].color }">
              <div class="corner-icon-wrap">
                <img :src="categories[category].icon" :alt="getCategoryLabel(category)" class="corner-icon" />
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

          <!-- FORM BODY -->
          <form class="form-body" @submit.prevent="save">

            <div class="form-cols">
              <!-- LEFT: fields -->
              <div class="form-fields">

                <div class="form-group">
                  <label class="form-label">{{ t('title') }}</label>
                  <input
                    v-model="title"
                    type="text"
                    class="form-input"
                    :placeholder="t('titlePlaceholder')"
                    required
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">{{ t('author') }}</label>
                  <input
                    v-model="author"
                    type="text"
                    class="form-input"
                    :placeholder="t('authorPlaceholder')"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">{{ t('description') }}</label>
                  <textarea
                    v-model="description"
                    class="form-input form-textarea"
                    :placeholder="t('descriptionPlaceholder')"
                    rows="3"
                  ></textarea>
                </div>

              </div>

              <!-- RIGHT: map placeholder -->
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

            <!-- CATEGORY PICKER -->
            <div class="form-section">
              <div class="section-label">
                <span class="section-label__dot"></span>
                {{ t('category') }}
              </div>
              <div class="category-grid">
                <label
                  v-for="(cat, key) in categories"
                  :key="key"
                  class="cat-option"
                  :class="{ 'cat-option--active': category === key }"
                  :style="category === key ? { '--cat-color': cat.color } : {}"
                >
                  <input type="radio" :value="key" v-model="category" class="sr-only" />
                  <div class="cat-option__icon" :style="{ background: cat.color }">
                    <img :src="cat.icon" :alt="getCategoryLabel(key)" />
                  </div>
                  <span class="cat-option__name">{{ getCategoryLabel(key) }}</span>
                </label>
              </div>
            </div>

            <!-- ACTIONS -->
            <div class="form-actions">
              <button type="button" class="btn btn--cancel" @click="$emit('close')">
                {{ t('cancel') }}
              </button>
              <button type="submit" class="btn btn--save" :disabled="!title || !category">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {{ t('save') }}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { categories } from '../config/categories.js'
import { getLabel } from '../config/i18n.js'

const props = defineProps({
  newPoint: Object,
  language: { type: String, default: 'de' }
})

const emit = defineEmits(['save', 'close'])

const title       = ref('')
const author      = ref('')
const description = ref('')
const category    = ref('')

const t = (key) => getLabel(key, props.language)
const getCategoryLabel = (key) => getLabel(`categories.${key}`, props.language)
const slugify = (str) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

function save() {
  if (!title.value || !category.value) return
  emit('save', {
    ...props.newPoint,
    title: title.value,
    author: author.value,
    description: description.value,
    category: category.value
  })
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;1,9..144,400&family=Syne:wght@600;800&display=swap');

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
  max-width: 780px;
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

/* ─── BROWSER BAR ────────────────────────────────────────── */
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
.traffic-close { background: #FF5F57; border: 1px solid #E0443E; }
.traffic-min   { background: #FFBD2E; border: 1px solid #DFA123; cursor: default; }
.traffic-max   { background: #28C840; border: 1px solid #1DAD2B; cursor: default; }
.traffic-close svg { opacity: 0; transition: opacity 0.1s; }
.traffic-close:hover svg { opacity: 1; }

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

/* ─── TABS ───────────────────────────────────────────────── */
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
  padding: 0 8px;
  cursor: pointer;
  height: 24px;
  display: flex;
  align-items: center;
}
.tab-new:hover { color: #333; }

/* ─── PAGE ───────────────────────────────────────────────── */
.page {
  background: #F2EDE7;
  display: flex;
  flex-direction: column;
}

/* ─── HERO ───────────────────────────────────────────────── */
.hero {
  background: #1C1C3A;
  padding: 14px clamp(18px, 4vw, 32px) 12px;
  position: relative;
  overflow: hidden;
}
.hero__texture {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
  background-size: 22px 22px;
  pointer-events: none;
}
.hero__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
}
.hero__inner { position: relative; z-index: 1; }

.hero__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}
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
.hero__title {
  font-family: 'Fraunces', serif;
  font-weight: 700;
  font-size: clamp(20px, 3.5vw, 30px);
  color: #FFFFFF;
  margin: 0;
  line-height: 1.05;
  letter-spacing: -0.02em;
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

/* ─── FORM BODY ──────────────────────────────────────────── */
.form-body {
  display: flex;
  flex-direction: column;
}

.form-cols {
  display: grid;
  grid-template-columns: 1fr auto;
}

/* ─── FIELDS ─────────────────────────────────────────────── */
.form-fields {
  padding: 16px clamp(16px, 3vw, 28px) 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-right: 1px solid #D9D5CE;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.form-label {
  font-family: 'Syne', sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #9996B0;
}
.form-input {
  font-family: 'Fraunces', serif;
  font-size: 14px;
  font-weight: 300;
  color: #1C1C3A;
  background: rgba(255,255,255,0.6);
  border: 1.5px solid rgba(28, 28, 58, 0.15);
  border-radius: 8px;
  padding: 8px 12px;
  outline: none;
  transition: all 0.15s ease;
  width: 100%;
  box-sizing: border-box;
}
.form-input:focus {
  background: rgba(255,255,255,0.92);
  border-color: #E8521A;
  box-shadow: 0 0 0 3px rgba(232, 82, 26, 0.12);
}
.form-input::placeholder {
  color: rgba(28, 28, 58, 0.3);
  font-style: italic;
}
.form-textarea {
  resize: vertical;
  min-height: 72px;
  line-height: 1.6;
}

/* ─── MAP CARD ───────────────────────────────────────────── */
.map-card {
  width: clamp(110px, 20vw, 170px);
  flex-shrink: 0;
}
.map-card__inner {
  height: 100%;
  position: relative;
  overflow: hidden;
  background: #E8E5F0;
  display: flex;
  flex-direction: column;
}
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
.map-road { position: absolute; background: rgba(255,255,255,0.7); }
.map-road--h { left: 0; right: 0; height: 8px; }
.map-road--v { top: 0; bottom: 0; width: 8px; }
.map-road--1 { top: calc(50% - 4px) }
.map-road--2 { top: calc(30% - 4px); opacity: 0.5 }
.map-road--3 { left: calc(40% - 4px) }

.map-pin-wrap {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -65%);
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
.map-label {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  background: #1C1C3A;
  padding: 7px 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'Syne', sans-serif;
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.5);
}

/* ─── CATEGORY SECTION ───────────────────────────────────── */
.form-section {
  padding: 12px clamp(16px, 3vw, 28px) 14px;
  border-top: 1px solid #D9D5CE;
}
.section-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Syne', sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #9996B0;
  margin-bottom: 10px;
}
.section-label__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #E8521A;
  display: block;
  flex-shrink: 0;
}

.category-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.cat-option {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 6px 12px 6px 6px;
  background: rgba(255,255,255,0.5);
  border: 1.5px solid rgba(28, 28, 58, 0.12);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;
}
.cat-option:hover {
  background: rgba(255,255,255,0.8);
  border-color: rgba(28, 28, 58, 0.25);
}
.cat-option--active {
  background: rgba(255,255,255,0.85);
  border-color: var(--cat-color, #E8521A);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--cat-color, #E8521A) 20%, transparent);
}
.cat-option__icon {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s;
}
.cat-option__icon img {
  width: 15px;
  height: 15px;
  object-fit: contain;
  filter: brightness(0) invert(1);
}
.cat-option__name {
  font-family: 'Syne', sans-serif;
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: #1C1C3A;
  white-space: nowrap;
}

/* ─── ACTIONS ────────────────────────────────────────────── */
.form-actions {
  display: flex;
  gap: 10px;
  padding: 12px clamp(16px, 3vw, 28px) 16px;
  border-top: 1px solid #D9D5CE;
  background: #EAE6DF;
}

.btn {
  font-family: 'Syne', sans-serif;
  font-size: 11px;
  text-transform: uppercase;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  gap: 7px;
}
.btn--save {
  background: #E8521A;
  color: white;
  border: 1.5px solid rgba(0,0,0,0.15);
  box-shadow: 0 3px 0 0 rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2);
  flex: 1;
  justify-content: center;
}
.btn--save:hover:not(:disabled) {
  background: #D94515;
  box-shadow: 0 2px 0 0 rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2);
  transform: translateY(1px);
}
.btn--save:disabled {
  background: #C4C4D8;
  color: rgba(28,28,58,0.4);
  box-shadow: none;
  cursor: not-allowed;
}
.btn--cancel {
  background: rgba(255,255,255,0.5);
  color: #4B4B6A;
  border: 1.5px solid rgba(28,28,58,0.15);
  box-shadow: 0 3px 0 0 rgba(0,0,0,0.08);
}
.btn--cancel:hover {
  background: rgba(255,255,255,0.85);
  transform: translateY(1px);
  box-shadow: 0 2px 0 0 rgba(0,0,0,0.08);
}

.sr-only {
  position: absolute; width: 1px; height: 1px;
  padding: 0; margin: -1px; overflow: hidden;
  clip: rect(0,0,0,0); white-space: nowrap; border-width: 0;
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
    font-size: 24px;
  }
}

@media (max-width: 580px) {
  .form-cols {
    grid-template-columns: 1fr;
  }
  .map-card {
    width: 100%;
    border-top: 1px solid #D9D5CE;
    border-right: none;
    min-height: 90px;
  }
  .map-card__inner { min-height: 90px; }
  .form-fields {
    border-right: none;
    padding: 14px 16px 12px;
  }
  .form-section {
    padding: 12px 16px 14px;
  }
  .form-actions {
    padding: 12px 16px 16px;
  }
  .browser-actions { display: none; }
  .tab--inactive, .tab-new { display: none; }
  .category-grid {
    gap: 6px;
  }
  .cat-option {
    font-size: 10px;
    padding: 6px 10px 6px 6px;
  }
  .hero {
    padding: 14px 16px 12px;
  }
  .corner-icon-wrap {
    width: 32px;
    height: 32px;
  }
  .corner-icon {
    width: 17px;
    height: 17px;
  }
}

@media (max-width: 420px) {
  .browser-bar { padding: 0 10px; }
  .addr-text { font-size: 9.5px; }
  .category-grid { gap: 5px; }
  .btn {
    font-size: 10px;
    padding: 9px 16px;
  }
  .form-label {
    font-size: 9.5px;
  }
  .form-input {
    font-size: 13px;
    padding: 7px 11px;
  }
}
</style>
