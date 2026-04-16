import { supabase } from '../supabase';
import type { Note } from '../supabase';
import { MOCK_NOTES } from './mockData';

export async function getNotesByCustomer(customerId: string): Promise<Note[]> {
    try {
        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .eq('customer_id', customerId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data ?? [];
    } catch (error) {
        console.error('Supabase getNotesByCustomer error, falling back to mock data:', error);
        return MOCK_NOTES.filter(n => n.customer_id === customerId);
    }
}

export async function createNote(note: Partial<Note>): Promise<Note> {
    try {
        const { data, error } = await supabase
            .from('notes')
            .insert(note)
            .select()
            .single();
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Supabase createNote error, mocking addition locally:', error);
        const newNote = {
            id: Math.random().toString(36).substring(7),
            customer_id: note.customer_id || '',
            student_id: note.student_id || null,
            created_by: note.created_by || null,
            note_type: note.note_type || null,
            consultation_method: note.consultation_method || null,
            status: note.status || '正文',
            content: note.content || '',
            duration_seconds: note.duration_seconds || null,
            call_status: note.call_status || null,
            attachments: note.attachments || null,
            next_follow_up_at: note.next_follow_up_at || null,
            demo_appointment_at: note.demo_appointment_at || null,
            created_at: new Date().toISOString()
        } as Note;
        return newNote;
    }
}
