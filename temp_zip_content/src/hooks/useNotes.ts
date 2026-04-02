import { useState, useEffect, useCallback } from 'react';
import { getNotesByCustomer, createNote } from '../lib/api/notes';
import type { Note } from '../lib/supabase';

export function useNotes(customerId: string | undefined) {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        if (!customerId) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await getNotesByCustomer(customerId);
            setNotes(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [customerId]);

    useEffect(() => { load(); }, [load]);

    const addNote = async (noteItem: Partial<Note>) => {
        const newNote = await createNote(noteItem);
        setNotes((prev) => [newNote, ...prev]);
        return newNote;
    };

    return { notes, loading, error, refetch: load, addNote };
}
