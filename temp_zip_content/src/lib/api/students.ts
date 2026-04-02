import { supabase } from '../supabase';
import type { Student } from '../supabase';

export async function getStudentsByCustomer(customerId: string): Promise<Student[]> {
    const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('customer_id', customerId)
        .order('is_primary', { ascending: false });
    if (error) throw error;
    return data ?? [];
}

export async function createStudent(student: Partial<Student>): Promise<Student> {
    const { data, error } = await supabase
        .from('students')
        .insert(student)
        .select()
        .single();
    if (error) throw error;
    return data;
}
