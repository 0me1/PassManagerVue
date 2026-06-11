<script setup>
import { ref } from 'vue'
import StartPage from './components/StartPage.vue'
import PasswordManager from './components/PasswordManager.vue'
import InfoPage from './components/InfoPage.vue'

const currentPage = ref('start') // 'start' или 'manager'
</script>

<template>
  <div class="app">
    <StartPage v-if="currentPage === 'start'" @navigate="currentPage = 'manager'" @info="currentPage = 'info'" />
    <InfoPage v-else-if="currentPage === 'info'" @back = "currentPage = 'start'" />
    <PasswordManager v-else @back="currentPage = 'start'" />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>
