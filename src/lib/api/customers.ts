import { supabase } from '../supabase';
import type { Customer } from '../supabase';
import { MOCK_CUSTOMERS } from './mockData';

export async function getCustomers(tabCategory?: string): Promise<Customer[]> {
    try {
        let query = supabase.from('customers').select('*').order('created_at', { ascending: false });
        if (tabCategory) {
            query = query.eq('tab_category', tabCategory);
        }
        const { data, error } = await query;
        if (error) throw error;
        return data ?? [];
    } catch (error) {
        console.error('Supabase getCustomers error, falling back to mock data:', error);
        if (tabCategory) {
            return MOCK_CUSTOMERS.filter(c => c.tab_category === tabCategory);
        }
        return MOCK_CUSTOMERS;
    }
}

export async function getCustomerById(id: string): Promise<Customer | null> {
    try {
        const { data, error } = await supabase
            .from('customers')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Supabase getCustomerById error, falling back to mock data:', error);
        return MOCK_CUSTOMERS.find(c => c.id === id) || null;
    }
}

export async function searchCustomers(query: string): Promise<Customer[]> {
    try {
        const { data, error } = await supabase
            .from('customers')
            .select('*')
            .or(`name.ilike.%${query}%,phone.ilike.%${query}%,source_channel.ilike.%${query}%`)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data ?? [];
    } catch (error) {
        console.error('Supabase searchCustomers error, falling back to mock data:', error);
        const lowerQuery = query.toLowerCase();
        return MOCK_CUSTOMERS.filter(c => 
            c.name.toLowerCase().includes(lowerQuery) || 
            (c.phone && c.phone.includes(query)) ||
            (c.source_channel && c.source_channel.toLowerCase().includes(lowerQuery))
        );
    }
}

export async function updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer> {
    try {
        const { data, error } = await supabase
            .from('customers')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Supabase updateCustomer error, mocking update locally:', error);
        const customer = MOCK_CUSTOMERS.find(c => c.id === id);
        if (!customer) throw new Error('Customer not found in mock data');
        return { ...customer, ...updates, updated_at: new Date().toISOString() };
    }
}
