# LiteNote 极简笔记

[![Deploy](https://img.shields.io/badge/Deploy-LiteNote-blue?style=flat-square&logo=cloudflare-pages)](https://note.junyou.tw)

[繁體中文](./README.md) | [简体中文](./README.zh-CN.md) | [English](./README.en.md)

---

LiteNote 是一个专注于隐私与写作体验的极简笔记应用。它完全运行在您的浏览器中，并通过强大的端对端加密技术保护您的数据。

🔗 **在线使用**：[https://note.junyou.tw](https://note.junyou.tw)

### ✨ 项目介绍

LiteNote 致力于提供一个干净、无干扰的写作环境。我们坚持“数据不落地”的原则，您的所有笔记都经过加密后存储在您自己的设备上（LocalStorage），不会上传至任何云端服务器，确保绝对的隐私安全。

### 🚀 功能特色

#### 🔒 安全隐私
- **端对端加密**: 采用 **AES-GCM** 算法对笔记内容进行加密。
- **PIN 码保护**: 使用 **PBKDF2** 从您的 PIN 码衍生密钥，确保只有您能解密数据。
- **防窥探**: 即使通过开发者工具查看存储空间，也只能看到加密后的乱码。

> **❗关于安全性的重要说明**
> 本项目的加密机制设计初衷为 **“防君子不防小人”**，主要用于防止隐私在浏览器中被轻易窥探。
> *   虽然 AES-GCM 加密算法本身极难破解，但整体的安全性取决于您的 **PIN 码复杂度**。
> *   若有心人士取得您的电脑文件并进行暴力破解，短位数的 PIN 码（如 4-6 位）可能无法长时间抵挡。
> *   **建议**: 请勿在此存储极度机密（如银行密码、加密货币私钥）的信息。

#### 📝 写作体验
- **极简界面**: 移除多余的格式工具，让您专注于文字本身。
- **自动保存**: 毫秒级的自动保存机制，随打随存。
- **字数统计**: 实时显示当前笔记的字数。
- **字体调整**: 可自由调整字体大小 (12px - 48px)。

#### 🎨 界面设计
- **响应式布局**: 完美支持桌面与移动设备。
- **流畅动画**: 手机版侧边栏采用滑顺的进出动画。
- **主题切换**: 内置亮色、暗色及跟随系统主题模式。
- **手势操作**: 手机版支持长按笔记重命名。
- **多国语言**: 支持繁体中文、简体中文与英文。

### 🛠️ 使用技术

本项目采用现代化的前端技术栈构建：

- **核心框架**: [Vue 3](https://vuejs.org/) (Composition API + Script Setup)
- **开发工具**: [Vite](https://vitejs.dev/)
- **编程语言**: [TypeScript](https://www.typescriptlang.org/)
- **样式设计**: [Tailwind CSS](https://tailwindcss.com/)
- **状态管理**: [VueUse](https://vueuse.org/) (useStorage, useDark)
- **加密技术**: Web Crypto API (AES-GCM, PBKDF2, SHA-256)
- **图标库**: [Lucide Vue Next](https://lucide.dev/)
- **国际化**: [Vue I18n](https://vue-i18n.intlify.dev/)

### ☕ 赞助开发

如果您觉得这个工具对您有帮助，欢迎赞助我一杯咖啡，这将成为我持续开发与维护的动力！

<a href="https://www.buymeacoffee.com/junyou" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
