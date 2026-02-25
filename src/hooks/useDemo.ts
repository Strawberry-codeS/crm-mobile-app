import { useState, useEffect, useCallback } from 'react';
import { getDemoSessions } from '../lib/api/demo';
import type { DemoSession } from '../lib/supabase';

export function useDemo(date?: string) {
    const [sessions, setSessions] = useState<DemoSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getDemoSessions(date);
            setSessions(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [date]);

    useEffect(() => { load(); }, [load]);

    return { sessions, loading, error, refetch: load };
}
