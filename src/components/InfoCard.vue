<template>
  <Teleport to="body">
    <div class="backdrop" @click.self="$emit('close')">
      <div class="card">

        <!-- HEADER BAR -->
        <header class="card__header">
          <div class="header__pin-group">
            <svg width="16" height="19" viewBox="0 0 16 19" fill="none">
              <path d="M8 0C4.686 0 2 2.686 2 6c0 4.125 6 11 6 11s6-6.875 6-11c0-3.314-2.686-6-6-6z" fill="#E8521A"/>
              <circle cx="8" cy="6" r="2" fill="white" opacity="0.55"/>
            </svg>
            <span class="header__label">{{ t('favoriteSpots') }}</span>
          </div>
          <div class="header__right">
            <div class="header__dots">
              <span class="hdot"></span>
              <span class="hdot"></span>
              <span class="hdot"></span>
            </div>
            <button class="card__close" @click="$emit('close')" :aria-label="t('close')">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </header>

        <!-- BODY -->
        <div class="card__body">
          <!-- Content -->
          <div class="card__content">

            <!-- Category badge -->
            <div v-if="point.category && categories[point.category]"
                 class="category-badge">
              <div class="badge-icon-wrap" :style="{ backgroundColor: categories[point.category].color }">
                <img :src="categories[point.category].icon" :alt="getCategoryLabel(point.category)" class="badge-icon" />
              </div>
              <span class="category-label">{{ getCategoryLabel(point.category) }}</span>
            </div>

            <h2 class="card__title">{{ point.title }}</h2>

            <p v-if="point.author" class="card__author">
              <span class="author-dash">—</span> {{ point.author }}
            </p>

            <p class="card__description">{{ point.description || getEmptyMessage() }}</p>
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
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Barlow:wght@400;500;600&display=swap');

/* ── BACKDROP ── */
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 15, 35, 0.52);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1.5rem;
  animation: fadeIn 0.2s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; } to { opacity: 1; }
}

/* ── CARD ── */
.card {
  width: 100%;
  max-width: 420px;
  border-radius: 12px;
  border: 2px solid #1C1C3A;
  overflow: visible;
  position: relative;
  animation: slideUp 0.32s cubic-bezier(0.23, 1, 0.32, 1);
  filter: drop-shadow(5px 5px 0px #1C1C3A);
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── HEADER ── */
.card__header {
  background: #6B6BB5;
  border-radius: 10px 10px 0 0;
  border-bottom: 2px solid #1C1C3A;
  padding: 0 12px 0 14px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.header__pin-group {
  display: flex;
  align-items: center;
  gap: 5px;
  flex: 1;
  min-width: 0;
}

.header__label {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 17px;
  font-weight: 800;
  letter-spacing: 3px;
  color: #FFFFFF;
  text-transform: uppercase;
  white-space: nowrap;
}

.header__right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.header__dots {
  display: flex;
  gap: 7px;
  align-items: center;
}

.hdot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #E8521A;
  display: block;
  flex-shrink: 0;
}

/* ── CLOSE BUTTON ── */
.card__close {
  width: 26px;
  height: 26px;
  background: rgba(255, 255, 255, 0.18);
  border: 1.5px solid rgba(255, 255, 255, 0.35);
  border-radius: 5px;
  cursor: pointer;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  flex-shrink: 0;
}
.card__close:hover { background: rgba(255, 255, 255, 0.32); }

/* ── BODY ── */
.card__body {
  background: #C4C4D8;
  border-radius: 0 0 10px 10px;
  padding: 16px 20px 112px 20px;
  position: relative;
  min-height: 300px;
  overflow: hidden;
}

/* ── DOT GRID ── */
.dot-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 6px;
  position: absolute;
  top: 16px;
  left: 16px;
  width: 104px;
  pointer-events: none;
}
.dg-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #5a5a88;
  display: block;
  opacity: 0.5;
}

/* ── CONTENT ── */
.card__content {
  position: relative;
  z-index: 1;
}

/* ── CATEGORY BADGE ── */
.category-badge {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  background: rgba(255, 255, 255, 0.55);
  border: 2px solid rgba(28, 28, 58, 0.18);
  border-radius: 8px;
  padding: 6px 14px 6px 6px;
  margin-bottom: 12px;
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #1C1C3A;
}

.badge-icon-wrap {
  width: 28px;
  height: 28px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.badge-icon {
  width: 17px;
  height: 17px;
  object-fit: contain;
  display: block;
  filter: brightness(0) invert(1);
}

.category-label {
  font-size: 12px;
  letter-spacing: 1.2px;
}

/* ── TITLE ── */
.card__title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 34px;
  font-weight: 800;
  color: #1C1C3A;
  margin: 0 0 6px;
  line-height: 1.0;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

/* ── AUTHOR ── */
.card__author {
  font-family: 'Barlow', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: rgba(28, 28, 58, 0.55);
  margin: 0 0 12px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.author-dash {
  color: #E8521A;
  font-weight: 700;
}

/* ── DESCRIPTION ── */
.card__description {
  font-family: 'Barlow', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #2e2e50;
  line-height: 1.65;
  margin: 0;
}
</style>
