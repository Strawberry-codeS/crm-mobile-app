import type { Customer, Student, Note, WeComFlow, DemoSession, CustomerTag } from '../supabase';

const now = new Date();

export const MOCK_CUSTOMERS: Customer[] = [
  { 
    id: 'c1', name: '欧阳春晓', phone: '138-8888-0001', customer_level: 'A', is_key_deal: false, 
    product_line: '瑞思英语', source_channel: '线上-抖音表单', intended_campus: '大悦城校区', 
    customer_stage: '承诺上门', tab_category: '新分配客户', time_text: '首次：15:00后超时', 
    time_status: 'urgent', color: 'red', pipeline_stage: '邀约demo', 
    last_status_change_at: new Date(now.getTime() - 86400000).toISOString(), 
    first_response_deadline_at: new Date(now.getTime() + 900000).toISOString(), 
    next_follow_up_at: null, demo_appointment_at: null,
    follow_up_period_days: 3, min_follow_ups_required: 2, created_at: now.toISOString(), updated_at: now.toISOString(),
    phones: [{ number: '138-8888-0001', type: 'primary' }], avatar_url: null, assigned_to: null, focus_dimensions: null, custom_tags: null
  },
  { 
    id: 'c2', name: '王梓轩', phone: '138-8888-0003', customer_level: 'A', is_key_deal: false, 
    product_line: '瑞思英语', source_channel: '线上-抖音-活动', intended_campus: '大悦城校区', 
    customer_stage: '未承诺', tab_category: '新分配客户', time_text: '首次：25:00后超时', 
    time_status: 'warning', color: 'orange', pipeline_stage: '邀约demo', 
    last_status_change_at: new Date(now.getTime() - 86400000).toISOString(), 
    first_response_deadline_at: new Date(now.getTime() + 1500000).toISOString(), 
    next_follow_up_at: null, demo_appointment_at: null,
    follow_up_period_days: 3, min_follow_ups_required: 2, created_at: now.toISOString(), updated_at: now.toISOString(),
    phones: [{ number: '138-8888-0003', type: 'primary' }], avatar_url: null, assigned_to: null, focus_dimensions: null, custom_tags: null
  },
  { 
    id: 'c3', name: '欧阳小明', phone: '138-8888-0002', customer_level: 'B', is_key_deal: false, 
    product_line: '瑞思英语', source_channel: '线下-口碑', intended_campus: '朝阳校区', 
    customer_stage: '未承诺', tab_category: '新分配客户', time_text: '首次：30:00后超时', 
    time_status: 'success', color: 'green', pipeline_stage: '接触阶段', 
    last_status_change_at: new Date(now.getTime() - 172800000).toISOString(), 
    first_response_deadline_at: new Date(now.getTime() + 1800000).toISOString(), 
    next_follow_up_at: null, demo_appointment_at: null,
    follow_up_period_days: 3, min_follow_ups_required: 2, created_at: now.toISOString(), updated_at: now.toISOString(),
    phones: [{ number: '138-8888-0002', type: 'primary' }], avatar_url: null, assigned_to: null, focus_dimensions: null, custom_tags: null
  },
  { 
    id: 'c4', name: '陈杰森', phone: '166-0368-1154', customer_level: 'A', is_key_deal: true, 
    product_line: '瑞思英语', source_channel: '线上营销-美团-抖音', intended_campus: '大悦城校区', 
    customer_stage: '已上门未缴费', tab_category: '重点客户', time_text: '今日22:00跟进', 
    time_status: 'urgent', color: 'red', pipeline_stage: '邀约demo', 
    last_status_change_at: new Date(now.getTime() - 259200000).toISOString(), 
    next_follow_up_at: null, demo_appointment_at: null, first_response_deadline_at: null,
    follow_up_period_days: 2, min_follow_ups_required: 1, created_at: now.toISOString(), updated_at: now.toISOString(),
    phones: [{ number: '166-0368-1154', type: 'primary' }], avatar_url: null, assigned_to: null, focus_dimensions: null, custom_tags: null
  },
  { 
    id: 'c5', name: '王小红', phone: '139-0000-0001', customer_level: 'B', is_key_deal: false, 
    product_line: '瑞思玛特', source_channel: '线上-小红书', intended_campus: '三里屯校区', 
    customer_stage: '承诺上门', tab_category: '待继续跟进', time_text: '明日10:00跟进', 
    time_status: 'warning', color: 'blue', pipeline_stage: '接触阶段', 
    last_status_change_at: new Date(now.getTime() - 345600000).toISOString(), 
    next_follow_up_at: null, demo_appointment_at: null, first_response_deadline_at: null,
    follow_up_period_days: 3, min_follow_ups_required: 2, created_at: now.toISOString(), updated_at: now.toISOString(),
    phones: [{ number: '139-0000-0001', type: 'primary' }], avatar_url: null, assigned_to: null, focus_dimensions: null, custom_tags: null
  },
  { 
    id: 'c6', name: '李明明', phone: '139-0000-0002', customer_level: 'C', is_key_deal: false, 
    product_line: '瑞思英语', source_channel: '线下-地推', intended_campus: '朝阳校区', 
    customer_stage: '未承诺', tab_category: '待上门试听', time_text: '今日14:00试听', 
    time_status: 'urgent', color: 'orange', pipeline_stage: '已到访', 
    last_status_change_at: new Date(now.getTime() - 432000000).toISOString(), 
    next_follow_up_at: null, demo_appointment_at: null, first_response_deadline_at: null,
    follow_up_period_days: 2, min_follow_ups_required: 1, created_at: now.toISOString(), updated_at: now.toISOString(),
    phones: [{ number: '139-0000-0002', type: 'primary' }], avatar_url: null, assigned_to: null, focus_dimensions: null, custom_tags: null
  },
  { 
    id: 'c7', name: '张小帅', phone: '135-1234-5678', customer_level: 'A', is_key_deal: true, 
    product_line: '瑞思英语', source_channel: '线上-搜索', intended_campus: '三里屯校区', 
    customer_stage: '已成交', tab_category: '重点客户', time_text: '回访计划中', 
    time_status: 'success', color: 'purple', pipeline_stage: '正式学员', 
    next_follow_up_at: null, demo_appointment_at: null, first_response_deadline_at: null,
    last_status_change_at: now.toISOString(), follow_up_period_days: null, min_follow_ups_required: null,
    created_at: now.toISOString(), updated_at: now.toISOString(), 
    phones: [{ number: '135-1234-5678', type: 'primary' }], avatar_url: null, assigned_to: null, focus_dimensions: null, custom_tags: null
  },
  { 
    id: 'c8', name: '李萌萌', phone: '137-9999-8888', customer_level: 'B', is_key_deal: false, 
    product_line: '瑞思玛特', source_channel: '线下-自访', intended_campus: '望京校区', 
    customer_stage: '已到访', tab_category: '待上门试听', time_text: '本周六10:00试听', 
    time_status: 'warning', color: 'blue', pipeline_stage: '已到访', 
    next_follow_up_at: null, demo_appointment_at: null, first_response_deadline_at: null,
    last_status_change_at: now.toISOString(), follow_up_period_days: null, min_follow_ups_required: null,
    created_at: now.toISOString(), updated_at: now.toISOString(), 
    phones: [{ number: '137-9999-8888', type: 'primary' }], avatar_url: null, assigned_to: null, focus_dimensions: null, custom_tags: null
  },
  { 
    id: 'c9', name: '赵大宝', phone: '150-1111-2222', customer_level: 'C', is_key_deal: false, 
    product_line: '瑞思英语', source_channel: '线上营销-美团', intended_campus: '朝阳校区', 
    customer_stage: '未上门', tab_category: '公海池客户', time_text: '超过30天未跟进', 
    time_status: 'urgent', color: 'gray', pipeline_stage: '流失阶段', 
    next_follow_up_at: null, demo_appointment_at: null, first_response_deadline_at: null,
    last_status_change_at: now.toISOString(), follow_up_period_days: null, min_follow_ups_required: null,
    created_at: now.toISOString(), updated_at: now.toISOString(), 
    phones: [{ number: '150-1111-2222', type: 'primary' }], avatar_url: null, assigned_to: null, focus_dimensions: null, custom_tags: null
  },
];

export const MOCK_STUDENTS: Student[] = [
  { id: 's1', customer_id: 'c4', name: '陈杰森(小)', gender: '男', age: 3, school: '朝阳小学', grade: '一年级', is_primary: true, birthdate: null, avatar_url: null, learning_background: null, created_at: now.toISOString() },
  { id: 's2', customer_id: 'c4', name: '陈莉莉', gender: '女', age: 5, school: '朝阳小学', grade: '三年级', is_primary: false, birthdate: null, avatar_url: null, learning_background: null, created_at: now.toISOString() },
  { id: 's3', customer_id: 'c7', name: '张小帅(小)', gender: '男', age: 4, school: '希望幼儿园', grade: '大班', is_primary: true, birthdate: null, avatar_url: null, learning_background: null, created_at: now.toISOString() }
];

export const MOCK_TAGS: CustomerTag[] = [
  { id: 't1', customer_id: 'c4', tag_type: 'basic', tag_value: '3岁', is_active: true, created_at: now.toISOString() },
  { id: 't2', customer_id: 'c4', tag_type: 'stage', tag_value: '已上门未缴费', is_active: true, created_at: now.toISOString() },
  { id: 't3', customer_id: 'c4', tag_type: 'focus', tag_value: '服务质量', is_active: true, created_at: now.toISOString() },
  { id: 't4', customer_id: 'c7', tag_type: 'stage', tag_value: '已正式报名', is_active: true, created_at: now.toISOString() }
];

export const MOCK_NOTES: Note[] = [
  { 
    id: 'n1', customer_id: 'c3', student_id: null, created_by: null, note_type: '电话', status: '已输入', 
    consultation_method: null,
    content: '“家长询问外教资格及课程资料，对目前的试听时间比较满意，考虑下周报名。”', 
    duration_seconds: null, call_status: null, attachments: null,
    created_at: new Date(now.getTime() - 7200000).toISOString(), 
    next_follow_up_at: new Date(now.getTime() + 86400000).toISOString(), 
    demo_appointment_at: null 
  },
  { 
    id: 'n2', customer_id: 'c3', student_id: null, created_by: null, note_type: '单聊', status: '已查收', 
    consultation_method: null,
    content: '自然拼读.PDF', 
    duration_seconds: null, call_status: null,
    attachments: [{ name: '自然拼读.PDF', size: '2.4 MB', url: '', type: 'pdf' }],
    created_at: new Date(now.getTime() - 86400000).toISOString(), 
    next_follow_up_at: null, demo_appointment_at: null 
  }
];

export const MOCK_DEMO_SESSIONS: DemoSession[] = [
  { id: 'ds1', date: new Date(now.getTime() + 86400000).toISOString().split('T')[0], start_time: '10:00', end_time: '11:30', content: '瑞思DEMO-P', product_line: '瑞思英语', capacity: 20, enrolled: 10, created_at: now.toISOString() },
  { id: 'ds2', date: new Date(now.getTime() + 86400000).toISOString().split('T')[0], start_time: '14:00', end_time: '15:30', content: '瑞思DEMO-D', product_line: '瑞思玛特', capacity: 20, enrolled: 18, created_at: now.toISOString() }
];

export const MOCK_FLOWS: WeComFlow[] = [
  { id: 'f1', customer_id: 'c3', from_staff_id: null, to_staff_id: null, to_staff_name: 'Sarah', to_staff_role: '课程顾问', flow_type: '添加好友', note: '通过渠道活码添加', stage_at_time: '承诺上门', created_at: new Date(now.getTime() - 172800000).toISOString() }
];
