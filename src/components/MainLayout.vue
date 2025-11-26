<template>
  <div class="flex h-screen w-screen overflow-hidden bg-white dark:bg-black transition-colors duration-300">
    <!-- Sidebar (Desktop) -->
    <div class="hidden md:block h-full border-r border-gray-200 dark:border-gray-800 w-64 flex-shrink-0">
      <Sidebar />
    </div>

    <!-- Sidebar (Mobile Drawer) -->
    <div v-if="isSidebarOpen" class="fixed inset-0 z-40 md:hidden">
      <div class="absolute inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm" @click="isSidebarOpen = false"></div>
      <div class="absolute inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 shadow-xl z-50">
        <Sidebar @close-sidebar="isSidebarOpen = false" />
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col h-full relative min-w-0 bg-white dark:bg-black">
      <!-- Mobile Header -->
      <div
        class="md:hidden p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900 z-20">
        <button @click="isSidebarOpen = true" class="p-2 -ml-2 text-gray-600 dark:text-gray-400">
          <Menu class="w-6 h-6" />
        </button>
        <span class="font-bold text-gray-800 dark:text-white">LiteNote</span>
        <div class="w-6"></div> <!-- Spacer -->
      </div>

      <Editor />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Sidebar from './Sidebar.vue';
import Editor from './Editor.vue';
import { Menu } from 'lucide-vue-next';

const isSidebarOpen = ref(false);
</script>
