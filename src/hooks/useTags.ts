import { useState, useEffect, useCallback } from 'react';
import { getTagsByCustomer, updateTags } from '../lib/api/tags';
import type { CustomerTag } from '../lib/supabase';

export function useTags(customerId: string | undefined) {
    const [tags, setTags] = useState<CustomerTag[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        if (!customerId) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await getTagsByCustomer(customerId);
            setTags(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [customerId]);

    useEffect(() => { load(); }, [load]);

    const saveTags = async (newTags: Partial<CustomerTag>[]) => {
        if (!customerId) return;
        setLoading(true);
        try {
            await updateTags(customerId, newTags);
            await load();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { tags, loading, error, refetch: load, saveTags };
}
