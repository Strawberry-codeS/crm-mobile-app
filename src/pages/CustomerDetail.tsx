import { ChevronLeft, Edit2, Copy, Plus, HelpCircle, Phone, MessageSquare, Users, CheckCircle, Clock, Calendar, ShoppingBag, ShoppingCart, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useRef, useEffect, type MouseEvent as RMouseEvent } from 'react';
import { cn } from '@/lib/utils';
import { useCustomer } from '@/hooks/useCustomer';

export default function CustomerDetail() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('notes');
  const { id } = useParams<{ id: string }>();
  const { customer, students, notes, tags: customerTags, wecomFlows, loading } = useCustomer(id);

  const [activeStudentIndex, setActiveStudentIndex] = useState(0);
  const [showAddPhoneModal, setShowAddPhoneModal] = useState(false);
  const [activeStageModal, setActiveStageModal] = useState<'none' | 'demo' | 'visit' | 'enrollment'>('none');
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
        {/* Family Bar: only show 新增学员 button */}
        <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-2">
          <button
            onClick={() => navigate('edit', { state: { newStudent: true } })}
            className="flex items-center justify-center border border-dashed border-gray-300 rounded-full px-3 py-1 text-xs text-gray-500 min-w-fit bg-white/50"
          >
            + 新增学员 (孩子)
          </button>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm relative">
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
                <div className="flex gap-2 flex-wrap">
                  {profile.age && <span className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded">{profile.age}</span>}
                  <span className="text-sm bg-violet-50 text-violet-600 px-3 py-1 rounded">优惠价格</span>
                  <span className="text-sm bg-violet-50 text-violet-600 px-3 py-1 rounded">服务策略</span>
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

          <div className="flex justify-between items-start mt-6 pt-4 border-t border-gray-50 gap-2 relative z-50">
            <div className="flex-[1.2] min-w-0">
              <div className="flex items-center text-[10px] text-gray-400 mb-1">
                产品线 <HelpCircle size={10} className="ml-1 shrink-0" />
              </div>
              <div className="text-xs font-medium text-gray-800 flex items-center">
                <span className="truncate">瑞思英语</span>
                <ChevronDownIcon className="ml-0.5 shrink-0" size={14} />
              </div>
            </div>
            <div className="flex-[1.5] min-w-0">
              <div className="text-[10px] text-gray-400 mb-1 flex items-center">
                渠道来源
                <SourceExpandBadge />
              </div>
              <div className="text-xs font-medium text-gray-800 truncate">线上营销-美团-抖音</div>
            </div>
            <div className="flex-1 min-w-0 text-center">
              <div className="text-[10px] text-gray-400 mb-1">意向校区</div>
              <div className="text-xs font-medium text-gray-800 truncate">大悦城校区</div>
            </div>
            <div className="flex-1 min-w-0 text-right">
              <div className="text-[10px] text-gray-400 mb-1">推荐人</div>
              <div className="text-xs font-medium text-gray-800 truncate">崔海燕</div>
            </div>
          </div>
        </div>

        {/* Pipeline Status */}
        <div className="bg-white rounded-xl p-4 shadow-sm flex justify-between items-center text-xs">
          <div className="flex items-center text-violet-600 font-bold">
            <CheckCircle size={16} className="mr-1" /> 接触阶段
          </div>
          <div className="h-px w-8 bg-violet-200"></div>
          <div
            className="flex items-center text-violet-600 font-bold cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setActiveStageModal('demo')}
          >
            <div className="w-4 h-4 rounded-full bg-violet-600 mr-1"></div> 邀约demo
          </div>
          <div className="h-px w-8 bg-gray-200"></div>
          <div
            className="flex items-center text-gray-400 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setActiveStageModal('visit')}
          >
            <div className="w-2 h-2 rounded-full bg-gray-300 mr-2"></div> 已上门
          </div>
          <div className="h-px w-8 bg-gray-200"></div>
          <div
            className="flex items-center text-gray-400 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setActiveStageModal('enrollment')}
          >
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

          <PriorityCard />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-4 gap-3">
          <button
            onClick={() => navigate('add-note', { state: { isCall: true } })}
            className="flex items-center justify-center gap-1.5 bg-violet-100 text-violet-700 py-3 rounded-xl font-bold hover:bg-violet-200 transition text-sm"
          >
            <Phone size={16} /> 电话
          </button>
          <button className="flex items-center justify-center gap-1.5 bg-violet-100 text-violet-700 py-3 rounded-xl font-bold hover:bg-violet-200 transition text-sm">
            <MessageSquare size={16} /> 单聊
          </button>
          <button className="flex items-center justify-center gap-1.5 bg-violet-100 text-violet-700 py-3 rounded-xl font-bold hover:bg-violet-200 transition text-sm">
            <Users size={16} /> 群聊
          </button>
          <button className="flex items-center justify-center gap-1.5 bg-violet-100 text-violet-700 py-3 rounded-xl font-bold hover:bg-violet-200 transition text-sm">
            <FileText size={16} /> 建合同
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

      {/* Stage Modals */}
      <StageConfirmModal
        isOpen={activeStageModal === 'demo'}
        onClose={() => setActiveStageModal('none')}
        title={<span>是否将 <span className="font-bold">客户阶段</span> 调整为 <span className="font-bold">已邀约demo</span></span>}
        subTitle="(同步将用户标签更新为承诺上门)"
        onConfirm={() => { }}
      />

      <StageConfirmModal
        isOpen={activeStageModal === 'visit'}
        onClose={() => setActiveStageModal('none')}
        title={<span>是否将 <span className="font-bold">客户阶段</span> 调整为 <span className="font-bold">已上门</span></span>}
        subTitle="(同步将用户标签更新为已上门)"
        onConfirm={() => { }}
      />

      <StageConfirmModal
        isOpen={activeStageModal === 'enrollment'}
        onClose={() => setActiveStageModal('none')}
        title="正式报名状态会在客户签署合同后自动同步"
        onConfirm={() => { }}
        customButtons={
          <>
            <button
              onClick={() => setActiveStageModal('none')}
              className="flex-1 py-3 bg-violet-600 text-white font-medium rounded-full shadow-md shadow-violet-200 hover:bg-violet-700 transition-colors text-sm"
            >
              确认
            </button>
            <button
              onClick={() => setActiveStageModal('none')}
              className="flex-1 py-3 bg-[#c4a5ff] text-white font-medium rounded-full hover:bg-violet-400 transition-colors text-sm"
            >
              建合同
            </button>
          </>
        }
      />
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

function StageConfirmModal({
  isOpen,
  onClose,
  title,
  subTitle,
  onConfirm,
  confirmText = "确认",
  cancelText = "取消",
  customButtons,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subTitle?: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  customButtons?: React.ReactNode;
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="bg-white rounded-[2rem] w-full max-w-[320px] p-8 animate-in zoom-in-95 duration-200 relative z-10 shadow-xl flex flex-col items-center">
        {/* Info Icon */}
        <div className="w-12 h-12 bg-violet-600 rounded-full flex items-center justify-center mb-6">
          <span className="text-white font-serif text-[28px] italic -mt-1 font-medium">i</span>
        </div>

        {/* Title */}
        <div className="text-violet-600 text-[15px] mb-2 w-full flex justify-center whitespace-nowrap">
          {title}
        </div>

        {/* Subtitle */}
        {subTitle && (
          <div className="text-[#a1a1aa] text-xs mb-8 w-full flex justify-center">
            {subTitle}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 w-full mt-2">
          {customButtons ? (
            customButtons
          ) : (
            <>
              <button
                onClick={onClose}
                className="flex-1 py-3 text-gray-500 font-medium hover:bg-gray-50 rounded-full transition-colors text-sm"
              >
                {cancelText}
              </button>
              <button
                onClick={() => { onConfirm(); onClose(); }}
                className="flex-1 py-3 bg-violet-600 text-white font-medium rounded-full shadow-md shadow-violet-200 hover:bg-violet-700 transition-colors text-sm"
              >
                {confirmText}
              </button>
            </>
          )}
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
                <CallPlayer duration={note.duration_seconds} status={note.call_status} />
              )}
            </TimelineItem>
          )
        })}
      </div>
    </div>
  )
}

// ─── 通话播放器组件 ────────────────────────────────────────────────────────────
function CallPlayer({ duration, status }: { duration: string; status: string }) {
  // Convert "MM:SS" to total seconds
  const [mm, ss] = duration.split(':').map(Number);
  const totalSecs = mm * 60 + ss;

  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [speed, setSpeed] = useState(1.0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ─ progress tick ─
  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setElapsed(e => {
          if (e + 1 >= totalSecs) {
            setPlaying(false);
            return totalSecs;
          }
          return e + 1;
        });
      }, 1000 / speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, speed, totalSecs]);

  // ─ click outside to collapse ─
  useEffect(() => {
    if (!expanded) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setExpanded(false);
        setPlaying(false);
        setElapsed(0);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [expanded]);

  const handlePlay = (e: RMouseEvent) => {
    e.stopPropagation();
    if (!expanded) {
      setExpanded(true);
      setPlaying(true);
      setElapsed(0);
    } else {
      setPlaying(v => !v);
    }
  };

  // Format elapsed seconds for display
  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const pct = totalSecs > 0 ? (elapsed / totalSecs) * 100 : 0;

  const speeds = [1.0, 1.5, 2.0];
  const cycleSpeed = (e: RMouseEvent) => {
    e.stopPropagation();
    setSpeed(s => speeds[(speeds.indexOf(s) + 1) % speeds.length]);
  };

  return (
    <div ref={containerRef} className="mt-1">
      {!expanded ? (
        /* ── 收起态: 播放按钮 pill ── */
        <button
          onClick={handlePlay}
          className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full text-sm text-gray-700 font-medium hover:bg-gray-100 transition-colors"
        >
          {/* Play triangle */}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="#6D28D9">
            <polygon points="2,1 11,6 2,11" />
          </svg>
          <span>通话 {duration}</span>
        </button>
      ) : (
        /* ── 展开态: 播放器行 ── */
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full">
            {/* Pause / Play toggle */}
            <button onClick={handlePlay} className="flex-shrink-0 text-violet-600">
              {playing ? (
                /* Pause icon */
                <svg width="14" height="14" viewBox="0 0 14 14" fill="#6D28D9">
                  <rect x="2" y="2" width="3.5" height="10" rx="1" />
                  <rect x="8.5" y="2" width="3.5" height="10" rx="1" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="#6D28D9">
                  <polygon points="2,1 13,7 2,13" />
                </svg>
              )}
            </button>

            <span className="text-xs font-medium text-gray-700 flex-shrink-0">通话</span>

            {/* Progress track */}
            <div className="relative flex-1 h-1.5 bg-gray-200 rounded-full mx-1">
              <div
                className="absolute left-0 top-0 h-1.5 bg-violet-500 rounded-full transition-all"
                style={{ width: `${pct}%` }}
              />
              {/* Thumb */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border-2 border-violet-500 rounded-full shadow-sm"
                style={{ left: `calc(${pct}% - 7px)` }}
              />
              {/* Invisible range input for seeking */}
              <input
                type="range"
                min={0}
                max={totalSecs}
                value={elapsed}
                onChange={e => { setElapsed(Number(e.target.value)); }}
                onClick={e => e.stopPropagation()}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            {/* Time */}
            <span className="text-xs text-gray-500 flex-shrink-0 w-9 text-right">{fmt(elapsed)}</span>

            {/* Speed */}
            <button
              onClick={cycleSpeed}
              className="text-xs font-bold text-violet-600 flex-shrink-0 w-8 text-right"
            >
              {speed.toFixed(1)}x
            </button>
          </div>

          {/* 已接通 badge on its own row */}
          <div>
            <span className="text-xs bg-emerald-100 text-emerald-600 px-2 py-1 rounded-full font-medium">
              {status}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function SourceExpandBadge() {
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!expanded) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [expanded]);

  return (
    <div className="relative inline-flex items-center ml-2" ref={containerRef}>
      <span
        onClick={() => setExpanded(v => !v)}
        className="inline-flex items-center gap-0.5 bg-orange-50 text-orange-500 px-1.5 py-0.5 rounded-full cursor-pointer hover:bg-orange-100 transition-colors"
      >
        <HelpCircle size={10} />
        <span>拓展</span>
      </span>
      {expanded && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100 p-1.5 z-20 w-28">
          <div className="text-xs text-gray-700 py-2.5 px-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">美团-团购</div>
          <div className="text-xs text-gray-700 py-2.5 px-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">抖音-直播</div>
          <div className="text-xs text-gray-700 py-2.5 px-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">大众点评</div>
        </div>
      )}
    </div>
  );
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

function PriorityCard() {
  const [expanded, setExpanded] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  return (
    <>
      <div className="rounded-xl border border-orange-100 bg-orange-50 overflow-hidden select-none">
        {/* Content area with left icon */}
        <div className="flex gap-2.5 px-3 pt-3">
          {/* Left orange question mark icon */}
          <div className="flex-shrink-0 mt-0.5">
            <HelpCircle className="text-orange-400" size={20} />
          </div>

          {/* Text rows */}
          <div className="flex-1 min-w-0">
            <p className={`text-xs leading-5 ${expanded ? 'text-gray-600' : 'truncate text-gray-600'}`}>
              <span className="font-bold">【重点理由】</span>刚才在直播间购买了体验课，之前还看了两条课程视频，停在价格页超过3分钟。25分钟前刚发生。
            </p>
            <p className={`text-xs leading-5 mt-0.5 ${expanded ? 'text-gray-600' : 'truncate text-gray-600'}`}>
              <span className="font-bold">【客户关注】</span>体验课怎么上 · 价格是否划算 · 上课地点方不方便
            </p>

            {/* 3rd row with bottom-up gradient fade when collapsed */}
            <div className="relative mt-0.5">
              <p className={`text-xs leading-5 text-gray-600 overflow-hidden ${!expanded ? 'truncate' : ''}`}>
                <span className="font-bold">【建议开场】</span>「您好，我是瑞思的老师，看到您刚预约了体验课，想帮您确认一下上课时间——您方便说一下孩子几岁，这边给您安排最合适的班级。」
              </p>
              {/* Strong bottom-up gradient fade when collapsed */}
              {!expanded && (
                <div
                  className="absolute inset-x-0 bottom-0 h-5 pointer-events-none"
                  style={{ background: 'linear-gradient(to bottom, transparent, #FFF7ED)' }}
                />
              )}
            </div>

            {/* Extra content shown only when expanded */}
            {expanded && (
              <div className="mt-2 space-y-2">
                <div className="border-t border-orange-100 pt-1.5">
                  <p className="text-xs text-gray-600 leading-5">
                    <span className="font-bold text-orange-600">【注意】</span>她在意性价比，先别推年课，让她把体验课上了再说。
                  </p>
                </div>
                <div className="border-t border-dashed border-gray-200 pt-1.5">
                  <div className="bg-white/70 rounded-lg p-2.5 border border-orange-100 flex gap-2">
                    <p className="text-[11px] text-gray-500 leading-relaxed flex-1">
                      💡 首联时补问：「孩子在哪所幼儿园/小学呢？我看看离哪个校区最近」——补录后系统自动更新等级。
                    </p>
                    <div className="flex items-end shrink-0 gap-1.5 pb-0.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText("孩子在哪所幼儿园/小学呢？我看看离哪个校区最近");
                          }
                        }}
                        className="px-3 py-1 bg-white border border-gray-200 rounded-md text-[11px] text-gray-600 font-medium hover:bg-gray-50 transition-colors shadow-sm"
                      >
                        复制
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowFeedbackModal(true);
                        }}
                        className="w-[26px] h-[26px] flex items-center justify-center rounded-full bg-violet-50 text-violet-500 border border-violet-100 hover:bg-violet-100 transition-colors"
                      >
                        <HelpCircle size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom center chevron toggle button */}
        <div className="flex justify-center pb-2 pt-1.5">
          <button
            onClick={() => setExpanded(v => !v)}
            className="flex items-center justify-center w-6 h-6 rounded-full bg-white/80 border border-orange-100 text-gray-400 hover:bg-white transition-colors"
          >
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
      </div>
      
      <FeedbackModal isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} />
    </>
  );
}

function FeedbackModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [text, setText] = useState("");
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="bg-white rounded-[1.5rem] w-full max-w-[320px] pt-8 animate-in zoom-in-95 duration-200 relative z-10 shadow-xl flex flex-col items-center overflow-hidden">
        
        {/* Title */}
        <div className="text-gray-900 text-[17px] font-bold mb-2 w-full flex justify-center whitespace-nowrap">
          反馈话术不好用
        </div>

        {/* Subtitle */}
        <div className="text-gray-500 text-xs mb-6 w-full flex justify-center">
          告诉我们哪里不好，我们会努力改进
        </div>

        {/* Textarea */}
        <div className="w-full px-5 mb-6">
          <div className="bg-gray-50 rounded-xl p-3 relative h-28">
            <textarea 
              className="w-full h-full bg-transparent border-none text-sm placeholder:text-gray-400 focus:outline-none resize-none"
              placeholder="请输入您觉得不好用的话术问题~"
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={300}
            />
            <div className="absolute bottom-2 right-3 text-[10px] text-gray-400">
              {text.length}/300
            </div>
          </div>
        </div>

        {/* Dividers & Buttons */}
        <div className="w-full border-t border-gray-100 flex">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 text-gray-500 font-medium text-[15px] border-r border-gray-100 hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3.5 text-violet-600 font-bold text-[15px] hover:bg-gray-50 transition-colors"
          >
            提交
          </button>
        </div>
      </div>
    </div>
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
