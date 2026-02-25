import { supabase } from '../supabase';
import type { DemoSession } from '../supabase';

export async function getDemoSessions(date?: string): Promise<DemoSession[]> {
    let query = supabase.from('demo_sessions').select('*').order('date').order('start_time');
    if (date) query = query.eq('date', date);
    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
}
