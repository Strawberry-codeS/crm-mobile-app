import { supabase } from '../supabase';
import type { CustomerTag } from '../supabase';

export async function getTagsByCustomer(customerId: string): Promise<CustomerTag[]> {
    const { data, error } = await supabase
        .from('customer_tags')
        .select('*')
        .eq('customer_id', customerId);
    if (error) throw error;
    return data ?? [];
}

export async function updateTags(customerId: string, tags: Partial<CustomerTag>[]): Promise<void> {
    await supabase.from('customer_tags').delete().eq('customer_id', customerId);
    if (tags.length > 0) {
        const { error } = await supabase
            .from('customer_tags')
            .insert(tags.map(t => ({ ...t, customer_id: customerId })));
        if (error) throw error;
    }
}
