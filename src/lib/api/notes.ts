import { supabase } from '../supabase';
import type { Note } from '../supabase';

export async function getNotesByCustomer(customerId: string): Promise<Note[]> {
    const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
}

export async function createNote(note: Partial<Note>): Promise<Note> {
    const { data, error } = await supabase
        .from('notes')
        .insert(note)
        .select()
        .single();
    if (error) throw error;
    return data;
}
