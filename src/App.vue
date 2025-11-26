<template>
  <div class="antialiased text-gray-900 h-screen w-screen overflow-hidden font-sans">
    <LockScreen v-if="!isUnlocked" @unlocked="isUnlocked = true" />
    <MainLayout v-else />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LockScreen from './components/LockScreen.vue';
import MainLayout from './components/MainLayout.vue';
import { useTheme } from './composables/useTheme';

// Initialize theme globally
useTheme();

const isUnlocked = ref(false);
</script>
