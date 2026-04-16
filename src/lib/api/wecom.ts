import { supabase } from '../supabase';
import type { WeComFlow } from '../supabase';
import { MOCK_FLOWS } from './mockData';

export async function getWeComFlows(customerId: string): Promise<WeComFlow[]> {
    try {
        const { data, error } = await supabase
            .from('wecom_flows')
            .select('*')
            .eq('customer_id', customerId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data ?? [];
    } catch (error) {
        console.error('Supabase getWeComFlows error, falling back to mock data:', error);
        return MOCK_FLOWS.filter(f => f.customer_id === customerId);
    }
}
