import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  console.log('Starting seeding process...');

  try {
    // 1. Clear existing data (optional, but good for a clean start)
    // Note: Due to foreign key constraints, we delete in reverse order
    console.log('Cleaning up existing data...');
    await supabase.from('wecom_flows').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('notes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('customer_tags').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('students').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('customers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('demo_sessions').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // 2. Insert Demo Sessions
    console.log('Inserting demo sessions...');
    const demoSessions = [
      { date: new Date(Date.now() + 86400000).toISOString().split('T')[0], start_time: '10:00', end_time: '11:30', content: '瑞思DEMO-P', product_line: '瑞思英语', capacity: 20, enrolled: 10 },
      { date: new Date(Date.now() + 86400000).toISOString().split('T')[0], start_time: '14:00', end_time: '15:30', content: '瑞思DEMO-D', product_line: '瑞思玛特', capacity: 20, enrolled: 18 },
      { date: new Date(Date.now() + 86400000).toISOString().split('T')[0], start_time: '16:30', end_time: '18:00', content: '瑞思Face-P', product_line: '瑞思英语', capacity: 20, enrolled: 20 },
    ];
    await supabase.from('demo_sessions').insert(demoSessions);

    // 3. Insert Customers
    console.log('Inserting customers...');
    const now = new Date();
    const customers = [
      { name: '欧阳春晓', phone: '138-8888-0001', customer_level: 'A', is_key_deal: false, product_line: '瑞思英语', source_channel: '线上-抖音表单', intended_campus: '大悦城校区', customer_stage: '承诺上门', tab_category: '新分配客户', time_text: '首次：15:00后超时', time_status: 'urgent', color: 'red', pipeline_stage: '邀约demo', last_status_change_at: new Date(now.getTime() - 86400000).toISOString(), first_response_deadline_at: new Date(now.getTime() + 900000).toISOString(), follow_up_period_days: 3, min_follow_ups_required: 2 },
      { name: '王梓轩', phone: '138-8888-0003', customer_level: 'A', is_key_deal: false, product_line: '瑞思英语', source_channel: '线上-抖音-活动', intended_campus: '大悦城校区', customer_stage: '未承诺', tab_category: '新分配客户', time_text: '首次：25:00后超时', time_status: 'warning', color: 'orange', pipeline_stage: '邀约demo', last_status_change_at: new Date(now.getTime() - 86400000).toISOString(), first_response_deadline_at: new Date(now.getTime() + 1500000).toISOString(), follow_up_period_days: 3, min_follow_ups_required: 2 },
      { name: '欧阳小明', phone: '138-8888-0002', customer_level: 'B', is_key_deal: false, product_line: '瑞思英语', source_channel: '线下-口碑', intended_campus: '朝阳校区', customer_stage: '未承诺', tab_category: '新分配客户', time_text: '首次：30:00后超时', time_status: 'success', color: 'green', pipeline_stage: '接触阶段', last_status_change_at: new Date(now.getTime() - 172800000).toISOString(), first_response_deadline_at: new Date(now.getTime() + 1800000).toISOString(), follow_up_period_days: 3, min_follow_ups_required: 2 },
      { name: '陈杰森', phone: '166-0368-1154', customer_level: 'A', is_key_deal: true, product_line: '瑞思英语', source_channel: '线上营销-美团-抖音', intended_campus: '大悦城校区', customer_stage: '已上门未缴费', tab_category: '重点客户', time_text: '今日22:00跟进', time_status: 'urgent', color: 'red', pipeline_stage: '邀约demo', last_status_change_at: new Date(now.getTime() - 259200000).toISOString(), follow_up_period_days: 2, min_follow_ups_required: 1 },
      { name: '王小红', phone: '139-0000-0001', customer_level: 'B', is_key_deal: false, product_line: '瑞思玛特', source_channel: '线上-小红书', intended_campus: '三里屯校区', customer_stage: '承诺上门', tab_category: '待继续跟进', time_text: '明日10:00跟进', time_status: 'warning', color: 'blue', pipeline_stage: '接触阶段', last_status_change_at: new Date(now.getTime() - 345600000).toISOString(), follow_up_period_days: 3, min_follow_ups_required: 2 },
      { name: '李明明', phone: '139-0000-0002', customer_level: 'C', is_key_deal: false, product_line: '瑞思英语', source_channel: '线下-地推', intended_campus: '朝阳校区', customer_stage: '未承诺', tab_category: '待上门试听', time_text: '今日14:00试听', time_status: 'urgent', color: 'orange', pipeline_stage: '已到访', last_status_change_at: new Date(now.getTime() - 432000000).toISOString(), follow_up_period_days: 2, min_follow_ups_required: 1 },
      // Added more mock customers
      { name: '张小帅', phone: '135-1234-5678', customer_level: 'A', is_key_deal: true, product_line: '瑞思英语', source_channel: '线上-搜索', intended_campus: '三里屯校区', customer_stage: '已成交', tab_category: '重点客户', time_text: '回访计划中', time_status: 'success', color: 'purple', pipeline_stage: '正式学员' },
      { name: '李萌萌', phone: '137-9999-8888', customer_level: 'B', is_key_deal: false, product_line: '瑞思玛特', source_channel: '线下-自访', intended_campus: '望京校区', customer_stage: '已到访', tab_category: '待上门试听', time_text: '本周六10:00试听', time_status: 'warning', color: 'blue', pipeline_stage: '已到访' },
      { name: '赵大宝', phone: '150-1111-2222', customer_level: 'C', is_key_deal: false, product_line: '瑞思英语', source_channel: '线上营销-美团', intended_campus: '朝阳校区', customer_stage: '未上门', tab_category: '公海池客户', time_text: '超过30天未跟进', time_status: 'urgent', color: 'gray', pipeline_stage: '流失阶段' },
      { name: '孙甜甜', phone: '188-5555-6666', customer_level: 'A', is_key_deal: false, product_line: '瑞思英语', source_channel: '线上-抖音直播', intended_campus: '大悦城校区', customer_stage: '承诺上门', tab_category: '新分配客户', time_text: '2小时内联系', time_status: 'urgent', color: 'red', pipeline_stage: '邀约demo' },
    ];

    const { data: insertedCustomers, error: customerError } = await supabase.from('customers').insert(customers).select();
    if (customerError) throw customerError;

    // 4. Insert Students
    console.log('Inserting students...');
    const students = [];
    const jason = insertedCustomers.find(c => c.name === '陈杰森');
    if (jason) {
      students.push(
        { customer_id: jason.id, name: '陈杰森(小)', gender: '男', age: 3, school: '朝阳小学', grade: '一年级', is_primary: true },
        { customer_id: jason.id, name: '陈莉莉', gender: '女', age: 5, school: '朝阳小学', grade: '三年级', is_primary: false }
      );
    }
    const xiaoshuai = insertedCustomers.find(c => c.name === '张小帅');
    if (xiaoshuai) {
      students.push({ customer_id: xiaoshuai.id, name: '张小帅(小)', gender: '男', age: 4, school: '希望幼儿园', grade: '大班', is_primary: true });
    }
    if (students.length > 0) {
      const { data: insertedStudents, error: studentError } = await supabase.from('students').insert(students).select();
      if (studentError) throw studentError;

      // 5. Insert Tags
      console.log('Inserting tags...');
      const tags = [];
      if (jason) {
        tags.push(
          { customer_id: jason.id, tag_type: 'basic', tag_value: '3岁' },
          { customer_id: jason.id, tag_type: 'stage', tag_value: '已上门未缴费' },
          { customer_id: jason.id, tag_type: 'focus', tag_value: '服务质量' },
          { customer_id: jason.id, tag_type: 'focus', tag_value: '课程内容' },
          { customer_id: jason.id, tag_type: 'custom', tag_value: '对比友商中' },
          { customer_id: jason.id, tag_type: 'custom', tag_value: '注重师资' }
        );
      }
      if (xiaoshuai) {
          tags.push(
              { customer_id: xiaoshuai.id, tag_type: 'stage', tag_value: '已正式报名' },
              { customer_id: xiaoshuai.id, tag_type: 'focus', tag_value: '全英文环境' }
          );
      }
      await supabase.from('customer_tags').insert(tags);

      // 6. Insert Notes
      console.log('Inserting notes...');
      const notes = [];
      const ming = insertedCustomers.find(c => c.name === '欧阳小明');
      const jasonStudent = insertedStudents.find(s => s.name === '陈杰森(小)');
      
      if (ming) {
        notes.push(
          { customer_id: ming.id, note_type: '电话', status: '已输入', content: '“家长询问外教资格及课程资料，对目前的试听时间比较满意，考虑下周报名。”', created_at: new Date(now.getTime() - 7200000).toISOString(), next_follow_up_at: new Date(now.getTime() + 86400000).toISOString() },
          { customer_id: ming.id, note_type: '单聊', status: '已查收', content: '自然拼读.PDF', created_at: new Date(now.getTime() - 86400000).toISOString(), attachments: [{ name: '自然拼读.PDF', size: '2.4 MB', url: '', type: 'pdf' }] }
        );
      }
      if (jason && jasonStudent) {
          notes.push({ customer_id: jason.id, student_id: jasonStudent.id, note_type: '面谈', status: '已输入', content: '家长带孩子来校区进行了 DEMO 课体验，孩子表现非常积极，对互动环节很感兴趣。', created_at: new Date(now.getTime() - 172800000).toISOString() });
      }
      await supabase.from('notes').insert(notes);

      // 7. Insert WeCom Flows
      console.log('Inserting wecom flows...');
      const flows = [];
      if (ming) {
        flows.push(
          { customer_id: ming.id, to_staff_name: 'Sarah', to_staff_role: '课程顾问', flow_type: '添加好友', note: '通过渠道活码添加', stage_at_time: '承诺上门', created_at: new Date(now.getTime() - 172800000).toISOString() },
          { customer_id: ming.id, to_staff_name: 'Michael Chen', to_staff_role: '高级销售', flow_type: '分配客户', note: '系统自动分配', stage_at_time: '未承诺', created_at: new Date(now.getTime() - 259200000).toISOString() }
        );
      }
      await supabase.from('wecom_flows').insert(flows);
    }

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();
