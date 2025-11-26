import { useStorage, usePreferredDark } from '@vueuse/core';
import { computed, watch } from 'vue';

export type Theme = 'light' | 'dark' | 'system';

const theme = useStorage<Theme>('litenote_theme', 'system');
const preferredDark = usePreferredDark();

export function useTheme() {
    const isDark = computed(() => {
        if (theme.value === 'system') {
            return preferredDark.value;
        }
        return theme.value === 'dark';
    });

    watch(isDark, (val) => {
        if (val) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, { immediate: true });

    const toggleTheme = () => {
        if (theme.value === 'light') theme.value = 'dark';
        else if (theme.value === 'dark') theme.value = 'system';
        else theme.value = 'light';
    };

    const themeLabel = computed(() => {
        switch (theme.value) {
            case 'light': return '淺色';
            case 'dark': return '深色';
            case 'system': return '系統';
        }
    });

    return {
        theme,
        isDark,
        toggleTheme,
        themeLabel
    };
}
