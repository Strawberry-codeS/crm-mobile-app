import { ChevronLeft, Calendar, RefreshCcw, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function Settings() {
    const navigate = useNavigate();
    const [dingTalkSync, setDingTalkSync] = useState(true);
    const [systemSync, setSystemSync] = useState(false);

    return (
        <div className="min-h-screen bg-[#F5F6FA] pb-24">
            {/* Header */}
            <div className="bg-[#F5F6FA] px-4 py-4 flex items-center justify-between sticky top-0 z-10">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2">
                    <ChevronLeft size={24} className="text-gray-600" />
                </button>
                <h1 className="text-xl font-bold text-gray-900 absolute left-1/2 -translate-x-1/2">设置</h1>
                <div className="w-10"></div> {/* Spacer */}
            </div>

            <div className="p-5 space-y-6">
                {/* Section Title */}
                <div className="flex items-center gap-3 mt-2 mb-6">
                    <div className="w-1.5 h-6 bg-violet-500 rounded-full"></div>
                    <h2 className="text-xl font-bold text-gray-900">日历同步</h2>
                </div>

                {/* Option 1: DingTalk */}
                <div className="bg-white rounded-3xl p-6 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
                                <Calendar size={24} />
                            </div>
                            <div className="text-lg font-bold text-gray-900">同步至钉钉日历</div>
                        </div>
                        <button
                            onClick={() => setDingTalkSync(!dingTalkSync)}
                            className={cn(
                                "w-5 h-5 rounded flex items-center justify-center border transition-colors",
                                dingTalkSync ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300"
                            )}
                        >
                            {dingTalkSync && <Check size={14} strokeWidth={3} />}
                        </button>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed pt-2">
                        开启后，待办任务将自动同步至您的钉钉日程中，方便您统一查看工作安排。
                    </p>
                </div>

                {/* Option 2: System */}
                <div className="bg-white rounded-3xl p-6 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-500">
                                <Calendar size={24} />
                            </div>
                            <div className="text-lg font-bold text-gray-900">同步至系统日历</div>
                        </div>
                        <button
                            onClick={() => setSystemSync(!systemSync)}
                            className={cn(
                                "w-5 h-5 rounded flex items-center justify-center border transition-colors",
                                systemSync ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300"
                            )}
                        >
                            {systemSync && <Check size={14} strokeWidth={3} />}
                        </button>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed pt-2">
                        开启后，待办任务将自动同步至您的 iOS 系统日程中，接收系统级的提醒通知。
                    </p>
                </div>

                {/* Sync All Button */}
                <div className="pt-8 text-center pb-8">
                    <button
                        onClick={() => {
                            setDingTalkSync(true);
                            setSystemSync(true);
                        }}
                        className="w-full py-4 rounded-full bg-[#8b5cf6] text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-violet-200/50 hover:bg-[#7c3aed] transition-colors text-base"
                    >
                        <RefreshCcw size={18} /> 同步全部
                    </button>
                    <div className="text-xs text-gray-400 mt-5">
                        点击“同步全部”将一键开启以上所有同步选项
                    </div>
                </div>
            </div>
        </div>
    );
}
