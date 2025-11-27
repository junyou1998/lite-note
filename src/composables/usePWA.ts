import { ref, onMounted } from 'vue';
import { useStorage } from '@vueuse/core';

export function usePWA() {
    const deferredPrompt = ref<any>(null);
    const canInstall = ref(false);
    const isDismissed = useStorage('litenote_pwa_dismissed', false);

    onMounted(() => {
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            deferredPrompt.value = e;
            // Update UI notify the user they can install the PWA
            canInstall.value = true;
        });

        window.addEventListener('appinstalled', () => {
            // Log install to analytics
            console.log('PWA was installed');
            deferredPrompt.value = null;
            canInstall.value = false;
        });
    });

    const install = async () => {
        if (!deferredPrompt.value) {
            return;
        }
        // Show the install prompt
        deferredPrompt.value.prompt();
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.value.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        // We've used the prompt, and can't use it again, throw it away
        deferredPrompt.value = null;
        canInstall.value = false;
    };

    const dismiss = () => {
        isDismissed.value = true;
    };

    return {
        canInstall,
        isDismissed,
        install,
        dismiss
    };
}
