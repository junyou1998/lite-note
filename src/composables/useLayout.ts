import { ref } from 'vue';
import { useStorage } from '@vueuse/core';

// Persistent state for desktop sidebar
export const isDesktopSidebarOpen = useStorage('litenote_desktop_sidebar_open', true);

// Ephemeral state for mobile sidebar
export const isMobileSidebarOpen = ref(false);

export function useLayout() {
    const toggleDesktopSidebar = () => {
        isDesktopSidebarOpen.value = !isDesktopSidebarOpen.value;
    };

    const toggleMobileSidebar = () => {
        isMobileSidebarOpen.value = !isMobileSidebarOpen.value;
    };

    return {
        isDesktopSidebarOpen,
        isMobileSidebarOpen,
        toggleDesktopSidebar,
        toggleMobileSidebar
    };
}
