import { useState, useEffect } from 'react';
import { getCustomerById } from '../lib/api/customers';
import { getStudentsByCustomer } from '../lib/api/students';
import { getNotesByCustomer } from '../lib/api/notes';
import { getTagsByCustomer } from '../lib/api/tags';
import { getWeComFlows } from '../lib/api/wecom';
import type { Customer, Student, Note, CustomerTag, WeComFlow } from '../lib/supabase';

export function useCustomer(id: string | undefined) {
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [students, setStudents] = useState<Student[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);
    const [tags, setTags] = useState<CustomerTag[]>([]);
    const [wecomFlows, setWecomFlows] = useState<WeComFlow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        Promise.all([
            getCustomerById(id),
            getStudentsByCustomer(id),
            getNotesByCustomer(id),
            getTagsByCustomer(id),
            getWeComFlows(id),
        ]).then(([c, s, n, t, w]) => {
            setCustomer(c);
            setStudents(s);
            setNotes(n);
            setTags(t);
            setWecomFlows(w);
        }).catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, [id]);

    return { customer, students, notes, tags, wecomFlows, loading, error };
}
