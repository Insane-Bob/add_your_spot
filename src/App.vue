<template>
  <div id="app">
    <!-- Language Switcher -->
    <div class="language-switcher">
      <button
        @click="setLanguage('de')"
        :class="{ active: currentLanguage === 'de' }"
      >
        🇩🇪 Deutsch
      </button>
      <button
        @click="setLanguage('en')"
        :class="{ active: currentLanguage === 'en' }"
      >
        🇬🇧 English
      </button>
    </div>

    <MapView :language="currentLanguage" />
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import MapView from './components/MapView.vue'

const currentLanguage = ref('de')

const setLanguage = (lang) => {
  currentLanguage.value = lang
}

// Provide la langue à tous les composants enfants
provide('language', currentLanguage)
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: fixed;
  margin: 0;
  padding: 0;
}

#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: fixed;
  inset: 0;
}

.language-switcher {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 1000;
  display: flex;
  gap: 5px;
  background: white;
  padding: 5px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.language-switcher button {
  padding: 6px 12px;
  border: none;
  background: #f0f0f0;
  cursor: pointer;
  border-radius: 3px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.language-switcher button:hover {
  background: #e0e0e0;
}

.language-switcher button.active {
  background: #d34c15;
  color: white;
}
</style>

