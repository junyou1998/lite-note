<template>
    <Teleport to="body">
        <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
            <div v-if="isOpen" class="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4" role="dialog"
                aria-modal="true">
                <!-- Backdrop -->
                <div class="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm transition-opacity"
                    @click="close">
                </div>

                <!-- Modal Panel -->
                <div
                    class="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col max-h-[70vh]">
                    <!-- Search Input -->
                    <div class="relative border-b border-gray-100 dark:border-gray-800">
                        <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input ref="searchInput" v-model="query" type="text"
                            class="w-full bg-transparent border-none py-4 pl-12 pr-4 text-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-0 outline-none"
                            :placeholder="t('actions.search_placeholder')" @keydown="handleInputKeydown" />
                        <div class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <kbd
                                class="hidden sm:inline-flex items-center h-5 px-1.5 text-[10px] font-medium text-gray-400 border border-gray-200 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800 font-sans">ESC</kbd>
                        </div>
                    </div>

                    <!-- Results List -->
                    <div class="flex-1 overflow-y-auto p-2" v-if="query">
                        <div v-if="filteredNotes.length === 0"
                            class="py-12 text-center text-gray-500 dark:text-gray-400">
                            <p>{{ t('actions.no_results') }}</p>
                        </div>
                        <div v-else class="space-y-1">
                            <button v-for="(note, index) in filteredNotes" :key="note.id" @click="selectNote(note)"
                                class="w-full text-left p-3 rounded-lg transition-colors group flex flex-col gap-1"
                                :class="{
                                    'bg-blue-50 dark:bg-blue-900/20': selectedIndex === index,
                                    'hover:bg-gray-50 dark:hover:bg-gray-800': selectedIndex !== index
                                }">
                                <!-- Title -->
                                <div class="flex items-center justify-between">
                                    <span class="font-medium text-gray-900 dark:text-white truncate text-sm"
                                        v-html="highlight(note.title || t('editor.untitled'), query)"></span>
                                    <span class="text-xs text-gray-400 font-mono shrink-0 ml-2">{{
                                        formatDate(note.updatedAt) }}</span>
                                </div>
                                <!-- Snippet -->
                                <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 break-all font-mono"
                                    v-html="getSnippet(note.content, query)"></p>
                            </button>
                        </div>
                    </div>

                    <!-- Empty State / Hints -->
                    <div v-else class="p-8 text-center text-gray-400 dark:text-gray-500 text-sm">
                        {{ t('actions.search_placeholder') }}
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { Search } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import type { Note } from '../composables/useStorage';

const props = defineProps<{
    isOpen: boolean;
    notes: Note[];
}>();

const emit = defineEmits(['close', 'select']);
const { t, locale } = useI18n();

const query = ref('');
const searchInput = ref<HTMLInputElement | null>(null);
const selectedIndex = ref(0);

// Reset when opening
watch(() => props.isOpen, (newVal) => {
    if (newVal) {
        query.value = '';
        selectedIndex.value = 0;
        nextTick(() => {
            searchInput.value?.focus();
        });
    }
});

// Filter logic
const filteredNotes = computed(() => {
    if (!query.value) return [];
    const q = query.value.toLowerCase();
    return props.notes.filter(note => {
        const title = (note.title || '').toLowerCase();
        const content = (note.content || '').toLowerCase();
        return title.includes(q) || content.includes(q);
    }).slice(0, 50); // Limit results
});

function handleInputKeydown(e: KeyboardEvent) {
    if (e.isComposing) return;

    switch (e.key) {
        case 'ArrowDown':
            e.preventDefault();
            navigate('down');
            break;
        case 'ArrowUp':
            e.preventDefault();
            navigate('up');
            break;
        case 'Enter':
            e.preventDefault();
            selectCurrent();
            break;
        case 'Escape':
            e.preventDefault();
            close();
            break;
    }
}

// Navigation
function navigate(direction: 'up' | 'down') {
    if (filteredNotes.value.length === 0) return;

    if (direction === 'down') {
        selectedIndex.value = (selectedIndex.value + 1) % filteredNotes.value.length;
    } else {
        selectedIndex.value = (selectedIndex.value - 1 + filteredNotes.value.length) % filteredNotes.value.length;
    }
}

function selectCurrent() {
    const note = filteredNotes.value[selectedIndex.value];
    if (note) {
        selectNote(note);
    }
}

function selectNote(note: Note) {
    emit('select', note.id);
    close();
}

function close() {
    emit('close');
}

// Highlight helper
function highlight(text: string, q: string) {
    if (!q) return text;
    const regex = new RegExp(`(${escapeRegExp(q)})`, 'gi');
    return text.replace(regex, '<span class="text-blue-600 dark:text-blue-400 font-bold">$1</span>');
}

// Snippet helper
function getSnippet(content: string, q: string) {
    if (!content) return '';
    if (!q) return content.slice(0, 100);

    const lowerContent = content.toLowerCase();
    const lowerQ = q.toLowerCase();
    const index = lowerContent.indexOf(lowerQ);

    if (index === -1) return content.slice(0, 100);

    const start = Math.max(0, index - 20);
    const end = Math.min(content.length, index + q.length + 60);

    let snippet = content.slice(start, end);
    if (start > 0) snippet = '...' + snippet;
    if (end < content.length) snippet = snippet + '...';

    return highlight(snippet, q);
}

function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function formatDate(timestamp: number) {
    return new Date(timestamp).toLocaleString(locale.value === 'auto' ? undefined : locale.value, {
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
</script>
