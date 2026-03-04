<template>
  <Teleport to="body">
    <div class="backdrop" @click.self="$emit('close')">
      <div class="modal">

        <!-- HEADER BAR -->
        <header class="modal__header">
          <div class="header__pin-group">
            <svg width="16" height="19" viewBox="0 0 16 19" fill="none">
              <path d="M8 0C4.686 0 2 2.686 2 6c0 4.125 6 11 6 11s6-6.875 6-11c0-3.314-2.686-6-6-6z" fill="#E8521A"/>
              <circle cx="8" cy="6" r="2" fill="white" opacity="0.55"/>
            </svg>
            <span class="header__label">{{ t('newSpot') }}</span>
          </div>
          <div class="header__right">
            <div class="header__dots">
              <span class="hdot"></span>
              <span class="hdot"></span>
              <span class="hdot"></span>
            </div>
            <button class="modal__close" @click="$emit('close')" :aria-label="t('close')">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </header>

        <!-- BODY -->
        <div class="modal__body">
          <form class="modal__form" @submit.prevent="save">

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

            <div class="form-group">
              <label class="form-label">{{ t('category') }}</label>
              <div class="category-options">
                <label
                  v-for="(cat, key) in categories"
                  :key="key"
                  class="category-option"
                  :class="{ 'category-option--active': category === key }"
                  :style="category === key ? { '--cat-color': cat.color } : {}"
                >
                  <input type="radio" :value="key" v-model="category" class="sr-only" />
                  <div class="category-icon-wrap" :style="{ background: cat.color }">
                    <img :src="cat.icon" :alt="getCategoryLabel(key)" class="category-icon" />
                  </div>
                  <span class="category-name">{{ getCategoryLabel(key) }}</span>
                </label>
              </div>
            </div>

            <div class="modal__actions">
              <button type="button" class="btn btn-secondary" @click="$emit('close')">
                {{ t('cancel') }}
              </button>
              <button type="submit" class="btn btn-primary" :disabled="!title || !category">
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

/* ── MODAL ── */
.modal {
  width: 100%;
  max-width: 460px;
  border-radius: 12px;
  border: 2px solid #1C1C3A;
  overflow: hidden;
  position: relative;
  animation: slideUp 0.32s cubic-bezier(0.23, 1, 0.32, 1);
  filter: drop-shadow(5px 5px 0px #1C1C3A);
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── HEADER ── */
.modal__header {
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

.modal__close {
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
.modal__close:hover { background: rgba(255, 255, 255, 0.32); }

/* ── BODY ── */
.modal__body {
  background: #C4C4D8;
  border-radius: 0 0 10px 10px;
  padding: 16px 20px 20px 20px;
  position: relative;
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

/* ── FORM ── */
.modal__form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: relative;
  z-index: 1;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-label {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: #1C1C3A;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  opacity: 0.6;
}

.form-input {
  font-family: 'Barlow', sans-serif;
  font-size: 14px;
  color: #1C1C3A;
  background: rgba(255, 255, 255, 0.55);
  border: 2px solid rgba(28, 28, 58, 0.18);
  border-radius: 8px;
  padding: 10px 13px;
  outline: none;
  transition: all 0.15s ease;
}
.form-input:focus {
  background: rgba(255, 255, 255, 0.85);
  border-color: #E8521A;
  box-shadow: 0 0 0 3px rgba(232, 82, 26, 0.15);
}
.form-input::placeholder {
  color: rgba(28, 28, 58, 0.35);
  font-style: italic;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
  line-height: 1.55;
}

/* ── CATEGORY OPTIONS ── */
.category-options {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.category-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 8px;
  background: rgba(255, 255, 255, 0.45);
  border: 2px solid rgba(28, 28, 58, 0.15);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.category-option:hover {
  background: rgba(255, 255, 255, 0.7);
  border-color: rgba(28, 28, 58, 0.3);
}
.category-option--active {
  background: rgba(255, 255, 255, 0.75);
  border-color: var(--cat-color, #E8521A);
  border-width: 2px;
  box-shadow: 0 0 0 2px rgba(232, 82, 26, 0.15);
}

.category-icon-wrap {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.category-icon {
  width: 18px;
  height: 18px;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.category-name {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: #1C1C3A;
  text-align: center;
  line-height: 1.2;
}

/* ── ACTIONS ── */
.modal__actions {
  display: flex;
  gap: 10px;
  padding-top: 4px;
}

.btn {
  flex: 1;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 11px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-primary {
  background: #E8521A;
  color: white;
  border: 2px solid #1C1C3A;
  box-shadow: 3px 3px 0px #1C1C3A;
}
.btn-primary:hover:not(:disabled) {
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0px #1C1C3A;
}
.btn-primary:active:not(:disabled) {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0px #1C1C3A;
}
.btn-primary:disabled {
  background: rgba(28, 28, 58, 0.2);
  color: rgba(28, 28, 58, 0.4);
  border-color: rgba(28, 28, 58, 0.2);
  box-shadow: none;
  cursor: not-allowed;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.45);
  color: #1C1C3A;
  border: 2px solid rgba(28, 28, 58, 0.25);
  box-shadow: 3px 3px 0px rgba(28, 28, 58, 0.15);
}
.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.7);
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0px rgba(28, 28, 58, 0.15);
}
.btn-secondary:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0px rgba(28, 28, 58, 0.15);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
