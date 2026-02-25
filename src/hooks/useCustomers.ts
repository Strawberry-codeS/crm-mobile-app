import { useState, useEffect, useCallback } from 'react';
import { getCustomers, searchCustomers } from '../lib/api/customers';
import type { Customer } from '../lib/supabase';

export function useCustomers(tabCategory?: string) {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getCustomers(tabCategory);
            setCustomers(data);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [tabCategory]);

    useEffect(() => { load(); }, [load]);

    const search = async (query: string) => {
        if (!query.trim()) { load(); return; }
        setLoading(true);
        try {
            const data = await searchCustomers(query);
            setCustomers(data);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return { customers, loading, error, refetch: load, search };
}
