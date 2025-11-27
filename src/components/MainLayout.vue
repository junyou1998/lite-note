<template>
  <div class="flex h-screen w-screen overflow-hidden bg-white dark:bg-black transition-colors duration-300">
    <!-- Sidebar (Desktop) -->
    <div
      class="hidden md:block h-full border-r border-gray-200 dark:border-gray-800 flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden"
      :class="[isDesktopSidebarOpen ? 'w-64 opacity-100' : 'w-0 opacity-0 border-none']">
      <div class="w-64 h-full">
        <Sidebar @close-sidebar="isMobileSidebarOpen = false" />
      </div>
    </div>

    <!-- Sidebar (Mobile Drawer) -->
    <div class="relative z-40 md:hidden" role="dialog" aria-modal="true">
      <!-- Backdrop -->
      <Transition enter-active-class="transition-opacity duration-300 ease-linear" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition-opacity duration-300 ease-linear"
        leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="isMobileSidebarOpen" class="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm"
          @click="isMobileSidebarOpen = false"></div>
      </Transition>

      <!-- Sidebar Panel -->
      <Transition enter-active-class="transition duration-300 ease-in-out transform"
        enter-from-class="-translate-x-full" enter-to-class="translate-x-0"
        leave-active-class="transition duration-300 ease-in-out transform" leave-from-class="translate-x-0"
        leave-to-class="-translate-x-full">
        <div v-if="isMobileSidebarOpen" class="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 shadow-xl z-50">
          <Sidebar @close-sidebar="isMobileSidebarOpen = false" />
        </div>
      </Transition>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col h-full relative min-w-0 bg-white dark:bg-black">
      <!-- Mobile Header -->
      <div
        class="md:hidden p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900 z-20">
        <button @click="isMobileSidebarOpen = true" class="p-2 -ml-2 text-gray-600 dark:text-gray-400">
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
import Sidebar from './Sidebar.vue';
import Editor from './Editor.vue';
import { Menu } from 'lucide-vue-next';
import { useLayout } from '../composables/useLayout';

const { isDesktopSidebarOpen, isMobileSidebarOpen } = useLayout();
</script>
