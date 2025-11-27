<template>
  <div
    class="fixed inset-0 bg-gray-100 dark:bg-gray-950 flex items-center justify-center z-50 transition-colors duration-300">
    <!-- Background Elements for Visual Interest -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-200/20 dark:bg-blue-900/10 blur-3xl">
      </div>
      <div
        class="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-200/20 dark:bg-purple-900/10 blur-3xl">
      </div>
    </div>

    <div
      class="relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl p-10 rounded-2xl shadow-2xl max-w-sm w-full text-center border border-white/50 dark:border-gray-800/50">
      <div class="mb-8">
        <div
          class="w-16 h-16 bg-black dark:bg-white rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg">
          <Lock class="w-8 h-8 text-white dark:text-black" />
        </div>
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
          {{ isSetup ? t('app.setup_title') : t('app.welcome') }}
        </h2>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-2">
          {{ isSetup ? t('app.setup_desc') : t('app.unlock_desc') }}
        </p>
      </div>

      <form @submit.prevent="submit">
        <div class="relative mb-8">
          <input v-model="pin" type="password" inputmode="numeric" :maxlength="isSetup ? 6 : undefined"
            class="w-full text-center text-4xl tracking-[0.5em] bg-transparent border-b-2 border-gray-200 dark:border-gray-700 focus:border-black dark:focus:border-white outline-none py-2 text-gray-900 dark:text-white transition-colors font-mono"
            placeholder="••••" autofocus autocomplete="current-password" />
        </div>

        <button type="submit"
          class="w-full bg-black dark:bg-white text-white dark:text-black py-3.5 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all transform hover:scale-[1.02] active:scale-[0.98] font-medium shadow-lg">
          {{ isSetup ? t('app.setup_btn') : t('app.unlock_btn') }}
        </button>
      </form>

      <p v-if="error" class="text-red-500 mt-4 text-sm font-medium animate-pulse">{{ error }}</p>

      <!-- Reset App Button (Visible after 3 failed attempts) -->
      <div v-if="failedAttempts >= 3" class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
        <button @click="showResetModal = true"
          class="text-xs text-gray-400 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400 transition-colors underline decoration-dotted">
          {{ t('app.reset_btn') }}
        </button>
      </div>

      <p v-if="isSetup" class="text-gray-400 dark:text-gray-600 mt-6 text-xs">
        {{ t('app.warning') }}
      </p>
    </div>

    <!-- Reset Confirmation Modal -->
    <Modal :is-open="showResetModal" :title="t('app.reset_warning_title')" :is-destructive="true"
      :confirm-text="t('app.reset_confirm_btn')" @close="showResetModal = false" @confirm="handleReset">
      <div class="space-y-4">
        <p class="text-red-600 dark:text-red-400 font-medium">
          {{ t('app.reset_warning_desc') }}
        </p>
        <div>
          <label class="block text-sm text-gray-700 dark:text-gray-300 mb-2">
            {{ t('app.reset_confirm_instruction', [t('app.reset_confirm_keyword')]) }}
          </label>
          <input v-model="resetConfirmInput" type="text"
            class="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
            :placeholder="t('app.reset_confirm_keyword')" />
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCrypto } from '../composables/useCrypto';
import { useStorage } from '@vueuse/core';
import { useNoteStorage } from '../composables/useStorage';
import { Lock } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import Modal from './Modal.vue';

const emit = defineEmits(['unlocked']);

const { hashPassword } = useCrypto();
const { init } = useNoteStorage();
const { t } = useI18n();
const storedHash = useStorage<string | null>('litenote_password_hash', null);
const pin = ref('');
const error = ref('');
const isSetup = ref(false);
const isLoading = ref(false);

// Reset Logic
const failedAttempts = ref(0);
const showResetModal = ref(false);
const resetConfirmInput = ref('');

onMounted(() => {
  if (!storedHash.value) {
    isSetup.value = true;
  }
});

const submit = async () => {
  // Validate numeric only
  if (!/^\d+$/.test(pin.value)) {
    error.value = t('messages.pin_numeric_only');
    return;
  }

  if (pin.value.length < 4) {
    error.value = t('messages.pin_min_length');
    return;
  }

  isLoading.value = true;
  error.value = '';

  try {
    if (isSetup.value) {
      // Setup new PIN
      const hash = await hashPassword(pin.value);
      storedHash.value = hash;
      await init(pin.value);
      emit('unlocked');
    } else {
      // Unlock
      const hash = await hashPassword(pin.value);
      if (hash === storedHash.value) {
        await init(pin.value);
        emit('unlocked');
      } else {
        error.value = t('messages.pin_error');
        pin.value = '';
        failedAttempts.value++;
      }
    }
  } catch (e: any) {
    error.value = e.message || t('messages.change_failed');
  } finally {
    isLoading.value = false;
  }
};

const handleReset = () => {
  if (resetConfirmInput.value === t('app.reset_confirm_keyword')) {
    localStorage.clear();
    location.reload();
  }
};
</script>
