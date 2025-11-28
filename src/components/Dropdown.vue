<template>
    <div class="relative" ref="container">
        <button @click="toggle" type="button" ref="trigger"
            class="w-full flex items-center justify-between bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all">
            <span class="truncate">{{ selectedLabel }}</span>
            <ChevronDown class="w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200"
                :class="{ 'rotate-180': isOpen }" />
        </button>

        <Teleport to="body">
            <Transition enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0">
                <div v-if="isOpen" :style="dropdownStyle" ref="dropdownContent"
                    class="fixed z-[60] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none py-1">
                    <button v-for="option in options" :key="option.value" @click="select(option)" type="button"
                        class="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
                        :class="[
                            modelValue === option.value ? 'text-black dark:text-white font-medium bg-gray-50 dark:bg-gray-700/50' : 'text-gray-700 dark:text-gray-300'
                        ]">
                        <span class="truncate">{{ option.label }}</span>
                        <Check v-if="modelValue === option.value" class="w-4 h-4" />
                    </button>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { ChevronDown, Check } from 'lucide-vue-next';

interface Option {
    label: string;
    value: string;
}

const props = defineProps<{
    modelValue: string;
    options: Option[];
}>();

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const container = ref<HTMLElement | null>(null);
const trigger = ref<HTMLElement | null>(null);
const dropdownContent = ref<HTMLElement | null>(null);
const dropdownStyle = ref({});

const selectedLabel = computed(() => {
    const option = props.options.find(o => o.value === props.modelValue);
    return option ? option.label : props.modelValue;
});

function updatePosition() {
    if (!trigger.value) return;
    const rect = trigger.value.getBoundingClientRect();
    dropdownStyle.value = {
        top: `${rect.bottom + 4}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`
    };
}

function toggle() {
    isOpen.value = !isOpen.value;
    if (isOpen.value) {
        nextTick(() => {
            updatePosition();
        });
    }
}

function select(option: Option) {
    emit('update:modelValue', option.value);
    isOpen.value = false;
}

function handleClickOutside(event: MouseEvent) {
    if (!isOpen.value) return;

    const target = event.target as Node;
    const isClickInsideTrigger = container.value?.contains(target);
    const isClickInsideDropdown = dropdownContent.value?.contains(target);

    if (!isClickInsideTrigger && !isClickInsideDropdown) {
        isOpen.value = false;
    }
}

function handleResize() {
    if (isOpen.value) {
        updatePosition();
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true); // Capture scroll events
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('scroll', handleResize, true);
});
</script>
