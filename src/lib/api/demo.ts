import { supabase } from '../supabase';
import type { DemoSession } from '../supabase';
import { MOCK_DEMO_SESSIONS } from './mockData';

export async function getDemoSessions(date?: string): Promise<DemoSession[]> {
    try {
        let query = supabase.from('demo_sessions').select('*').order('date').order('start_time');
        if (date) query = query.eq('date', date);
        const { data, error } = await query;
        if (error) throw error;
        return data ?? [];
    } catch (error) {
        console.error('Supabase getDemoSessions error, falling back to mock data:', error);
        if (date) {
            return MOCK_DEMO_SESSIONS.filter(s => s.date === date);
        }
        return MOCK_DEMO_SESSIONS;
    }
}
