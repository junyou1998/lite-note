<template>
    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog"
            aria-modal="true">
            <!-- Backdrop -->
            <div class="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" @click="close"></div>

            <!-- Panel -->
            <Transition enter-active-class="transition duration-200 ease-out"
                enter-from-class="opacity-0 scale-95 translate-y-4" enter-to-class="opacity-100 scale-100 translate-y-0"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="opacity-100 scale-100 translate-y-0"
                leave-to-class="opacity-0 scale-95 translate-y-4">
                <div
                    class="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all border border-gray-100 dark:border-gray-700">
                    <h3 v-if="title" class="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100 mb-2">
                        {{ title }}
                    </h3>

                    <div class="mt-2">
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                            <slot></slot>
                        </p>
                    </div>

                    <div class="mt-6 flex justify-end gap-3">
                        <button v-if="showCancel" type="button"
                            class="inline-flex justify-center rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 transition-colors"
                            @click="close">
                            {{ cancelText || t('actions.cancel') }}
                        </button>
                        <button type="button"
                            class="inline-flex justify-center rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-colors"
                            :class="[
                                isDestructive
                                    ? 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-500'
                                    : 'bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 focus-visible:ring-black'
                            ]" @click="confirm">
                            {{ confirmText || t('actions.confirm') }}
                        </button>
                    </div>
                </div>
            </Transition>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineProps({
    isOpen: Boolean,
    title: String,
    confirmText: String,
    cancelText: String,
    showCancel: {
        type: Boolean,
        default: true
    },
    isDestructive: Boolean
});

const emit = defineEmits(['close', 'confirm']);

function close() {
    emit('close');
}

function confirm() {
    emit('confirm');
}
</script>
