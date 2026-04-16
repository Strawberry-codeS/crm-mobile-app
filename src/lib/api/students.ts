import { supabase } from '../supabase';
import type { Student } from '../supabase';
import { MOCK_STUDENTS } from './mockData';

export async function getStudentsByCustomer(customerId: string): Promise<Student[]> {
    try {
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .eq('customer_id', customerId)
            .order('is_primary', { ascending: false });
        if (error) throw error;
        return data ?? [];
    } catch (error) {
        console.error('Supabase getStudentsByCustomer error, falling back to mock data:', error);
        return MOCK_STUDENTS.filter(s => s.customer_id === customerId);
    }
}

export async function createStudent(student: Partial<Student>): Promise<Student> {
    try {
        const { data, error } = await supabase
            .from('students')
            .insert(student)
            .select()
            .single();
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Supabase createStudent error, mocking creation locally:', error);
        const newStudent = {
            id: Math.random().toString(36).substring(7),
            customer_id: student.customer_id || '',
            name: student.name || '新学员',
            gender: student.gender || null,
            age: student.age || null,
            school: student.school || null,
            grade: student.grade || null,
            is_primary: student.is_primary || false,
            created_at: new Date().toISOString(),
            avatar_url: null,
            birthdate: null,
            learning_background: null
        } as Student;
        return newStudent;
    }
}
