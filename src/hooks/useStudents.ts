import { useState, useEffect, useCallback } from 'react';
import { getStudentsByCustomer, createStudent } from '../lib/api/students';
import type { Student } from '../lib/supabase';

export function useStudents(customerId: string | undefined) {
    const [students, setStudents] = useState<Student[]>([]);
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
            const data = await getStudentsByCustomer(customerId);
            setStudents(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [customerId]);

    useEffect(() => { load(); }, [load]);

    const addStudent = async (studentItem: Partial<Student>) => {
        const newStudent = await createStudent(studentItem);
        setStudents((prev) => [...prev, newStudent]);
        return newStudent;
    };

    return { students, loading, error, refetch: load, addStudent };
}
