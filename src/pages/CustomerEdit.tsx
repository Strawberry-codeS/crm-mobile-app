import { ChevronLeft, Edit2, Copy, Plus } from 'lucide-react';
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

  const [showAddPhoneModal, setShowAddPhoneModal] = useState(false);

  const handleSave = async () => {
    if (!id) return;
    try {
      // Basic profile updates can be added here if needed in the future
      navigate(-1);
    } catch (e) {
      console.error(e);
      navigate(-1);
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


        {/* Footer */}
        <div className="flex gap-4 pt-4 pb-8">
          <button className="w-1/3 py-3.5 rounded-full text-gray-500 font-bold bg-white shadow-sm" onClick={() => navigate(-1)}>取消</button>
          <button className="flex-1 py-3.5 rounded-full bg-violet-600 text-white font-bold shadow-lg shadow-violet-200" onClick={handleSave}>保存并完成</button>
        </div>
      </div>

      {/* Modals */}
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


function ChevronDownIcon() {
  return (
    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="inline-block ml-1">
      <path d="M1 1L5 5L9 1" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
