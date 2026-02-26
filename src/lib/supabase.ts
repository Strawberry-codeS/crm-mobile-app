import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
    public: {
        Tables: {
            profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> };
            customers: { Row: Customer; Insert: Partial<Customer>; Update: Partial<Customer> };
            students: { Row: Student; Insert: Partial<Student>; Update: Partial<Student> };
            customer_tags: { Row: CustomerTag; Insert: Partial<CustomerTag>; Update: Partial<CustomerTag> };
            notes: { Row: Note; Insert: Partial<Note>; Update: Partial<Note> };
            wecom_flows: { Row: WeComFlow; Insert: Partial<WeComFlow>; Update: Partial<WeComFlow> };
            demo_sessions: { Row: DemoSession; Insert: Partial<DemoSession>; Update: Partial<DemoSession> };
        };
    };
};

export interface Profile {
    id: string;
    name: string;
    role: string;
    avatar_url: string | null;
    created_at: string;
}

export interface Customer {
    id: string;
    assigned_to: string | null;
    name: string;
    phone: string | null;
    phones: { number: string; type: 'primary' | 'secondary' }[] | null;
    avatar_url: string | null;
    customer_level: 'A' | 'B' | 'C' | 'D' | null;
    customer_stage: string | null;
    is_key_deal: boolean;
    product_line: string | null;
    source_channel: string | null;
    intended_campus: string | null;
    pipeline_stage: string | null;
    next_follow_up_at: string | null;
    demo_appointment_at: string | null;
    last_status_change_at: string | null;
    tab_category: string | null;
    time_text: string | null;
    time_status: 'urgent' | 'warning' | 'success' | null;
    focus_dimensions: string[] | null;
    custom_tags: string[] | null;
    first_response_deadline_at: string | null;
    follow_up_period_days: number | null;
    min_follow_ups_required: number | null;
    color: string | null;
    created_at: string;
    updated_at: string;
}

export interface Student {
    id: string;
    customer_id: string;
    name: string;
    avatar_url: string | null;
    gender: string | null;
    age: number | null;
    birthdate: string | null;
    school: string | null;
    grade: string | null;
    learning_background: string | null;
    is_primary: boolean;
    created_at: string;
}

export interface CustomerTag {
    id: string;
    customer_id: string;
    tag_type: 'basic' | 'behavior' | 'stage' | 'focus' | 'custom';
    tag_value: string;
    is_active: boolean;
    created_at: string;
}

export interface Note {
    id: string;
    customer_id: string;
    student_id: string | null;
    created_by: string | null;
    note_type: string | null;
    consultation_method: string | null;
    status: string | null;
    content: string | null;
    duration_seconds: number | null;
    call_status: string | null;
    attachments: { name: string; type: string; url: string; size: string }[] | null;
    next_follow_up_at: string | null;
    demo_appointment_at: string | null;
    created_at: string;
}

export interface WeComFlow {
    id: string;
    customer_id: string;
    from_staff_id: string | null;
    to_staff_id: string | null;
    to_staff_name: string | null;
    to_staff_role: string | null;
    flow_type: string | null;
    note: string | null;
    stage_at_time: string | null;
    created_at: string;
}

export interface DemoSession {
    id: string;
    date: string;
    start_time: string;
    end_time: string;
    content: string | null;
    product_line: string | null;
    capacity: number;
    enrolled: number;
    created_at: string;
}
