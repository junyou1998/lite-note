<template>
  <div
    class="h-full flex flex-col bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 w-full sm:w-64 transition-colors duration-300">
    <!-- Mobile Menu Overlay -->
    <div v-if="mobileMenuId" class="fixed inset-0 z-30 bg-transparent" @click.stop="mobileMenuId = null"></div>

    <!-- Header -->
    <div
      class="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900/50 sm:bg-transparent backdrop-blur-sm">
      <h1 class="font-bold text-lg tracking-tight text-gray-900 dark:text-white">LiteNote</h1>
      <div class="flex items-center gap-1">
        <button @click="openSettings"
          class="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-600 dark:text-gray-400"
          title="設定">
          <Settings class="w-5 h-5" />
        </button>
        <button @click="toggleTheme"
          class="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-600 dark:text-gray-400"
          :title="`切換主題 (${themeLabel})`">
          <Sun v-if="theme === 'light'" class="w-5 h-5" />
          <Moon v-else-if="theme === 'dark'" class="w-5 h-5" />
          <Monitor v-else class="w-5 h-5" />
        </button>
        <button @click="handleCreate"
          class="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-900 dark:text-white"
          title="新增記事">
          <Plus class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Note List -->
    <div class="flex-1 overflow-y-auto">
      <div v-if="notes.length === 0" class="p-8 text-gray-400 dark:text-gray-600 text-center text-sm">
        尚無記事<br>點擊上方 + 新增
      </div>
      <div v-for="note in sortedNotes" :key="note.id" @click="handleNoteClick(note)"
        @touchstart="handleTouchStart(note)" @touchmove="handleTouchMove" @touchend="handleTouchEnd"
        class="p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors group relative select-none"
        :class="{
          'bg-white dark:bg-gray-800 border-l-4 border-l-black dark:border-l-white shadow-sm': lastActiveNoteId === note.id,
          'z-40': mobileMenuId === note.id
        }" @dblclick="startRenaming(note)">
        <div v-if="renamingId === note.id" class="mr-2">
          <input ref="renameInput" v-model="renameValue" @blur="finishRenaming" @keyup.enter="finishRenaming"
            @click.stop
            class="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 text-sm text-gray-900 dark:text-white outline-none focus:border-gray-400 dark:focus:border-gray-500 focus:bg-white dark:focus:bg-gray-700 transition-all" />
        </div>
        <template v-else>
          <h3 class="font-medium text-gray-800 dark:text-gray-200 truncate pr-6 text-sm">
            {{ note.title || getTitle(note.content) }}
          </h3>
          <p class="text-xs text-gray-500 dark:text-gray-500 mt-1 font-mono">
            {{ formatDate(note.updatedAt) }}
          </p>
        </template>

        <div v-if="renamingId !== note.id" class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <!-- Desktop Hover Actions -->
          <div class="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button @click.stop="startRenaming(note)"
              class="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              title="重新命名">
              <Edit2 class="w-3.5 h-3.5" />
            </button>
            <button @click.stop="confirmDelete(note)"
              class="p-1.5 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
              title="刪除">
              <Trash2 class="w-3.5 h-3.5" />
            </button>
          </div>

          <!-- Mobile More Button -->
          <div class="sm:hidden relative">
            <button @click.stop="toggleMobileMenu(note.id)"
              class="p-2 text-gray-400 active:text-gray-600 dark:active:text-gray-300 rounded-md active:bg-gray-200 dark:active:bg-gray-700">
              <MoreVertical class="w-4 h-4" />
            </button>

            <!-- Mobile Menu Dropdown -->
            <div v-if="mobileMenuId === note.id"
              class="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-10 py-1 overflow-hidden">
              <button @click.stop="startRenaming(note); mobileMenuId = null"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                <Edit2 class="w-3.5 h-3.5" />
                重新命名
              </button>
              <button @click.stop="confirmDelete(note); mobileMenuId = null"
                class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                <Trash2 class="w-3.5 h-3.5" />
                刪除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <Modal :is-open="showDeleteModal" title="刪除記事" :is-destructive="true" confirm-text="刪除"
      @close="showDeleteModal = false" @confirm="executeDelete">
      確定要刪除此記事嗎？此動作無法復原。
    </Modal>

    <!-- Settings Modal -->
    <Modal :is-open="showSettingsModal" title="設定" confirm-text="變更密碼" @close="showSettingsModal = false"
      @confirm="handleChangePin">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">舊 PIN 碼</label>
          <input v-model="oldPin" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="6"
            class="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
            placeholder="輸入目前的 PIN 碼" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">新 PIN 碼</label>
          <input v-model="newPin" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="6"
            class="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
            placeholder="輸入新的 PIN 碼 (至少 4 碼)" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">確認新 PIN 碼</label>
          <input v-model="confirmNewPin" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="6"
            class="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
            placeholder="再次輸入新的 PIN 碼" />
        </div>

        <div v-if="settingsError" class="text-red-500 text-sm">{{ settingsError }}</div>
        <div v-if="settingsSuccess" class="text-green-500 text-sm">{{ settingsSuccess }}</div>
        <div v-if="isChangingPin" class="text-gray-500 text-sm">正在加密資料...</div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick } from 'vue';
import { useNoteStorage, type Note } from '../composables/useStorage';
import { useTheme } from '../composables/useTheme';
import { Plus, Trash2, Edit2, Sun, Moon, Monitor, MoreVertical, Settings } from 'lucide-vue-next';
import Modal from './Modal.vue';

const emit = defineEmits(['close-sidebar']);

const { notes, lastActiveNoteId, createNote, deleteNote, updateNoteTitle, changePin } = useNoteStorage();
const { theme, toggleTheme, themeLabel } = useTheme();

// Mobile Menu Logic
const mobileMenuId = ref<string | null>(null);

function toggleMobileMenu(id: string) {
  if (mobileMenuId.value === id) {
    mobileMenuId.value = null;
  } else {
    mobileMenuId.value = id;
  }
}

// Settings Logic
const showSettingsModal = ref(false);
const oldPin = ref('');
const newPin = ref('');
const confirmNewPin = ref('');
const settingsError = ref('');
const settingsSuccess = ref('');
const isChangingPin = ref(false);

function openSettings() {
  showSettingsModal.value = true;
  oldPin.value = '';
  newPin.value = '';
  confirmNewPin.value = '';
  settingsError.value = '';
  settingsSuccess.value = '';
}

async function handleChangePin() {
  settingsError.value = '';
  settingsSuccess.value = '';

  if (!oldPin.value || !newPin.value || !confirmNewPin.value) {
    settingsError.value = '請填寫所有欄位';
    return;
  }

  if (newPin.value.length < 4) {
    settingsError.value = '新 PIN 碼至少需要 4 碼';
    return;
  }

  if (newPin.value !== confirmNewPin.value) {
    settingsError.value = '新 PIN 碼不一致';
    return;
  }

  if (oldPin.value === newPin.value) {
    settingsError.value = '新 PIN 碼不能與舊 PIN 碼相同';
    return;
  }

  isChangingPin.value = true;
  try {
    await changePin(oldPin.value, newPin.value);
    settingsSuccess.value = '密碼變更成功！';
    oldPin.value = '';
    newPin.value = '';
    confirmNewPin.value = '';
    setTimeout(() => {
      showSettingsModal.value = false;
    }, 1500);
  } catch (e: any) {
    settingsError.value = e.message || '變更失敗';
  } finally {
    isChangingPin.value = false;
  }
}

// Long Press Logic
const longPressTimer = ref<any>(null);
const isLongPress = ref(false);

function handleTouchStart(note: Note) {
  isLongPress.value = false;
  longPressTimer.value = setTimeout(() => {
    isLongPress.value = true;
    // Vibrate if supported
    if (navigator.vibrate) navigator.vibrate(50);
    startRenaming(note);
  }, 500);
}

function handleTouchMove() {
  clearTimeout(longPressTimer.value);
}

function handleTouchEnd() {
  clearTimeout(longPressTimer.value);
}

function handleNoteClick(note: Note) {
  if (isLongPress.value) {
    isLongPress.value = false;
    return;
  }
  selectNote(note.id);
}

// Delete Logic
const showDeleteModal = ref(false);
const noteToDelete = ref<string | null>(null);

function confirmDelete(note: Note) {
  // Smart delete: if empty, delete immediately without confirmation
  if (!note.content.trim() && !note.title) {
    deleteNote(note.id);
    return;
  }

  noteToDelete.value = note.id;
  showDeleteModal.value = true;
}

function executeDelete() {
  if (noteToDelete.value) {
    deleteNote(noteToDelete.value);
    noteToDelete.value = null;
    showDeleteModal.value = false;
  }
}

// Rename Logic
const renamingId = ref<string | null>(null);
const renameValue = ref('');
const renameInput = ref<HTMLInputElement[] | null>(null);

function startRenaming(note: Note) {
  renamingId.value = note.id;
  renameValue.value = note.title || getTitle(note.content);
  nextTick(() => {
    renameInput.value?.[0]?.focus();
  });
}

function finishRenaming() {
  if (renamingId.value) {
    // If empty, it will fall back to first line in display, so we can save as undefined or empty string
    // Let's save as string, but if it matches the auto-generated title, maybe we can keep it?
    // User asked for "Rename", so we save what they typed.
    updateNoteTitle(renamingId.value, renameValue.value);
    renamingId.value = null;
  }
}

// General
const sortedNotes = computed(() => {
  return [...notes.value].sort((a, b) => b.updatedAt - a.updatedAt);
});

function selectNote(id: string) {
  if (mobileMenuId.value) {
    mobileMenuId.value = null;
  }
  lastActiveNoteId.value = id;
  emit('close-sidebar');
}

function handleCreate() {
  createNote();
  emit('close-sidebar');
}

function getTitle(content: string) {
  const firstLine = content.split('\n')[0]?.trim();
  return firstLine || '無標題';
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleString('zh-TW', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
</script>
