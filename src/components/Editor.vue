<template>
  <div class="h-full flex flex-col bg-white dark:bg-black relative group transition-colors duration-300">
    <!-- Toolbar (Static Header) -->
    <div
      class="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-black z-10">
      <!-- Left: Sidebar Toggle -->
      <div class="flex items-center">
        <button @click="toggleDesktopSidebar"
          class="hidden md:flex p-2 -ml-2 text-gray-400 hover:text-black dark:text-gray-500 dark:hover:text-white transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          :title="isDesktopSidebarOpen ? t('actions.collapse_sidebar') : t('actions.expand_sidebar')">
          <PanelLeft class="w-5 h-5" />
        </button>
      </div>

      <!-- Right: Tools -->
      <div class="flex items-center">
        <div class="flex items-center gap-2 border-r border-gray-200 dark:border-gray-800 pr-4 mr-4">
          <button @click="decreaseFontSize"
            class="p-1 text-gray-400 hover:text-black dark:text-gray-500 dark:hover:text-white transition-colors rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            :title="t('actions.decrease_font')">
            <Minus class="w-4 h-4" />
          </button>
          <span class="text-xs text-gray-500 font-mono w-8 text-center">{{ fontSize }}px</span>
          <button @click="increaseFontSize"
            class="p-1 text-gray-400 hover:text-black dark:text-gray-500 dark:hover:text-white transition-colors rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            :title="t('actions.increase_font')">
            <Plus class="w-4 h-4" />
          </button>
        </div>
        <div class="text-xs text-gray-400 dark:text-gray-500 font-mono mr-4">
          {{ charCount }} {{ t('editor.chars') }}
        </div>
        <button @click="downloadTxt"
          class="p-2 text-gray-400 hover:text-black dark:text-gray-500 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          :title="t('actions.download')">
          <Download class="w-5 h-5" />
        </button>
      </div>
    </div>

    <textarea v-if="currentNote" ref="textareaRef" v-model="content"
      class="flex-1 w-full h-full p-6 resize-none outline-none text-gray-800 dark:text-gray-200 bg-transparent leading-relaxed font-sans placeholder-gray-300 dark:placeholder-gray-700"
      :style="{ fontSize: `${fontSize}px` }" :placeholder="t('editor.placeholder')" spellcheck="false"></textarea>

    <div v-else class="flex-1 flex flex-col items-center justify-center text-gray-300 dark:text-gray-700 select-none">
      <p class="mb-2">{{ t('editor.no_active_note') }}</p>
      <p class="text-sm">{{ t('editor.select_note_hint') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { useStorage } from '@vueuse/core';
import { useNoteStorage } from '../composables/useStorage';
import { useLayout } from '../composables/useLayout';
import { Download, Plus, Minus, PanelLeft } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

const { lastActiveNoteId, getNote, updateNote } = useNoteStorage();
const { toggleDesktopSidebar, isDesktopSidebarOpen } = useLayout();
const { t } = useI18n();

const currentNote = computed(() => {
  if (!lastActiveNoteId.value) return null;
  return getNote(lastActiveNoteId.value);
});

const content = ref('');

const textareaRef = ref<HTMLTextAreaElement | null>(null);

// Sync content when note changes
watch(currentNote, (newNote) => {
  if (newNote) {
    if (content.value !== newNote.content) {
      content.value = newNote.content;
    }
    // Auto-focus when opening a note
    nextTick(() => {
      textareaRef.value?.focus();
    });
  } else {
    content.value = '';
  }
}, { immediate: true });

// Auto-save when content changes
watch(content, (newContent) => {
  if (currentNote.value && currentNote.value.content !== newContent) {
    updateNote(currentNote.value.id, newContent);
  }
});

const fontSize = useStorage('litenote_fontsize', 18);

function increaseFontSize() {
  if (fontSize.value < 48) fontSize.value += 2;
}

function decreaseFontSize() {
  if (fontSize.value > 12) fontSize.value -= 2;
}

const charCount = computed(() => content.value.length);

function downloadTxt() {
  if (!currentNote.value) return;

  const blob = new Blob([content.value], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;

  // Use title if available, else first line, else untitled
  const title = currentNote.value.title || content.value.split('\n')[0]?.trim() || t('editor.untitled');
  // Sanitize filename
  const safeTitle = title.replace(/[^a-z0-9\u4e00-\u9fa5]/gi, '_').substring(0, 30);

  link.download = `${safeTitle || 'note'}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}
</script>
