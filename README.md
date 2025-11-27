# LiteNote 極簡筆記

[![Deploy](https://img.shields.io/badge/Deploy-LiteNote-blue?style=flat-square&logo=cloudflare-pages)](https://note.junyou.tw)

[繁體中文](./README.md) | [简体中文](./README.zh-CN.md) | [English](./README.en.md)

---

LiteNote 是一個專注於隱私與寫作體驗的極簡筆記應用。它完全運行在您的瀏覽器中，並透過強大的端對端加密技術保護您的資料。

🔗 **線上使用**：[https://note.junyou.tw](https://note.junyou.tw)

### ✨ 專案介紹

LiteNote 致力於提供一個乾淨、無干擾的寫作環境。我們堅持「資料不落地」的原則，您的所有筆記都經過加密後儲存在您自己的裝置上（LocalStorage），不會上傳至任何雲端伺服器，確保絕對的隱私安全。

### 🚀 功能特色

#### 🔒 安全隱私
- **端對端加密**: 採用 **AES-GCM** 演算法對筆記內容進行加密。
- **PIN 碼保護**: 使用 **PBKDF2** 從您的 PIN 碼衍生金鑰，確保只有您能解密資料。
- **防窺探**: 即使透過開發者工具查看儲存空間，也只能看到加密後的亂碼。

> **❗關於安全性的重要說明**
> 本專案的加密機制設計初衷為 **「防君子不防小人」**，主要用於防止隱私在瀏覽器中被輕易窺探。
> *   雖然 AES-GCM 加密演算法本身極難破解，但整體的安全性取決於您的 **PIN 碼複雜度**。
> *   若有心人士取得您的電腦檔案並進行暴力破解，短位數的 PIN 碼（如 4-6 碼）可能無法長時間抵擋。
> *   **建議**: 請勿在此儲存極度機密（如銀行密碼、加密貨幣私鑰）的資訊。

#### 📝 寫作體驗
- **極簡介面**: 移除多餘的格式工具，讓您專注於文字本身。
- **自動儲存**: 毫秒級的自動儲存機制，隨打隨存。
- **字數統計**: 即時顯示當前筆記的字數。
- **字體調整**: 可自由調整字體大小 (12px - 48px)。

#### 🎨 介面設計
- **響應式佈局**: 完美支援桌面與行動裝置。
- **流暢動畫**: 手機版側邊欄採用滑順的進出動畫。
- **主題切換**: 內建亮色、暗色及跟隨系統主題模式。
- **手勢操作**: 手機版支援長按記事重新命名。
- **多國語系**: 支援繁體中文、簡體中文與英文。

### 🛠️ 使用技術

本專案採用現代化的前端技術棧構建：

- **核心框架**: [Vue 3](https://vuejs.org/) (Composition API + Script Setup)
- **開發工具**: [Vite](https://vitejs.dev/)
- **程式語言**: [TypeScript](https://www.typescriptlang.org/)
- **樣式設計**: [Tailwind CSS](https://tailwindcss.com/)
- **狀態管理**: [VueUse](https://vueuse.org/) (useStorage, useDark)
- **加密技術**: Web Crypto API (AES-GCM, PBKDF2, SHA-256)
- **圖標庫**: [Lucide Vue Next](https://lucide.dev/)
- **國際化**: [Vue I18n](https://vue-i18n.intlify.dev/)

### ☕ 贊助開發

如果您覺得這個工具對您有幫助，歡迎贊助我一杯咖啡，這將成為我持續開發與維護的動力！

<a href="https://www.buymeacoffee.com/junyou" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
