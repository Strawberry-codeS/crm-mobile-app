import { ChevronLeft, Edit2, Copy, Plus, HelpCircle, Phone, MessageSquare, Users, CheckCircle, Clock, Calendar, ShoppingBag, ShoppingCart } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useCustomer } from '@/hooks/useCustomer';

export default function CustomerDetail() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('notes');
  const { id } = useParams<{ id: string }>();
  const { customer, students, notes, tags: customerTags, wecomFlows, loading } = useCustomer(id);

  const [activeStudentIndex, setActiveStudentIndex] = useState(0);
  const [showAddPhoneModal, setShowAddPhoneModal] = useState(false);
  const activeStudent = students[activeStudentIndex];

  const profile = {
    name: customer?.name ?? '加载中...',
    avatar: customer?.avatar_url ?? `https://picsum.photos/seed/${id}/80/80`,
    tags: customer ? [
      ...(customer.is_key_deal ? ['重点单'] : []),
      ...(customer.customer_level ? [`${customer.customer_level}类客户`] : []),
    ] : [],
    age: activeStudent?.age ? `${activeStudent.age}岁` : (activeStudent?.grade ?? ''),
    phone: customer?.phone ?? '',
  };

  return (
    <div className="min-h-screen bg-[#F8F7FC] pb-24">
      {/* Navbar */}
      <div className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <button onClick={() => navigate(-1)} className="flex items-center text-violet-600 font-medium">
          <ChevronLeft size={20} /> 返回
        </button>
        <h1 className="text-lg font-bold text-gray-900">客户详情</h1>
        <div className="w-16"></div> {/* Spacer */}
      </div>

      <div className="p-4 space-y-4">
        {/* Family Bar: dynamic based on students from Supabase */}
        <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-2">
          {students.map((student, idx) => (
            <button
              key={student.id}
              onClick={() => setActiveStudentIndex(idx)}
              className={cn(
                "flex items-center rounded-full pl-1 pr-4 py-1 min-w-fit transition-all",
                activeStudentIndex === idx
                  ? "bg-white border border-violet-200 shadow-sm"
                  : "bg-gray-100 border border-transparent opacity-60"
              )}
            >
              <img
                src={student.avatar_url ?? `https://picsum.photos/seed/${student.id}/40/40`}
                className={cn("w-8 h-8 rounded-full mr-2 object-cover", activeStudentIndex !== idx && 'grayscale')}
                alt="Avatar"
              />
              <span className={cn("text-sm font-bold text-gray-800", activeStudentIndex !== idx && 'font-medium text-gray-600')}>
                {student.name}
              </span>
              {!student.is_primary && <span className="ml-2 text-[10px] bg-gray-200 px-1 rounded">小孩</span>}
            </button>
          ))}
          <button
            onClick={() => navigate('edit', { state: { newStudent: true } })}
            className="flex items-center justify-center border border-dashed border-gray-300 rounded-full px-3 py-1 text-xs text-gray-500 min-w-fit bg-white/50"
          >
            + 新增学员 (孩子)
          </button>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="flex gap-4">
              <div className="relative">
                <img src={profile.avatar} className="w-16 h-16 rounded-2xl object-cover" alt="Profile" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                  {profile.tags.map(tag => (
                    <span key={tag} className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded border",
                      tag === '重点单' ? "bg-red-50 text-red-500 border-red-100" :
                        tag === 'A类客户' ? "bg-orange-50 text-orange-500 border-orange-100" :
                          "bg-gray-50 text-gray-500 border-gray-100"
                    )}>{tag}</span>
                  ))}
                </div>
                <div className="flex items-center text-gray-500 text-sm mb-2">
                  {profile.phone}
                  <Copy size={12} className="ml-2 cursor-pointer" />
                  <button
                    onClick={() => setShowAddPhoneModal(true)}
                    className="ml-2 bg-violet-100 text-violet-600 rounded p-0.5 hover:bg-violet-200 transition-colors"
                  >
                    <Plus size={10} />
                  </button>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">{profile.age}</span>
                  <span className="text-xs bg-violet-50 text-violet-600 px-2 py-1 rounded">优惠价格</span>
                  <span className="text-xs bg-violet-50 text-violet-600 px-2 py-1 rounded">服务策略</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('edit')}
              className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100"
            >
              <Edit2 size={18} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-50">
            <div>
              <div className="flex items-center text-xs text-gray-400 mb-1">
                产品线 <HelpCircle size={10} className="ml-1" />
              </div>
              <div className="text-sm font-medium text-gray-800">瑞思英语 <ChevronDownIcon /></div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">渠道来源</div>
              <div className="text-sm font-medium text-gray-800">线上营销-美团-抖音</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400 mb-1">意向校区</div>
              <div className="text-sm font-medium text-gray-800">大悦城校区</div>
            </div>
          </div>
        </div>

        {/* Pipeline Status */}
        <div className="bg-white rounded-xl p-4 shadow-sm flex justify-between items-center text-xs">
          <div className="flex items-center text-violet-600 font-bold">
            <CheckCircle size={16} className="mr-1" /> 接触阶段
          </div>
          <div className="h-px w-8 bg-violet-200"></div>
          <div className="flex items-center text-violet-600 font-bold">
            <div className="w-4 h-4 rounded-full bg-violet-600 mr-1"></div> 邀约demo
          </div>
          <div className="h-px w-8 bg-gray-200"></div>
          <div className="flex items-center text-gray-400">
            <div className="w-2 h-2 rounded-full bg-gray-300 mr-2"></div> 已到访
          </div>
          <div className="h-px w-8 bg-gray-200"></div>
          <div className="flex items-center text-gray-400">
            <div className="w-2 h-2 rounded-full bg-gray-300 mr-2"></div> 正式报名
          </div>
        </div>

        {/* Current Task */}
        <div className="bg-gradient-to-r from-violet-50 to-white rounded-2xl p-4 shadow-sm border border-violet-100">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <div className="bg-orange-500 text-white p-1 rounded">
                <CheckCircle size={12} />
              </div>
              <span className="text-sm font-bold text-orange-800">当前任务: 确认demo邀约信息</span>
            </div>
            <div className="flex items-center text-xs text-red-500 bg-white px-2 py-1 rounded-full shadow-sm">
              <Clock size={12} className="mr-1" /> 今日14:00跟进
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-violet-300 rounded-full"></div>
            <span className="text-sm text-gray-600">已邀约<span className="text-violet-600 font-bold">2月6日下午4点</span>的瑞思demo-p</span>
          </div>

          <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 flex items-start gap-2">
            <HelpCircle className="text-orange-500 mt-0.5" size={16} />
            <span className="text-xs text-gray-600">最近用户 <span className="text-orange-500 font-bold">5天</span> 未有状态变更， 建议早日跟进</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => navigate('add-note', { state: { isCall: true } })}
            className="flex items-center justify-center gap-2 bg-violet-100 text-violet-700 py-3 rounded-xl font-bold hover:bg-violet-200 transition"
          >
            <Phone size={18} /> 电话
          </button>
          <button className="flex items-center justify-center gap-2 bg-violet-100 text-violet-700 py-3 rounded-xl font-bold hover:bg-violet-200 transition">
            <MessageSquare size={18} /> 单聊
          </button>
          <button className="flex items-center justify-center gap-2 bg-violet-100 text-violet-700 py-3 rounded-xl font-bold hover:bg-violet-200 transition">
            <Users size={18} /> 群聊
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-2xl shadow-sm mt-2">
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab('tags')}
              className={cn("flex-1 py-4 text-sm font-bold text-center relative", activeTab === 'tags' ? "text-violet-600" : "text-gray-400")}
            >
              标签
              {activeTab === 'tags' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-violet-600 rounded-t-full"></div>}
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={cn("flex-1 py-4 text-sm font-bold text-center relative", activeTab === 'notes' ? "text-violet-600" : "text-gray-400")}
            >
              用户纪要
              {activeTab === 'notes' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-violet-600 rounded-t-full"></div>}
            </button>
            <button
              onClick={() => setActiveTab('wechat')}
              className={cn("flex-1 py-4 text-sm font-bold text-center relative", activeTab === 'wechat' ? "text-violet-600" : "text-gray-400")}
            >
              企微流转
              {activeTab === 'wechat' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-violet-600 rounded-t-full"></div>}
            </button>
          </div>

          <div className="p-5 min-h-[400px]">
            {activeTab === 'tags' && <TagsView tags={customerTags} />}
            {activeTab === 'notes' && <NotesView notes={notes} />}
            {activeTab === 'wechat' && <WeComFlowView wecomFlows={wecomFlows} />}
          </div>
        </div>
      </div>

      {showAddPhoneModal && <AddPhoneModal onClose={() => setShowAddPhoneModal(false)} />}
    </div>
  );
}

function AddPhoneModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="bg-white rounded-[2rem] w-full max-w-sm p-6 animate-in zoom-in-95 duration-200 relative z-10 shadow-xl">
        <h3 className="text-xl font-bold text-center text-gray-900 mb-6">添加手机号</h3>

        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">手机号</label>
            <input
              type="text"
              placeholder="请输入手机号"
              className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-violet-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">号码属性</label>
            <div className="relative">
              <select className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm appearance-none focus:ring-2 focus:ring-violet-500 outline-none pr-10">
                <option>主号 (Primary)</option>
                <option>副号 (Secondary)</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronDownIcon />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-full text-gray-500 font-bold border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-full bg-violet-600 text-white font-bold shadow-lg shadow-violet-200 hover:bg-violet-700 transition-colors"
          >
            确认添加
          </button>
        </div>
      </div>
    </div>
  );
}

function WeComFlowView({ wecomFlows }: { wecomFlows: any[] }) {
  const displayFlows = wecomFlows.length > 0 ? wecomFlows : [
    { id: 1, created_at: '2023-12-28T14:20:00', flow_type: '流转至', to_staff_id: '顾老师', note: '主动添加用户', stage_at_time: '用户 已全款' },
    { id: 2, created_at: '2023-11-15T09:45:00', flow_type: '流转至', to_staff_id: '李顾问', note: '主动添加用户', stage_at_time: '用户 承诺上门, 商机分配' },
    { id: 3, created_at: '2023-10-01T10:00:00', flow_type: '初始分配', to_staff_id: '果媛', note: '用户主动添加', stage_at_time: '用户通过 线上渠道-抖音-阅读大冒险 (活动)' }
  ];

  return (
    <div className="space-y-8 pl-2">
      <div className="relative border-l-2 border-gray-100 ml-2 space-y-10 pb-4">
        {displayFlows.map(flow => (
          <div key={flow.id} className="relative pl-6">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-violet-500 border-4 border-white shadow-sm"></div>
            <div className="text-xs text-gray-400 mb-2">{new Date(flow.created_at).toLocaleString()}</div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-gray-900">{flow.flow_type}:</span>
                <span className="text-violet-600 font-bold">{flow.to_staff_id || flow.from_staff_id || flow.note}</span>
                {flow.flow_type === '流转至' && flow.to_staff_id === '顾老师' && <span className="text-[10px] bg-gray-200 text-gray-600 px-1 py-0.5 rounded ml-1">职位: 授课教师</span>}
                {flow.flow_type === '流转至' && flow.to_staff_id === '李顾问' && <span className="text-[10px] bg-gray-200 text-gray-600 px-1 py-0.5 rounded ml-1">职位: 市场专员</span>}
                {flow.flow_type === '初始分配' && flow.to_staff_id === '果媛' && <span className="text-[10px] bg-gray-200 text-gray-600 px-1 py-0.5 rounded ml-1">职位: 用户运营</span>}
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                <span>{flow.note}</span>
                {flow.flow_type === '初始分配' && <span className="bg-violet-200 text-violet-700 text-[10px] px-2 py-1 rounded-full flex items-center"><Edit2 size={10} className="mr-1" />话术推荐</span>}
              </div>
              {flow.stage_at_time && (
                <div className="flex items-center text-xs text-gray-500 bg-white p-2 rounded-lg border border-gray-100">
                  <span className="text-gray-400 mr-1 flex items-center justify-center w-4 h-4 rounded-full bg-gray-100 disabled text-[10px]">★</span> 阶段: {flow.stage_at_time}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TagsView({ tags }: { tags: any[] }) {
  const displayTags = tags.length > 0 ? tags : [
    { id: 1, tag_type: '基础标签', tag_value: '3岁', is_active: false },
    { id: 2, tag_type: '基础标签', tag_value: '北京', is_active: false },
    { id: 3, tag_type: '基础标签', tag_value: '女', is_active: false },
    { id: 4, tag_type: '基础标签', tag_value: '朝阳小学', is_active: false },
    { id: 5, tag_type: '基础标签', tag_value: '六年级', is_active: false },
    { id: 6, tag_type: '基础标签', tag_value: '探访', is_active: false },
    { id: 7, tag_type: '基础标签', tag_value: 'TMK下发', is_active: false },
    { id: 8, tag_type: '行为标签', tag_value: '浏览启蒙', is_active: false },
    { id: 9, tag_type: '行为标签', tag_value: '阅读大冒险活跃', is_active: false },
    { id: 10, tag_type: '行为标签', tag_value: '高频浏览自然拼读课包', is_active: false },
    { id: 11, tag_type: '客户阶段标签', tag_value: '已上门未缴费', is_active: true },
    { id: 12, tag_type: '客户阶段标签', tag_value: '承诺上门', is_active: false },
    { id: 13, tag_type: '客户阶段标签', tag_value: '承诺未上门', is_active: false },
    { id: 14, tag_type: '客户阶段标签', tag_value: '未承诺', is_active: false },
    { id: 15, tag_type: '客户阶段标签', tag_value: '已上门全款', is_active: false },
    { id: 16, tag_type: '客户阶段标签', tag_value: '已上门订金', is_active: false },
    { id: 17, tag_type: '客户阶段标签', tag_value: '无效', is_active: false },
    { id: 18, tag_type: '客户阶段标签', tag_value: '退费', is_active: false },
    { id: 19, tag_type: '客户阶段标签', tag_value: '禁拨', is_active: false },
    { id: 20, tag_type: '家长关注维度 (多选)', tag_value: '服务质量', is_active: true },
    { id: 21, tag_type: '家长关注维度 (多选)', tag_value: '接送距离', is_active: false },
    { id: 22, tag_type: '家长关注维度 (多选)', tag_value: '优惠力度', is_active: false },
    { id: 23, tag_type: '家长关注维度 (多选)', tag_value: '竞品对比', is_active: false },
    { id: 24, tag_type: '家长关注维度 (多选)', tag_value: '课程内容', is_active: false },
    { id: 25, tag_type: '家长关注维度 (多选)', tag_value: '师资力量', is_active: false },
    { id: 26, tag_type: '自定义标签', tag_value: '对比友商中', is_active: true },
    { id: 27, tag_type: '自定义标签', tag_value: '注重师资', is_active: true },
  ];

  const groupedTags = displayTags.reduce((acc, tag) => {
    acc[tag.tag_type || '其他标签'] = acc[tag.tag_type || '其他标签'] || [];
    acc[tag.tag_type || '其他标签'].push(tag);
    return acc;
  }, {} as Record<string, any[]>);

  const getTagColor = (type: string) => {
    if (type === '基础标签') return 'blue';
    if (type === '行为标签') return 'pink';
    if (type === '客户阶段标签') return 'orange';
    if (type === '家长关注维度 (多选)') return 'violet';
    if (type === '自定义标签') return 'emerald';
    return 'blue';
  };

  return (
    <div className="space-y-6">
      <h3 className="font-bold text-lg mb-4">标签信息</h3>
      {Object.entries(groupedTags).map(([type, groupTags]: [string, any[]]) => (
        <TagGroup key={type} title={type} color={getTagColor(type)}>
          {groupTags.map(t => (
            <Tag key={t.id} active={t.is_active}>{t.tag_value}</Tag>
          ))}
          {type === '自定义标签' && (
            <button className="border border-dashed border-gray-300 text-gray-400 px-4 py-2 rounded-lg text-xs font-medium flex items-center hover:bg-gray-50 transition-colors">
              <Plus size={14} className="mr-1" /> 添加
            </button>
          )}
        </TagGroup>
      ))}

      <div className="mb-6">
        <button className="border border-dashed border-gray-300 text-gray-400 px-4 py-2 rounded-lg text-xs font-medium flex items-center hover:bg-gray-50 transition-colors">
          <Plus size={14} className="mr-1" /> 添加标签类别
        </button>
      </div>
    </div>
  );
}

function NotesView({ notes }: { notes: any[] }) {
  const navigate = useNavigate();
  const displayNotes = notes.length > 0 ? notes : [
    {
      id: 1, created_at: new Date().toISOString(), note_type: '电话', content: '"家长询问外教资质及课程进度，对目前的试听时间比较满意，考虑下周报名。"', call_status: '已接通', duration_seconds: '12:45'
    },
    {
      id: 2, created_at: new Date(Date.now() - 86400000).toISOString(), note_type: '微信发送资料', content: '', attachment: '自然拼读.PDF', attachment_size: '2.4 MB', attachment_status: '已查收'
    },
    {
      id: 3, created_at: '2023-10-23T09:12:00', note_type: '小红书下单', content: '¥0.00 试听课', status: 'error'
    },
    {
      id: 4, created_at: '2023-10-22T15:45:00', note_type: '抖音商城下单', content: '购买课程', price: '¥ 299.00', status: 'success'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-500 text-sm">纪要列表</h3>
        <button
          onClick={() => navigate('add-note')}
          className="text-violet-600 text-sm font-bold flex items-center"
        >
          <Plus size={16} className="mr-1" /> 新增纪要
        </button>
      </div>

      <div className="relative border-l-2 border-dashed border-gray-200 ml-4 space-y-8 pb-10">
        {displayNotes.map(note => {
          let icon = <Phone size={16} />;
          let color = "bg-violet-100 text-violet-600 border-violet-100";
          let title = note.note_type;
          let timeStr = new Date(note.created_at).toLocaleString();

          if (note.note_type === '电话') {
            icon = <Phone size={16} />;
            color = "bg-purple-100 text-purple-600 border-purple-100 border-opacity-50";
            title = '详细沟通电话';
            timeStr = '今日 10:15';
          } else if (note.note_type === '微信发送资料') {
            icon = <MessageSquare size={16} />;
            color = "bg-emerald-100 text-emerald-600 border-emerald-100 border-opacity-50";
            timeStr = '昨日 18:20';
          } else if (note.note_type === '小红书下单') {
            icon = <ShoppingBag size={16} />;
            color = "bg-red-100 text-red-600 border-red-100 border-opacity-50";
            timeStr = '10-23 09:12';
          } else if (note.note_type === '抖音商城下单') {
            icon = <ShoppingCart size={16} />;
            color = "bg-violet-100 text-violet-600 border-violet-100 border-opacity-50";
            timeStr = '10-22 15:45';
          }

          return (
            <TimelineItem
              key={note.id}
              icon={icon}
              color={color}
              title={title}
              time={timeStr}
            >
              {note.content && note.note_type === '电话' && (
                <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 italic mb-2 border border-gray-100">
                  {note.content}
                </div>
              )}
              {note.note_type === '微信发送资料' && (
                <div className="flex items-center gap-3 bg-white border border-gray-100 p-3 rounded-xl shadow-sm my-2">
                  <div className="bg-red-500 text-white font-bold text-xs p-2 rounded-lg">PDF</div>
                  <div>
                    <div className="font-bold text-sm">{note.attachment}</div>
                    <div className="text-xs text-gray-400">{note.attachment_size} · {note.attachment_status}</div>
                  </div>
                </div>
              )}
              {note.note_type === '小红书下单' && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold flex justify-between items-center my-2">
                  <span>{note.content}</span>
                  <ChevronRight size={16} className="text-red-400" />
                </div>
              )}
              {note.note_type === '抖音商城下单' && (
                <div className="flex justify-between items-center my-2 py-1">
                  <span className="text-sm text-gray-600">{note.content}</span>
                  <span className="text-violet-600 font-bold text-lg">{note.price}</span>
                </div>
              )}
              {note.call_status && (
                <div className="flex gap-2">
                  {note.duration_seconds && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">通话 {note.duration_seconds}</span>}
                  {note.call_status && <span className="text-xs bg-emerald-100 text-emerald-600 px-2 py-1 rounded">{note.call_status}</span>}
                </div>
              )}
            </TimelineItem>
          )
        })}
      </div>
    </div>
  )
}

function TimelineItem({ icon, color, title, time, children }: any) {
  return (
    <div className="relative pl-8">
      <div className={`absolute -left-[17px] top-0 w-9 h-9 rounded-full border-4 border-white ${color} flex items-center justify-center shadow-sm z-10`}>
        {icon}
      </div>
      <div className="flex justify-between items-baseline mb-2">
        <h4 className="font-bold text-gray-900">{title}</h4>
        <span className="text-xs text-gray-400">{time}</span>
      </div>
      <div>{children}</div>
    </div>
  )
}

function TagGroup({ title, children, color }: any) {
  let dotColor = "bg-gray-300";
  if (color === 'blue') dotColor = "bg-blue-400";
  if (color === 'pink') dotColor = "bg-pink-400";
  if (color === 'orange') dotColor = "bg-orange-400";
  if (color === 'red') dotColor = "bg-red-400";
  if (color === 'violet') dotColor = "bg-violet-400";

  return (
    <div className="mb-6">
      <div className="flex items-center mb-3">
        <div className={`w-2 h-2 rounded-full ${dotColor} mr-2`}></div>
        <h4 className="font-bold text-gray-700 text-sm">{title}</h4>
      </div>
      <div className="flex flex-wrap gap-2">
        {children}
      </div>
    </div>
  );
}

function Tag({ children, active }: any) {
  return (
    <span className={cn(
      "px-4 py-2 rounded-lg text-xs font-medium transition-colors border",
      active
        ? "bg-violet-50 text-violet-600 border-violet-100"
        : "bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100"
    )}>
      {children}
    </span>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="inline-block ml-1">
      <path d="M1 1L5 5L9 1" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronRight({ size, className }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}
