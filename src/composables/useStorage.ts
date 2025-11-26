import { useStorage } from '@vueuse/core';

export interface Note {
    id: string;
    content: string;
    title?: string;
    updatedAt: number;
}

// Global state to ensure consistency across components
const notes = useStorage<Note[]>('litenote_notes', []);
const passwordHash = useStorage<string | null>('litenote_password_hash', null);
const lastActiveNoteId = useStorage<string | null>('litenote_last_active_id', null);

export function useNoteStorage() {

    const createNote = () => {
        const newNote: Note = {
            id: crypto.randomUUID(),
            content: '',
            updatedAt: Date.now(),
        };
        // Add to the beginning of the list
        notes.value.unshift(newNote);
        lastActiveNoteId.value = newNote.id;
        return newNote;
    };

    const deleteNote = (id: string) => {
        const index = notes.value.findIndex(n => n.id === id);
        if (index !== -1) {
            notes.value.splice(index, 1);
            if (lastActiveNoteId.value === id) {
                // If we deleted the active note, try to select the next one or previous one, or null
                lastActiveNoteId.value = notes.value[0]?.id || null;
            }
        }
    };

    const updateNote = (id: string, content: string) => {
        const note = notes.value.find(n => n.id === id);
        if (note) {
            note.content = content;
            note.updatedAt = Date.now();
            // Optional: Move to top on edit? 
            // For now, let's keep the order but we might want to sort by updatedAt in the UI.
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

    return {
        notes,
        passwordHash,
        lastActiveNoteId,
        createNote,
        deleteNote,
        updateNote,
        updateNoteTitle,
        getNote
    };
}
