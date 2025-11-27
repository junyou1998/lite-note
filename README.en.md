# LiteNote

[![Deploy](https://img.shields.io/badge/Deploy-LiteNote-blue?style=flat-square&logo=cloudflare-pages)](https://note.junyou.tw)

[繁體中文](./README.md) | [简体中文](./README.zh-CN.md) | [English](./README.en.md)

---

LiteNote is a minimalist note-taking application focused on privacy and writing experience. It runs entirely in your browser and protects your data with powerful end-to-end encryption.

🔗 **Live Demo**: [https://note.junyou.tw](https://note.junyou.tw)

### ✨ Introduction

LiteNote is dedicated to providing a clean, distraction-free writing environment. We adhere to the "local-first" principle—all your notes are encrypted and stored on your own device (LocalStorage) and are never uploaded to any cloud server, ensuring absolute privacy.

### 🚀 Features

#### 🔒 Security & Privacy
- **End-to-End Encryption**: Uses **AES-GCM** algorithm to encrypt note content.
- **PIN Protection**: Uses **PBKDF2** to derive keys from your PIN, ensuring only you can decrypt the data.
- **Anti-Snooping**: Even if someone inspects the storage via developer tools, they will only see encrypted gibberish.

> **❗Important Security Note**
> The encryption mechanism is designed primarily to prevent casual snooping in the browser.
> *   While AES-GCM is extremely secure, the overall security depends on your **PIN complexity**.
> *   If a malicious actor gains access to your computer files and attempts brute-force attacks, a short PIN (e.g., 4-6 digits) may not withstand it for long.
> *   **Recommendation**: Do not store highly sensitive information (e.g., bank passwords, crypto private keys) here.

#### 📝 Writing Experience
- **Minimalist Interface**: Removes unnecessary formatting tools so you can focus on the text.
- **Auto-Save**: Millisecond-level auto-save mechanism.
- **Word Count**: Real-time display of the current note's word/character count.
- **Font Adjustment**: Freely adjust font size (12px - 48px).

#### 🎨 UI Design
- **Responsive Layout**: Perfectly supports desktop and mobile devices.
- **Smooth Animations**: Mobile sidebar features smooth transition animations.
- **Theme Switching**: Built-in Light, Dark, and System modes.
- **Gestures**: Mobile version supports long-press to rename notes.
- **Multi-language**: Supports Traditional Chinese, Simplified Chinese, and English.

### 🛠️ Tech Stack

Built with a modern frontend tech stack:

- **Core Framework**: [Vue 3](https://vuejs.org/) (Composition API + Script Setup)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [VueUse](https://vueuse.org/) (useStorage, useDark)
- **Encryption**: Web Crypto API (AES-GCM, PBKDF2, SHA-256)
- **Icons**: [Lucide Vue Next](https://lucide.dev/)
- **i18n**: [Vue I18n](https://vue-i18n.intlify.dev/)

### ☕ Support Development

If you find this tool helpful, please consider buying me a coffee. It will motivate me to continue development and maintenance!

<a href="https://www.buymeacoffee.com/junyou" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
