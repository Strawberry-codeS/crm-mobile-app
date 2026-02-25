import { User, Settings, LogOut, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Profile() {
  return (
    <div className="p-4">
      <div className="flex flex-col items-center mt-10 mb-8">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 text-2xl font-bold border-4 border-white shadow-lg">
            MC
          </div>
          <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full"></div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Michael Chen</h1>
        <p className="text-gray-500 text-sm mt-1">高级销售顾问 • 华东大区</p>
      </div>

      <div className="space-y-4">
        <Link to="/settings" className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between block">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
              <Settings size={20} />
            </div>
            <div>
              <div className="font-bold text-gray-900">工作台设置</div>
              <div className="text-xs text-gray-400">日历同步设置</div>
            </div>
          </div>
          <ChevronRight className="text-gray-300" size={20} />
        </Link>

        <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500">
              <User size={20} />
            </div>
            <div>
              <div className="font-bold text-gray-900">个人档案</div>
              <div className="text-xs text-gray-400">大悦城布局，广渠门布局</div>
            </div>
          </div>
          <ChevronRight className="text-gray-300" size={20} />
        </div>
      </div>

      <button className="w-full mt-12 py-4 text-red-500 font-bold bg-white rounded-2xl shadow-sm">
        退出登录
      </button>
    </div>
  );
}
