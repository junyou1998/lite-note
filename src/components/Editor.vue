<template>
  <div class="h-full flex flex-col bg-white dark:bg-black relative group transition-colors duration-300">
    <!-- Toolbar (Top right) -->
    <div
      class="absolute top-4 right-4 flex items-center gap-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <div class="flex items-center gap-2 border-r border-gray-200 dark:border-gray-800 pr-4 mr-4">
        <button @click="decreaseFontSize"
          class="p-1 text-gray-400 hover:text-black dark:text-gray-500 dark:hover:text-white transition-colors rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          title="縮小字體">
          <Minus class="w-4 h-4" />
        </button>
        <span class="text-xs text-gray-500 font-mono w-8 text-center">{{ fontSize }}px</span>
        <button @click="increaseFontSize"
          class="p-1 text-gray-400 hover:text-black dark:text-gray-500 dark:hover:text-white transition-colors rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          title="放大字體">
          <Plus class="w-4 h-4" />
        </button>
      </div>
      <div class="text-xs text-gray-400 dark:text-gray-500 font-mono">
        {{ charCount }} 字元
      </div>
      <button @click="downloadTxt"
        class="p-2 text-gray-400 hover:text-black dark:text-gray-500 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        title="下載 TXT">
        <Download class="w-5 h-5" />
      </button>
    </div>

    <textarea v-if="currentNote" ref="textareaRef" v-model="content"
      class="flex-1 w-full h-full p-8 resize-none outline-none text-gray-800 dark:text-gray-200 bg-transparent leading-relaxed font-sans placeholder-gray-300 dark:placeholder-gray-700"
      :style="{ fontSize: `${fontSize}px` }" placeholder="開始輸入..." spellcheck="false"></textarea>

    <div v-else class="flex-1 flex flex-col items-center justify-center text-gray-300 dark:text-gray-700 select-none">
      <p class="mb-2">沒有開啟的記事</p>
      <p class="text-sm">請從左側選擇或建立新記事</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { useStorage } from '@vueuse/core';
import { useNoteStorage } from '../composables/useStorage';
import { Download, Plus, Minus } from 'lucide-vue-next';

const { lastActiveNoteId, getNote, updateNote } = useNoteStorage();

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
  const title = currentNote.value.title || content.value.split('\n')[0]?.trim() || 'untitled';
  // Sanitize filename
  const safeTitle = title.replace(/[^a-z0-9\u4e00-\u9fa5]/gi, '_').substring(0, 30);

  link.download = `${safeTitle || 'note'}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}
</script>
