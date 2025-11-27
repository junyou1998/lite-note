<template>
  <div :class="{ 'dark': isDark }">
    <div class="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <LockScreen v-if="!isUnlocked" @unlocked="handleUnlock" />
      <MainLayout v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNoteStorage } from './composables/useStorage';
import { useTheme } from './composables/useTheme';
import { useTitle } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import LockScreen from './components/LockScreen.vue';
import MainLayout from './components/MainLayout.vue';

const { isUnlocked } = useNoteStorage();
const { isDark } = useTheme();
const { t } = useI18n();

useTitle(() => t('app.title'));

const handleUnlock = () => {
  // Unlock logic handled in LockScreen
};
</script>
