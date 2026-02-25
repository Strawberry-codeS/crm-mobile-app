import { supabase } from '../supabase';
import type { Customer } from '../supabase';

export async function getCustomers(tabCategory?: string): Promise<Customer[]> {
    let query = supabase.from('customers').select('*').order('created_at', { ascending: false });
    if (tabCategory) {
        query = query.eq('tab_category', tabCategory);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
}

export async function getCustomerById(id: string): Promise<Customer | null> {
    const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();
    if (error) throw error;
    return data;
}

export async function searchCustomers(query: string): Promise<Customer[]> {
    const { data, error } = await supabase
        .from('customers')
        .select('*')
        .or(`name.ilike.%${query}%,phone.ilike.%${query}%,source_channel.ilike.%${query}%`)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
}

export async function updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer> {
    const { data, error } = await supabase
        .from('customers')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return data;
}
