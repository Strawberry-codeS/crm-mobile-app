import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Menu,
    Calendar,
    UserPlus,
    TrendingUp,
    Banknote,
    AlarmClockOff,
    Phone,
    Lightbulb
} from 'lucide-react';

export default function DataDashboard() {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('');
    const [activeTab, setActiveTab] = useState('最近7天');

    return (
        <div className="min-h-screen bg-[#F8F9FD] pb-8 font-sans">
            {/* 顶部导航 */}
            <div className="flex items-center justify-between px-4 pt-6 pb-4">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Menu size={24} className="text-violet-600" />
                </button>
                <h1 className="text-lg font-bold text-gray-900 tracking-wider">数据报表</h1>
                <div className="w-8"></div> {/* Placeholder for right-alignment */}
            </div>

            {/* 日期选择器 & 过滤器 */}
            <div className="px-4 mb-5">
                <div className="grid grid-cols-[1fr_auto_auto] gap-2 items-stretch">
                    <div className="bg-white rounded-2xl px-3 py-2.5 flex items-center gap-3 border border-gray-100/50 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]">
                        <Calendar size={16} className="text-violet-300" />
                        <div className="flex items-center justify-center gap-1.5 flex-1 min-w-0">
                            <span className="text-xs font-bold text-gray-800 tracking-tight whitespace-nowrap">2025-10-27</span>
                            <span className="text-gray-300 transform scale-y-150 inline-block">~</span>
                            <span className="text-xs font-bold text-gray-800 tracking-tight whitespace-nowrap">2025-11-02</span>
                        </div>
                    </div>
                    <button
                        onClick={() => { setActiveFilter('一键整周'); setActiveTab(''); }}
                        className={`rounded-2xl px-3.5 py-2.5 text-xs font-medium shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] whitespace-nowrap transition-colors border ${activeFilter === '一键整周'
                            ? 'bg-violet-600 text-white border-violet-600'
                            : 'bg-white text-violet-600 border-violet-100 hover:bg-violet-50'
                            }`}
                    >
                        一键整周
                    </button>
                    <button
                        onClick={() => { setActiveFilter('一键整月'); setActiveTab(''); }}
                        className={`rounded-2xl px-3.5 py-2.5 text-xs font-medium shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] whitespace-nowrap transition-colors border ${activeFilter === '一键整月'
                            ? 'bg-violet-600 text-white border-violet-600'
                            : 'bg-white text-violet-600 border-violet-100 hover:bg-violet-50'
                            }`}
                    >
                        一键整月
                    </button>
                </div>

                {/* 时间跨度筛选项 */}
                <div className="flex gap-2.5 mt-4">
                    {['最近7天', '最近30天', '最近100天'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => { setActiveTab(tab); setActiveFilter(''); }}
                            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors border ${activeTab === tab
                                ? 'bg-violet-600 text-white border-violet-600 shadow-sm'
                                : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="px-4 space-y-4">
                {/* 智能建议 */}
                <div className="relative bg-[#FAEDFF] rounded-2xl p-4 overflow-hidden mt-2">
                    {/* 渐变装饰背景 */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-200/50 to-fuchsia-200/50 blur-2xl rounded-full -mr-10 -mt-10 pointer-events-none"></div>
                    <div className="relative flex gap-3 items-start">
                        <div className="w-9 h-9 rounded-[10px] bg-[#9333EA] flex items-center justify-center shrink-0 shadow-sm">
                            <Lightbulb size={18} className="text-white fill-white" />
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-[#7E22CE] text-sm mb-1">智能建议</div>
                            <p className="text-xs text-[#9333EA]/80 leading-relaxed font-medium">
                                本月报名人数已达成<span className="font-extrabold text-[#7E22CE]">90%</span>，建议优先跟进近期有上门记录的高意向客户。
                            </p>
                        </div>
                    </div>
                </div>

                {/* 报名人数 */}
                <div className="bg-white rounded-[1.25rem] p-5 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)]">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="text-gray-500 text-[13px] mb-1.5 font-medium">报名人数</div>
                            <div className="text-[32px] leading-none font-extrabold text-[#7C3AED] tracking-tight">54</div>
                        </div>
                        <div className="w-11 h-11 rounded-2xl bg-violet-100/50 flex items-center justify-center">
                            <UserPlus size={22} className="text-[#8B5CF6]" strokeWidth={2.5} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-5">
                        <div className="bg-emerald-50 text-emerald-500 text-[10px] font-extrabold px-1.5 py-0.5 rounded-[4px] flex items-center gap-0.5 leading-none tracking-tighter">
                            <TrendingUp size={10} strokeWidth={3} />
                            12.5%
                        </div>
                        <div className="text-gray-400 text-[11px] italic tracking-wide">本月目标已达成 90%</div>
                    </div>
                </div>

                {/* 现金 */}
                <div className="bg-white rounded-[1.25rem] p-5 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)]">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="text-gray-500 text-[13px] mb-1.5 font-medium">现金</div>
                            <div className="text-[32px] leading-none font-extrabold text-gray-900 tracking-tight">88k</div>
                        </div>
                        <div className="w-11 h-11 rounded-2xl bg-[#ECFDF5] flex items-center justify-center">
                            <Banknote size={22} className="text-[#10B981]" strokeWidth={2.5} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-5">
                        <div className="bg-emerald-50 text-emerald-500 text-[10px] font-extrabold px-1.5 py-0.5 rounded-[4px] flex items-center gap-0.5 leading-none tracking-tighter">
                            <TrendingUp size={10} strokeWidth={3} />
                            8.2%
                        </div>
                        <div className="text-gray-400 text-[11px] italic tracking-wide">已达成月度目标 64%</div>
                    </div>
                </div>

                {/* 数据网格卡片 */}
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { label: '跟进人数', value: '72', colorClass: 'text-gray-900' },
                        { label: '上门人数', value: '32', colorClass: 'text-gray-900' },
                        { label: '进班人数', value: '40', colorClass: 'text-gray-900' },
                        { label: '退费人数', value: '3', colorClass: 'text-[#F97316]' },
                        { label: '引流产品签约数', value: '150', colorClass: 'text-[#7C3AED]' },
                        { label: '零暑期课目标', value: '65', colorClass: 'text-[#06B6D4]' },
                        { label: '口碑转介介绍数', value: '8', colorClass: 'text-[#F43F5E]' },
                    ].map((item, index) => (
                        <div key={index} className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.04)]">
                            <div className="text-gray-500 text-[11px] mb-2 font-medium">{item.label}</div>
                            <div className={`text-xl font-extrabold ${item.colorClass}`}>{item.value}</div>
                        </div>
                    ))}
                </div>

                {/* 已超时人数 */}
                <div className="bg-[#FFF1F2] border border-[#FFE4E6] rounded-[1.25rem] px-5 py-4 shadow-sm flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#FFE4E6] flex items-center justify-center">
                            <AlarmClockOff size={18} className="text-[#E11D48]" strokeWidth={2.5} />
                        </div>
                        <div className="text-[#9F1239] font-bold text-sm">已超时人数</div>
                    </div>
                    <div className="text-[26px] font-extrabold text-[#E11D48] tracking-tight">89</div>
                </div>

                {/* 呼叫分析 */}
                <div className="bg-white rounded-[1.25rem] p-5 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.04)] mt-2">
                    <div className="flex items-center gap-2.5 mb-5">
                        <Phone size={18} className="text-[#8B5CF6] fill-[#8B5CF6]" strokeWidth={2} />
                        <div className="font-bold text-gray-900 text-[15px]">呼叫分析</div>
                    </div>

                    <div className="flex justify-between items-end mb-6 border-b border-gray-50 pb-4">
                        <div className="text-gray-500 text-xs font-medium">呼出总数</div>
                        <div className="font-extrabold text-gray-900 text-sm">46</div>
                    </div>

                    <div className="flex justify-between items-center px-1">
                        <div className="flex flex-col items-center">
                            <div className="text-xl font-extrabold text-[#10B981] mb-1.5 tracking-tight">45</div>
                            <div className="text-gray-400 text-[10px] font-medium">接通</div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="text-xl font-extrabold text-gray-900 mb-1.5 tracking-tight">12</div>
                            <div className="text-gray-400 text-[10px] font-medium">&gt;70S</div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="text-xl font-extrabold text-gray-900 mb-1.5 tracking-tight">15</div>
                            <div className="text-gray-400 text-[10px] font-medium">&gt;120S</div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="text-xl font-extrabold text-[#7C3AED] mb-1.5 tracking-tight">82:17</div>
                            <div className="text-gray-400 text-[10px] font-medium">总长</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
