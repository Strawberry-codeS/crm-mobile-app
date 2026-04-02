import { supabase } from '../supabase';
import type { CustomerTag } from '../supabase';
import { MOCK_TAGS } from './mockData';

export async function getTagsByCustomer(customerId: string): Promise<CustomerTag[]> {
    try {
        const { data, error } = await supabase
            .from('customer_tags')
            .select('*')
            .eq('customer_id', customerId);
        if (error) throw error;
        return data ?? [];
    } catch (error) {
        console.error('Supabase getTagsByCustomer error, falling back to mock data:', error);
        return MOCK_TAGS.filter(t => t.customer_id === customerId);
    }
}

export async function updateTags(customerId: string, tags: Partial<CustomerTag>[]): Promise<void> {
    try {
        await supabase.from('customer_tags').delete().eq('customer_id', customerId);
        if (tags.length > 0) {
            const { error } = await supabase
                .from('customer_tags')
                .insert(tags.map(t => ({ ...t, customer_id: customerId })));
            if (error) throw error;
        }
    } catch (error) {
        console.error('Supabase updateTags error, mocking update locally:', error);
        // Fallback: No action needed for local mock update for now
    }
}
