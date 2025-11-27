import { ref, watch } from 'vue';
import { useStorage, useDebounceFn } from '@vueuse/core';
import { useCrypto } from './useCrypto';

export interface Note {
    id: string;
    content: string;
    title?: string;
    updatedAt: number;
}

// Raw storage (persisted) - can be Array (legacy) or String (encrypted)
const rawStorage = useStorage<any>('litenote_notes', []);
const cryptoSalt = useStorage<string>('litenote_salt', '');
const passwordHash = useStorage<string | null>('litenote_password_hash', null);
const lastActiveNoteId = useStorage<string | null>('litenote_last_active_id', null);

// App state (in-memory, decrypted)
const notes = ref<Note[]>([]);
const isUnlocked = ref(false);
let encryptionKey: CryptoKey | null = null;

export function useNoteStorage() {
    const { deriveKey, encryptData, decryptData, generateSalt } = useCrypto();

    const save = async () => {
        if (!encryptionKey || !isUnlocked.value) return;
        try {
            const json = JSON.stringify(notes.value);
            const encrypted = await encryptData(json, encryptionKey);
            rawStorage.value = encrypted;
        } catch (e) {
            console.error('Encryption failed:', e);
        }
    };

    // Debounce save to avoid excessive encryption operations
    const debouncedSave = useDebounceFn(save, 1000);

    const init = async (pin: string) => {
        if (!cryptoSalt.value) {
            cryptoSalt.value = generateSalt();
        }

        try {
            encryptionKey = await deriveKey(pin, cryptoSalt.value);

            const raw = rawStorage.value;

            if (Array.isArray(raw)) {
                // Legacy: Plain text -> Migrate
                console.log('Migrating legacy notes to encrypted storage...');
                notes.value = raw;
                await save(); // Encrypt immediately
            } else if (typeof raw === 'string' && raw.includes(':')) {
                // Encrypted
                const json = await decryptData(raw, encryptionKey);
                notes.value = JSON.parse(json);
            } else {
                // Empty or unknown format
                notes.value = [];
            }

            isUnlocked.value = true;

            // Setup watcher after successful init
            watch(notes, () => {
                debouncedSave();
            }, { deep: true });

        } catch (e) {
            console.error('Unlock failed:', e);
            throw new Error('密碼錯誤或資料損毀');
        }
    };

    const createNote = () => {
        const newNote: Note = {
            id: crypto.randomUUID(),
            content: '',
            updatedAt: Date.now(),
        };
        notes.value.unshift(newNote);
        lastActiveNoteId.value = newNote.id;
        return newNote;
    };

    const deleteNote = (id: string) => {
        const index = notes.value.findIndex(n => n.id === id);
        if (index !== -1) {
            notes.value.splice(index, 1);
            if (lastActiveNoteId.value === id) {
                lastActiveNoteId.value = notes.value[0]?.id || null;
            }
        }
    };

    const updateNote = (id: string, content: string) => {
        const note = notes.value.find(n => n.id === id);
        if (note) {
            note.content = content;
            note.updatedAt = Date.now();
        }
    };

    const updateNoteTitle = (id: string, title: string) => {
        const note = notes.value.find(n => n.id === id);
        if (note) {
            note.title = title;
            note.updatedAt = Date.now();
        }
    };

    const getNote = (id: string) => notes.value.find(n => n.id === id);

    const changePin = async (oldPin: string, newPin: string) => {
        if (!isUnlocked.value) throw new Error('請先解鎖');

        // Verify old PIN (double check)
        const { hashPassword } = useCrypto();
        const oldHash = await hashPassword(oldPin);
        if (oldHash !== passwordHash.value) {
            throw new Error('舊密碼錯誤');
        }

        // Generate new salt and key
        const newSalt = generateSalt();
        const newKey = await deriveKey(newPin, newSalt);
        const newHash = await hashPassword(newPin);

        // Re-encrypt data
        try {
            const json = JSON.stringify(notes.value);
            const encrypted = await encryptData(json, newKey);

            // Commit changes
            cryptoSalt.value = newSalt;
            passwordHash.value = newHash;
            rawStorage.value = encrypted;
            encryptionKey = newKey; // Update current session key

            return true;
        } catch (e) {
            console.error('Change PIN failed:', e);
            throw new Error('變更密碼失敗');
        }
    };

    return {
        notes,
        passwordHash,
        lastActiveNoteId,
        isUnlocked,
        init,
        createNote,
        deleteNote,
        updateNote,
        updateNoteTitle,
        getNote,
        changePin
    };
}
