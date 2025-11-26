# LiteNote Walkthrough

LiteNote is a secure, minimalist, plain-text note-taking application that runs entirely in your browser.

## Features

### 🔒 Security (Lock Screen)
- **First Launch**: You will be asked to set a password (PIN). This password is hashed using SHA-256 and stored locally.
- **Subsequent Launches**: You must enter the correct password to access your notes.
- **Privacy**: Data is stored in your browser's `localStorage`. No data is sent to any server.

### 📝 Editor
- **Pure Text**: A distraction-free environment for writing.
- **Auto-Save**: Changes are saved automatically as you type.
- **Character Count**: Real-time character count display in the top right.
- **Font Size Control**: Use the `+` and `-` buttons in the toolbar to adjust the text size (12px - 48px). This setting is saved automatically.
- **Download**: Click the download icon to save the current note as a `.txt` file.

### 📁 File Management (Sidebar)
- **New Note**: Click the `+` button to create a fresh note.
- **Switch Notes**: Click any note in the list to open it.
- **Delete**: 
    - Hover over a note and click the trash icon.
    - **Smart Delete**: If the note is empty, it deletes immediately. If it has content, a confirmation modal appears.
- **Rename**: 
    - Double-click a note in the sidebar OR click the edit icon to rename it.
    - If no title is set, it defaults to the first line of the content.
- **Responsive**: On mobile devices, the sidebar is accessible via a menu button.

### 🎨 Customization
- **Theme Switching**: Click the theme icon (Sun/Moon/Monitor) in the sidebar header to toggle between Light, Dark, and System modes.
- **Custom Scrollbar**: Sleek, modern scrollbar design that adapts to the theme.

## Technical Details

- **Framework**: Vue 3 + Vite
- **Styling**: Tailwind CSS 3.4 (Modern, clean aesthetic)
- **Icons**: Lucide Vue Next
- **Storage**: `localStorage` via `@vueuse/core`
- **Cryptography**: `window.crypto.subtle` for SHA-256 hashing

## How to Run

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Start the development server:
    ```bash
    npm run dev
    ```
3.  Open your browser at the provided URL (usually `http://localhost:5173`).
