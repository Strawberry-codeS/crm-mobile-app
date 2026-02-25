-- ============================================================
-- CRM Mobile App — Supabase 初始化迁移脚本
-- 在 Supabase Dashboard → SQL Editor 中执行
-- ============================================================

-- 1. 员工档案表
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null default '',
  role text not null default '顾问',
  avatar_url text,
  created_at timestamptz default now()
);

-- 当新用户注册时自动创建档案
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', new.email));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. 客户表
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  assigned_to uuid references profiles(id) on delete set null,
  name text not null,
  phone text,
  phones jsonb,
  avatar_url text,
  customer_level text check (customer_level in ('A','B','C','D')),
  customer_stage text,
  is_key_deal boolean default false,
  product_line text,
  source_channel text,
  intended_campus text,
  pipeline_stage text,
  next_follow_up_at timestamptz,
  demo_appointment_at timestamptz,
  last_status_change_at timestamptz default now(),
  tab_category text,
  time_text text,
  time_status text check (time_status in ('urgent','warning','success')),
  focus_dimensions text[],
  custom_tags text[],
  color text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. 学员（子女）表
create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete cascade not null,
  name text not null,
  avatar_url text,
  gender text,
  age int,
  birthdate date,
  school text,
  grade text,
  learning_background text,
  is_primary boolean default true,
  created_at timestamptz default now()
);

-- 4. 客户标签表
create table if not exists customer_tags (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete cascade not null,
  tag_type text check (tag_type in ('basic','behavior','stage','focus','custom')) not null,
  tag_value text not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 5. 跟进纪要表
create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete cascade not null,
  student_id uuid references students(id) on delete set null,
  created_by uuid references profiles(id) on delete set null,
  note_type text,
  consultation_method text,
  status text default '正文',
  content text,
  duration_seconds int,
  call_status text,
  attachments jsonb,
  next_follow_up_at timestamptz,
  demo_appointment_at timestamptz,
  created_at timestamptz default now()
);

-- 6. 企微流转记录
create table if not exists wecom_flows (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete cascade not null,
  from_staff_id uuid references profiles(id) on delete set null,
  to_staff_id uuid references profiles(id) on delete set null,
  to_staff_name text,
  to_staff_role text,
  flow_type text,
  note text,
  stage_at_time text,
  created_at timestamptz default now()
);

-- 7. Demo场次（试听课）表
create table if not exists demo_sessions (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  start_time time not null,
  end_time time not null,
  content text,
  product_line text,
  capacity int default 20,
  enrolled int default 0,
  created_at timestamptz default now()
);

-- ============================================================
-- RLS (Row Level Security) 策略
-- ============================================================
alter table profiles enable row level security;
alter table customers enable row level security;
alter table students enable row level security;
alter table customer_tags enable row level security;
alter table notes enable row level security;
alter table wecom_flows enable row level security;
alter table demo_sessions enable row level security;

-- 允许已登录用户或匿名用户读写所有数据（因前端去除了登录）
create policy "Users can read all profiles" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update using (true);

create policy "Anon read customers" on customers for all using (true);
create policy "Anon read students" on students for all using (true);
create policy "Anon read tags" on customer_tags for all using (true);
create policy "Anon read notes" on notes for all using (true);
create policy "Anon read wecom" on wecom_flows for all using (true);
create policy "Anon read demos" on demo_sessions for all using (true);

-- ============================================================
-- 初始种子数据（与前端 hardcoded 数据一致）
-- ============================================================

-- 创建一个测试账号对应的 profile（在 supabase auth 创建账号后，手动关联）
-- 先插入客户数据（不关联 assigned_to）

insert into customers (name, phone, customer_level, is_key_deal, product_line, source_channel, intended_campus, customer_stage, tab_category, time_text, time_status, color, pipeline_stage, last_status_change_at) values
  ('欧阳春晓', '138-8888-0001', 'A', false, '瑞思英语', '线上-抖音表单', '大悦城校区', '承诺上门', '新分配客户', '首次：15:00后超时', 'urgent', 'red', '邀约demo', now() - interval '1 day'),
  ('欧阳小明', '138-8888-0002', 'B', false, '瑞思英语', '线下-口碑', '朝阳校区', '未承诺', '新分配客户', '首次：30:00后超时', 'success', 'green', '接触阶段', now() - interval '2 days'),
  ('陈杰森', '166-0368-1154', 'A', true, '瑞思英语', '线上营销-美团-抖音', '大悦城校区', '已上门未缴费', '重点客户', '今日22:00跟进', 'urgent', 'red', '邀约demo', now() - interval '3 days'),
  ('王小红', '139-0000-0001', 'B', false, '瑞思玛特', '线上-小红书', '三里屯校区', '承诺上门', '待继续跟进', '明日10:00跟进', 'warning', 'blue', '接触阶段', now() - interval '4 days'),
  ('李明明', '139-0000-0002', 'C', false, '瑞思英语', '线下-地推', '朝阳校区', '未承诺', '待上门试听', '今日14:00试听', 'urgent', 'orange', '已到访', now() - interval '5 days')
on conflict do nothing;

-- 插入学员数据
insert into students (customer_id, name, gender, age, school, grade, is_primary)
select id, '陈杰森(小)', '男', 3, '朝阳小学', '一年级', true from customers where name = '陈杰森'
on conflict do nothing;

insert into students (customer_id, name, gender, age, school, grade, is_primary)
select id, '陈莉莉', '女', 5, '朝阳小学', '三年级', false from customers where name = '陈杰森'
on conflict do nothing;

-- 插入Demo场次
insert into demo_sessions (date, start_time, end_time, content, product_line, capacity, enrolled) values
  (current_date + 1, '10:00', '11:30', '瑞思DEMO-P', '瑞思英语', 20, 10),
  (current_date + 1, '14:00', '15:30', '瑞思DEMO-D', '瑞思玛特', 20, 18),
  (current_date + 1, '16:30', '18:00', '瑞思Face-P', '瑞思英语', 20, 20)
on conflict do nothing;

-- 插入标签数据
insert into customer_tags (customer_id, tag_type, tag_value, is_active)
select id, 'basic', '3岁', true from customers where name = '陈杰森'
on conflict do nothing;

insert into customer_tags (customer_id, tag_type, tag_value, is_active)
select id, 'stage', '已上门未缴费', true from customers where name = '陈杰森'
on conflict do nothing;

insert into customer_tags (customer_id, tag_type, tag_value, is_active)
select id, 'focus', '服务质量', true from customers where name = '陈杰森'
on conflict do nothing;

insert into customer_tags (customer_id, tag_type, tag_value, is_active)
select id, 'focus', '课程内容', true from customers where name = '陈杰森'
on conflict do nothing;

insert into customer_tags (customer_id, tag_type, tag_value, is_active)
select id, 'custom', '对比友商中', true from customers where name = '陈杰森'
on conflict do nothing;

insert into customer_tags (customer_id, tag_type, tag_value, is_active)
select id, 'custom', '注重师资', true from customers where name = '陈杰森'
on conflict do nothing;

-- 插入跟进纪要数据
insert into notes (customer_id, note_type, status, content, created_at, next_follow_up_at)
select id, '电话', '已输入', '“家长询问外教资格及课程资料，对目前的试听时间比较满意，考虑下周报名。”', now() - interval '2 hours', now() + interval '1 day' from customers where name = '欧阳小明'
on conflict do nothing;

insert into notes (customer_id, note_type, status, content, created_at, attachments)
select id, '单聊', '已查收', '自然拼读.PDF', now() - interval '1 day', '[{"name": "自然拼读.PDF", "size": "2.4 MB"}]'::jsonb from customers where name = '欧阳小明'
on conflict do nothing;

-- 插入企微流转记录
insert into wecom_flows (customer_id, to_staff_name, to_staff_role, flow_type, note, stage_at_time, created_at)
select id, 'Sarah', '课程顾问', '添加好友', '通过渠道活码添加', '承诺上门', now() - interval '2 days' from customers where name = '欧阳小明'
on conflict do nothing;

insert into wecom_flows (customer_id, to_staff_name, to_staff_role, flow_type, note, stage_at_time, created_at)
select id, 'Michael Chen', '高级销售', '分配客户', '系统自动分配', '未承诺', now() - interval '3 days' from customers where name = '欧阳小明'
on conflict do nothing;
