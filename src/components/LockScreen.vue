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
          {{ isSetup ? '設定密碼' : '歡迎回來' }}
        </h2>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-2">
          {{ isSetup ? '請設定您的存取密碼' : '請輸入密碼以解鎖' }}
        </p>
      </div>

      <div class="relative mb-8">
        <input v-model="pin" type="password" inputmode="numeric" pattern="[0-9]*"
          class="w-full text-center text-4xl tracking-[0.5em] bg-transparent border-b-2 border-gray-200 dark:border-gray-700 focus:border-black dark:focus:border-white outline-none py-2 text-gray-900 dark:text-white transition-colors font-mono"
          placeholder="••••" @keyup.enter="submit" autofocus />
      </div>

      <button @click="submit"
        class="w-full bg-black dark:bg-white text-white dark:text-black py-3.5 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all transform hover:scale-[1.02] active:scale-[0.98] font-medium shadow-lg">
        {{ isSetup ? '設定並進入' : '解鎖' }}
      </button>

      <p v-if="error" class="text-red-500 mt-4 text-sm font-medium animate-pulse">{{ error }}</p>

      <p v-if="isSetup" class="text-gray-400 dark:text-gray-600 mt-6 text-xs">
        請務必記住您的密碼，遺失將無法復原資料。
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCrypto } from '../composables/useCrypto';
import { useStorage } from '@vueuse/core';
import { useNoteStorage } from '../composables/useStorage';
import { Lock } from 'lucide-vue-next';

const emit = defineEmits(['unlocked']);

const { hashPassword } = useCrypto();
const { init } = useNoteStorage();
const storedHash = useStorage<string | null>('litenote_password_hash', null);
const pin = ref('');
const error = ref('');
const isSetup = ref(false);
const isLoading = ref(false);

onMounted(() => {
  if (!storedHash.value) {
    isSetup.value = true;
  }
});

const submit = async () => {
  if (pin.value.length < 4) {
    error.value = 'PIN 碼至少需要 4 碼';
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
        error.value = '密碼錯誤';
        pin.value = '';
      }
    }
  } catch (e: any) {
    error.value = e.message || '發生錯誤';
  } finally {
    isLoading.value = false;
  }
};
</script>
