import { ChevronLeft, Edit2, Copy, Plus, Calendar, X, ChevronRight } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { updateCustomer } from '@/lib/api/customers';
import { useCustomer } from '@/hooks/useCustomer';

export default function CustomerEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const { customer, loading } = useCustomer(id);

  const isNewStudent = location.state?.newStudent === true;

  const [focusDimensions, setFocusDimensions] = useState<string[]>(isNewStudent ? [] : ['服务质量', '课程内容']);
  const [customerLevel, setCustomerLevel] = useState(isNewStudent ? '' : 'A');
  const [isKeyDeal, setIsKeyDeal] = useState(isNewStudent ? '' : '是');
  const [customerStage, setCustomerStage] = useState(isNewStudent ? '' : '已上门未缴费');

  useEffect(() => {
    if (customer && !isNewStudent) {
      if (customer.focus_dimensions) setFocusDimensions(customer.focus_dimensions);
      if (customer.customer_level) setCustomerLevel(customer.customer_level);
      setIsKeyDeal(customer.is_key_deal ? '是' : '否');
      if (customer.customer_stage) setCustomerStage(customer.customer_stage);
    }
  }, [customer, isNewStudent]);

  const handleSave = async () => {
    if (!id) return;
    try {
      await updateCustomer(id, {
        customer_level: customerLevel,
        is_key_deal: isKeyDeal === '是',
        customer_stage: customerStage,
        focus_dimensions: focusDimensions,
      });
      navigate(-1);
    } catch (e) {
      console.error(e);
      navigate(-1);
    }
  };

  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showAddPhoneModal, setShowAddPhoneModal] = useState(false);

  const toggleMultiSelect = (state: string[], setState: (val: string[]) => void, value: string) => {
    if (state.includes(value)) {
      setState(state.filter(item => item !== value));
    } else {
      setState([...state, value]);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7FC] pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <button onClick={() => navigate(-1)} className="flex items-center text-violet-600 font-medium">
          <ChevronLeft size={20} /> 返回
        </button>
        <h1 className="text-lg font-bold text-gray-900">编辑信息</h1>
        <div className="w-16"></div> {/* Spacer */}
      </div>

      <div className="p-4 space-y-6">

        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex gap-4 mb-4">
            <div className="relative">
              <img
                src={isNewStudent ? "https://picsum.photos/seed/new/80/80" : (customer?.avatar_url ?? `https://picsum.photos/seed/${id}/80/80`)}
                className="w-16 h-16 rounded-full object-cover border-2 border-violet-200"
                alt="Profile"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <input
                  type="text"
                  defaultValue={isNewStudent ? '' : (customer?.name || '')}
                  placeholder="请输入姓名"
                  className="text-lg font-bold text-gray-900 bg-transparent border-none outline-none w-32 placeholder:text-gray-300 placeholder:font-normal"
                />
                <Edit2 size={14} className="text-gray-400" />
              </div>
              <div className="flex items-center text-gray-500 text-sm mb-2">
                {isNewStudent ? '暂无手机号' : (customer?.phone || '166-0368-1154')}
                {!isNewStudent && <Copy size={12} className="ml-2" />}
                <button
                  onClick={() => setShowAddPhoneModal(true)}
                  className="ml-2 bg-violet-100 text-violet-600 rounded p-0.5 hover:bg-violet-200 transition-colors"
                >
                  <Plus size={10} />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                <div>
                  <div className="text-gray-400 mb-0.5">产品线</div>
                  <div className="flex items-center">
                    <span className="truncate">{isNewStudent ? '请选择' : (customer?.product_line || '瑞思玛特')}</span>
                    <ChevronDownIcon />
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 mb-0.5">渠道来源</div>
                  <div className="flex items-center">
                    <span className="truncate">{isNewStudent ? '请选择' : (customer?.source_channel || '线下-口碑')}</span>
                    <ChevronDownIcon />
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 mb-0.5">意向校区</div>
                  <div className="flex items-center">
                    <span className="truncate">{isNewStudent ? '请选择' : '广渠门校区'}</span>
                    <ChevronDownIcon />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Follow Up */}
        <div className="bg-white rounded-2xl p-4 shadow-sm grid grid-cols-2 gap-3">
          <div className="flex-1 cursor-pointer" onClick={() => setShowFollowUpModal(true)}>
            <div className="text-sm font-bold text-gray-700 mb-2">后续跟进</div>
            <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
              <Calendar size={18} className={isNewStudent ? "text-gray-400" : "text-violet-500"} />
              {isNewStudent ? (
                <span className="text-sm text-gray-400">未设置</span>
              ) : (
                <span className="text-sm font-bold">10-24 10:00</span>
              )}
            </div>
          </div>
          <div className="flex-1 cursor-pointer" onClick={() => setShowDemoModal(true)}>
            <div className="text-sm font-bold text-gray-700 mb-2">邀请约演示时间</div>
            <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
              <Calendar size={18} className="text-orange-500" />
              <span className="text-sm text-gray-400">未设置</span>
            </div>
          </div>
        </div>

        {/* Child Info */}
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1 block">孩子性别</label>
              <div className="bg-white border border-gray-200 rounded-full px-3 py-2 flex justify-between items-center">
                <span className="text-sm">{isNewStudent ? '请选择' : '男'}</span>
                <ChevronDownIcon />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1 block">孩子年龄</label>
              <div className="bg-white border border-gray-200 rounded-full px-3 py-2 flex justify-between items-center">
                <span className="text-sm">{isNewStudent ? '请选择' : '1'}</span>
                <ChevronDownIcon />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1 block">在读学校</label>
              <input type="text" placeholder="请输入" defaultValue={isNewStudent ? '' : '朝阳小学'} className="w-full bg-white border border-gray-200 rounded-full px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1 block">在读年级</label>
              <div className="bg-white border border-gray-200 rounded-full px-3 py-2 flex justify-between items-center">
                <span className="text-sm">{isNewStudent ? '请选择' : '一年级'}</span>
                <ChevronDownIcon />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1 block">家长微信</label>
              <input type="text" placeholder="请输入" className="w-full bg-white border border-gray-200 rounded-full px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1 block">家长邮箱</label>
              <input type="text" placeholder="请输入" className="w-full bg-white border border-gray-200 rounded-full px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1 block">出生日期</label>
              <div className="bg-white border border-gray-200 rounded-full px-3 py-2 flex justify-between items-center">
                <span className="text-sm">{isNewStudent ? '请选择' : ''}</span>
                <ChevronDownIcon />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1 block">学习背景</label>
              <input type="text" placeholder="请输入" className="w-full bg-white border border-gray-200 rounded-full px-3 py-2 text-sm outline-none" />
            </div>
          </div>
        </div>

        {/* Customer Stage */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center mb-3 border-l-4 border-violet-600 pl-2">
            <h3 className="font-bold text-gray-700">客户阶段</h3>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {['已上门未缴费', '承诺上门', '承诺未上门', '未承诺', '已上门全款', '已上门订金', '无效', '退费', '禁拨'].map(status => (
              <button
                key={status}
                onClick={() => setCustomerStage(status)}
                className={cn(
                  "px-2 py-2 rounded-lg text-xs font-medium transition-colors border truncate",
                  customerStage === status
                    ? "bg-violet-50 text-violet-600 border-violet-500"
                    : "bg-white text-gray-500 border-gray-200"
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Customer Level */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center mb-3 border-l-4 border-violet-600 pl-2">
            <h3 className="font-bold text-gray-700">客户等级</h3>
          </div>
          <div className="flex gap-4">
            {['A', 'B', 'C', 'D'].map(level => (
              <button
                key={level}
                onClick={() => setCustomerLevel(level)}
                className={cn(
                  "flex-1 h-10 rounded-lg border flex items-center justify-center font-bold text-sm transition-colors",
                  customerLevel === level
                    ? "border-violet-500 bg-violet-50 text-violet-600"
                    : "border-gray-200 text-gray-500"
                )}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Key Deal */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center mb-3 border-l-4 border-violet-600 pl-2">
            <h3 className="font-bold text-gray-700">重点单</h3>
          </div>
          <div className="flex gap-4">
            {['是', '否'].map(opt => (
              <button
                key={opt}
                onClick={() => setIsKeyDeal(opt)}
                className={cn(
                  "flex-1 h-10 rounded-lg border flex items-center justify-center font-bold text-sm transition-colors",
                  isKeyDeal === opt
                    ? "border-violet-500 bg-violet-50 text-violet-600"
                    : "border-gray-200 text-gray-500"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Focus Dimensions */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center mb-3 border-l-4 border-violet-600 pl-2">
            <h3 className="font-bold text-gray-700">家长关注维度 (多选)</h3>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {['服务质量', '接送距离', '优惠力度', '竞品对比', '课程内容', '师资力量'].map(dim => (
              <button
                key={dim}
                onClick={() => toggleMultiSelect(focusDimensions, setFocusDimensions, dim)}
                className={cn(
                  "px-2 py-2 rounded-lg text-xs font-medium transition-colors border truncate",
                  focusDimensions.includes(dim)
                    ? "bg-violet-50 text-violet-600 border-violet-500"
                    : "bg-white text-gray-500 border-gray-200"
                )}
              >
                {dim}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Tags */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center mb-3 border-l-4 border-violet-600 pl-2">
            <h3 className="font-bold text-gray-700">自定义标签</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="bg-violet-50 text-violet-600 px-4 py-2 rounded-full text-sm font-bold">对比友商中</button>
            <button className="bg-violet-50 text-violet-600 px-4 py-2 rounded-full text-sm font-bold">注重师资</button>
            <button className="border border-dashed border-gray-300 text-gray-400 px-4 py-2 rounded-full text-sm flex items-center">
              <Plus size={14} className="mr-1" /> 添加
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-4 pt-4 pb-8">
          <button className="w-1/3 py-3.5 rounded-full text-gray-500 font-bold bg-white shadow-sm" onClick={() => navigate(-1)}>取消</button>
          <button className="flex-1 py-3.5 rounded-full bg-violet-600 text-white font-bold shadow-lg shadow-violet-200" onClick={handleSave}>保存并完成</button>
        </div>
      </div>

      {/* Modals */}
      {showFollowUpModal && <NextFollowUpModal onClose={() => setShowFollowUpModal(false)} />}
      {showDemoModal && <DemoAppointmentModal onClose={() => setShowDemoModal(false)} />}
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

function NextFollowUpModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] flex flex-col justify-end items-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="bg-white rounded-t-[1.25rem] w-full max-w-md h-[80vh] flex flex-col animate-in slide-in-from-bottom duration-300 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">修改下次跟进时间</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="flex justify-center items-center gap-2 mb-4">
            <ChevronLeft size={16} className="text-gray-400" />
            <span className="text-sm font-bold text-gray-900">2026年</span>
            <ChevronRight size={16} className="text-gray-400" />
          </div>

          {/* Date Picker Visual Mock */}
          <div className="flex justify-between text-center py-8 relative">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-10 bg-violet-50 rounded-lg -z-10"></div>

            <div className="flex-1 space-y-4 text-gray-300">
              <div>1月22日 周一</div>
              <div>1月23日 周二</div>
              <div className="text-gray-900 font-bold text-lg">1月24日 周三</div>
              <div>1月25日 周四</div>
              <div>1月26日 周五</div>
            </div>
            <div className="flex-1 space-y-4 text-gray-300">
              <div>08</div>
              <div>09</div>
              <div className="text-gray-900 font-bold text-lg">10</div>
              <div>11</div>
              <div>12</div>
            </div>
            <div className="flex-1 space-y-4 text-gray-300">
              <div>50</div>
              <div>55</div>
              <div className="text-gray-900 font-bold text-lg">00</div>
              <div>05</div>
              <div>10</div>
            </div>
            <div className="flex-1 space-y-4 text-gray-300">
              <div></div>
              <div></div>
              <div className="text-gray-900 font-bold text-lg">AM</div>
              <div>PM</div>
              <div></div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-bold text-gray-900 mb-3">提醒时间</h4>
            <div className="flex flex-wrap gap-3">
              {['无', '日程开始时', '5分钟', '15分钟', '1小时', '1天'].map((time, i) => (
                <button key={time} className={cn(
                  "px-4 py-2 rounded-full text-sm border",
                  i === 1 ? "bg-violet-600 text-white border-violet-600" : "bg-white text-gray-600 border-gray-200"
                )}>
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex gap-3">
          <button className="flex-1 py-3 rounded-full text-gray-500 font-bold border border-gray-200 bg-white" onClick={onClose}>取消</button>
          <button className="flex-1 py-3 rounded-full bg-violet-600 text-white font-bold shadow-lg shadow-violet-200" onClick={onClose}>确定</button>
        </div>
      </div>
    </div>
  );
}

function DemoAppointmentModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] flex flex-col justify-end items-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="bg-white rounded-t-[1.25rem] w-full max-w-md h-[80vh] flex flex-col animate-in slide-in-from-bottom duration-300 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">邀约Demo时间</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Calendar Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">2023年10月</h2>
            <div className="flex gap-4 text-gray-400">
              <ChevronLeft size={20} />
              <ChevronRight size={20} />
            </div>
          </div>

          {/* Calendar Grid Mock */}
          <div className="grid grid-cols-7 text-center text-sm mb-6">
            <div className="text-gray-400 py-2">日</div>
            <div className="text-gray-400 py-2">一</div>
            <div className="text-gray-400 py-2">二</div>
            <div className="text-gray-400 py-2">三</div>
            <div className="text-gray-400 py-2">四</div>
            <div className="text-gray-400 py-2">五</div>
            <div className="text-gray-400 py-2">六</div>

            {/* Dates Mock */}
            <div className="text-gray-300 py-3">25</div>
            <div className="text-gray-300 py-3">26</div>
            <div className="text-gray-300 py-3">27</div>
            <div className="text-gray-300 py-3">28</div>
            <div className="text-gray-300 py-3">29</div>
            <div className="text-gray-300 py-3">30</div>
            <div className="text-gray-900 py-3 font-medium">1</div>

            <div className="text-gray-900 py-3 font-medium">...</div>
            <div className="text-gray-900 py-3 font-medium">20</div>
            <div className="text-gray-900 py-3 font-medium">21</div>
            <div className="text-gray-900 py-3 font-medium">22</div>
            <div className="text-gray-900 py-3 font-medium">23</div>
            <div className="bg-violet-600 text-white rounded-xl py-3 font-bold shadow-lg shadow-violet-200">24</div>
            <div className="text-gray-900 py-3 font-medium relative">
              25
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-violet-600 rounded-full"></div>
            </div>

            <div className="text-gray-900 py-3 font-medium">26</div>
            <div className="text-gray-900 py-3 font-medium">27</div>
            <div className="text-gray-900 py-3 font-medium">28</div>
            <div className="text-gray-900 py-3 font-medium">29</div>
            <div className="text-gray-900 py-3 font-medium">30</div>
            <div className="text-gray-900 py-3 font-medium">31</div>
          </div>

          {/* Time Slots */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-4 bg-violet-600 rounded-full"></div>
              <h3 className="font-bold text-gray-900">场次时间</h3>
            </div>

            {/* Slot 1 - Selected */}
            <div className="border-2 border-violet-500 bg-violet-50 rounded-2xl p-4 relative">
              <div className="flex justify-between items-start mb-2">
                <div className="text-lg font-bold text-gray-900">10:00 - 11:30</div>
                <span className="bg-violet-500 text-white text-[10px] px-2 py-1 rounded-full">已选中</span>
              </div>
              <div className="text-violet-600 text-sm mb-3">Demo课内容 : 瑞思DEMO-P</div>
              <div className="flex justify-between text-xs text-gray-500 pt-3 border-t border-violet-200">
                <span>产品线: 瑞思英语</span>
                <span>名额: <span className="text-gray-900 font-bold">10/20</span></span>
              </div>
            </div>

            {/* Slot 2 */}
            <div className="border border-gray-100 bg-white rounded-2xl p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="text-lg font-bold text-gray-900">14:00 - 15:30</div>
              </div>
              <div className="text-gray-500 text-sm mb-3">Demo课内容 : 瑞思DEMO-D</div>
              <div className="flex justify-between text-xs text-gray-400 pt-3 border-t border-gray-50">
                <span>产品线: 瑞思玛特</span>
                <span>名额: <span className="text-gray-900 font-bold">18/20</span></span>
              </div>
            </div>

            {/* Slot 3 - Full */}
            <div className="bg-gray-50 rounded-2xl p-4 opacity-60">
              <div className="flex justify-between items-start mb-2">
                <div className="text-lg font-bold text-gray-400">16:30 - 18:00</div>
                <span className="bg-gray-200 text-gray-500 text-[10px] px-2 py-1 rounded-full">已满额</span>
              </div>
              <div className="text-gray-400 text-sm mb-3">Demo课内容 : 瑞思Face-P</div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 flex gap-3">
          <button className="flex-1 py-3 rounded-full text-gray-500 font-bold border border-gray-200 bg-white" onClick={onClose}>取消</button>
          <button className="flex-1 py-3 rounded-full bg-violet-600 text-white font-bold shadow-lg shadow-violet-200" onClick={onClose}>确定</button>
        </div>
      </div>
    </div>
  )
}

function ChevronDownIcon() {
  return (
    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="inline-block ml-1">
      <path d="M1 1L5 5L9 1" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
