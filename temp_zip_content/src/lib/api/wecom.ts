import { supabase } from '../supabase';
import type { WeComFlow } from '../supabase';

export async function getWeComFlows(customerId: string): Promise<WeComFlow[]> {
    const { data, error } = await supabase
        .from('wecom_flows')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
}
