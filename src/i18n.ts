import { createI18n } from 'vue-i18n';
import { useStorage } from '@vueuse/core';
import zhTW from './locales/zh-TW.json';
import zhCN from './locales/zh-CN.json';
import en from './locales/en.json';

// Persist language preference
export const locale = useStorage('lite-note-locale', 'auto');

function getBrowserLocale() {
    const navigatorLocale = navigator.language.toLowerCase();
    if (navigatorLocale.includes('zh-tw') || navigatorLocale.includes('zh-hk')) {
        return 'zh-TW';
    }
    if (navigatorLocale.includes('zh')) {
        return 'zh-CN';
    }
    return 'en';
}

export const i18n = createI18n({
    legacy: false,
    locale: locale.value === 'auto' ? getBrowserLocale() : locale.value,
    fallbackLocale: 'en',
    messages: {
        'zh-TW': zhTW,
        'zh-CN': zhCN,
        en: en
    }
});

export function setLocale(lang: string) {
    locale.value = lang;
    if (lang === 'auto') {
        i18n.global.locale.value = getBrowserLocale() as any;
    } else {
        i18n.global.locale.value = lang as any;
    }
}
