import { useState, useEffect, useCallback } from 'react';
import { getWeComFlows } from '../lib/api/wecom';
import type { WeComFlow } from '../lib/supabase';

export function useWeCom(customerId: string | undefined) {
    const [flows, setFlows] = useState<WeComFlow[]>([]);
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
            const data = await getWeComFlows(customerId);
            setFlows(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [customerId]);

    useEffect(() => { load(); }, [load]);

    return { flows, loading, error, refetch: load };
}
