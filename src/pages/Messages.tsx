import { ChevronLeft, Bell, Calendar, User, AlertCircle, FileText, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Messages() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto shadow-2xl overflow-hidden relative">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-900 font-medium">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-gray-900">消息中心</h1>
        <div className="w-6"></div>
      </div>

      <div className="p-4">
        {/* Quick Access Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center text-red-500 mb-2 relative">
              <Clock size={24} />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center border-2 border-white">3</div>
            </div>
            <span className="text-xs text-gray-600">任务预警</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center text-violet-500 mb-2 relative">
              <Bell size={24} />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center border-2 border-white">5</div>
            </div>
            <span className="text-xs text-gray-600">待办提醒</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-500 mb-2 relative">
              <User size={24} />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full border-2 border-white"></div>
            </div>
            <span className="text-xs text-gray-600">客户动态</span>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg text-gray-900">最近消息</h2>
          <button className="text-xs text-violet-600">全部已读</button>
        </div>

        <div className="space-y-3">
          <MessageCard
            icon={<AlertCircle size={20} />}
            iconBg="bg-red-100 text-red-500"
            title="超时跟进提醒"
            time="10:24"
            content="李明妈妈即将超时，请尽快完成今日跟进任务。"
            onClick={() => navigate('/customers/1')}
          />
          <MessageCard
            icon={<Calendar size={20} />}
            iconBg="bg-violet-100 text-violet-500"
            title="待办提醒"
            time="09:15"
            content="今日下午5：00欧阳春晓试听，请及时跟进"
            onClick={() => navigate('/customers/1')}
          />
          <MessageCard
            icon={<FileText size={20} />}
            iconBg="bg-blue-100 text-blue-500"
            title="客户新动态"
            time="昨天"
            content="张三刚刚购买了抖音小课包"
            onClick={() => navigate('/customers/1')}
          />
        </div>
      </div>
    </div>
  );
}

function MessageCard({ icon, iconBg, title, time, content, onClick }: any) {
  return (
    <div onClick={onClick} className="bg-white rounded-2xl p-4 shadow-sm flex gap-4 cursor-pointer active:scale-[0.98] transition-all">
      <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center ${iconBg}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-bold text-gray-900">{title}</h3>
          <span className="text-xs text-gray-400">{time}</span>
        </div>
        <p className="text-sm text-gray-500 truncate">{content}</p>
      </div>
    </div>
  );
}
