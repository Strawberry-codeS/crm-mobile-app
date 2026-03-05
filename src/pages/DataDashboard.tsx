import { useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreVertical, ChevronDown, Users, DollarSign, BookOpen, Footprints, AlertTriangle, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── 数据定义 ──────────────────────────────────────────────────────────────────

type Period = '日' | '周' | '月';

// 指标选项
const METRIC_OPTIONS = ['报名人数', '现金', '跟进人数', '上门人数', '已超时'];

// 各周期下的图表数据
const chartData: Record<Period, { label: string; value: number }[]> = {
    日: [
        { label: '周一', value: 30 },
        { label: '周二', value: 45 },
        { label: '周三', value: 60 },
        { label: '周四', value: 85 },
        { label: '周五', value: 75 },
        { label: '周六', value: 90 },
        { label: '周日', value: 65 },
    ],
    周: [
        { label: '周一', value: 25 },
        { label: '周二', value: 40 },
        { label: '周三', value: 55 },
        { label: '周四', value: 75 },
        { label: '周五', value: 65 },
        { label: '周六', value: 90 },
        { label: '周日', value: 50 },
    ],
    月: [
        { label: '1月', value: 60 },
        { label: '2月', value: 45 },
        { label: '3月', value: 75 },
        { label: '4月', value: 80 },
        { label: '5月', value: 70 },
        { label: '6月', value: 90 },
        { label: '7月', value: 55 },
    ],
};

// 各周期下的指标数据
type MetricData = {
    signups: { value: number; target: number };
    cash: { value: number | string; target?: number };
    followUps: { value: number; target: number };
    visits: { value: number; target: number };
    overdue: { value: number; target?: number };
    advice: string;
};

const metricData: Record<Period, MetricData> = {
    日: {
        signups: { value: 18, target: 20 },
        cash: { value: 42, target: 50 },
        followUps: { value: 28, target: 35 },
        visits: { value: 12, target: 15 },
        overdue: { value: 12, target: 15 },
        advice: '今日报名表现良好，较昨日同时段提升5%。建议重点跟进高意向客户，并优先处理已超时任务。',
    },
    周: {
        signups: { value: 85, target: 92 },
        cash: { value: '74k' },
        followUps: { value: 66, target: 74 },
        visits: { value: 40, target: 50 },
        overdue: { value: 12 },
        advice: '本周转化率提升了5%，建议加大新线索的开发力度以保持这一趋势。',
    },
    月: {
        signups: { value: 320, target: 400 },
        cash: { value: '280k' },
        followUps: { value: 260, target: 320 },
        visits: { value: 150, target: 200 },
        overdue: { value: 45 },
        advice: '本月整体完成率达到80%，建议下月重点提升上门转化，目标转化率提升至75%。',
    },
};

// ─── 条形图组件 ────────────────────────────────────────────────────────────────

function BarChart({ data, animKey }: { data: { label: string; value: number }[]; animKey: string }) {
    const maxVal = 100;
    const svgWidth = 280;
    const svgHeight = 120;
    const barWidth = Math.floor(svgWidth / data.length) - 8;
    const gap = (svgWidth - barWidth * data.length) / (data.length + 1);

    const yLines = [100, 75, 50, 25, 0];
    // stagger delay per bar: 40ms each
    const STAGGER = 40;
    const DURATION = 380;

    return (
        <div className="relative">
            <svg
                key={animKey}
                width="100%"
                viewBox={`0 0 ${svgWidth + 40} ${svgHeight + 30}`}
                className="overflow-visible"
            >
                {/* Y-axis grid lines */}
                {yLines.map((v) => {
                    const y = ((maxVal - v) / maxVal) * svgHeight;
                    return (
                        <g key={v}>
                            <line x1={38} y1={y} x2={svgWidth + 38} y2={y} stroke="#E5E7EB" strokeWidth={0.5} strokeDasharray="4,2" />
                            <text x={34} y={y + 4} textAnchor="end" fill="#9CA3AF" fontSize={8}>{v}</text>
                        </g>
                    );
                })}

                {/* Bars with grow-from-bottom animation */}
                {data.map((d, i) => {
                    const barHeight = (d.value / maxVal) * svgHeight;
                    const x = 38 + gap + i * (barWidth + gap);
                    const baseY = svgHeight; // bottom anchor
                    const isHighest = d.value === Math.max(...data.map(dd => dd.value));
                    const fill = isHighest ? '#7C3AED' : '#C4B5FD';
                    const delay = `${i * STAGGER}ms`;
                    const dur = `${DURATION}ms`;

                    return (
                        <g key={`${animKey}-${d.label}`}>
                            {/* Clipping rect that grows from 0 to full height */}
                            <rect
                                x={x}
                                y={baseY - barHeight}
                                width={barWidth}
                                height={barHeight}
                                rx={4}
                                fill={fill}
                                style={{
                                    transformOrigin: `${x + barWidth / 2}px ${baseY}px`,
                                    animation: `barGrow ${dur} cubic-bezier(.34,1.3,.64,1) ${delay} both`,
                                }}
                            />
                            <text
                                x={x + barWidth / 2}
                                y={svgHeight + 14}
                                textAnchor="middle"
                                fill="#9CA3AF"
                                fontSize={8}
                            >
                                {d.label}
                            </text>
                        </g>
                    );
                })}
            </svg>

            {/* Global keyframe injected once */}
            <style>{`
                @keyframes barGrow {
                    from { transform: scaleY(0); opacity: 0; }
                    to   { transform: scaleY(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}

// ─── 进度条组件 ────────────────────────────────────────────────────────────────

function ProgressBar({ value, target, color }: { value: number; target?: number; color: string }) {
    const pct = target ? Math.min((value / target) * 100, 100) : 80;
    return (
        <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2">
            <div
                className={`h-1.5 rounded-full ${color}`}
                style={{ width: `${pct}%` }}
            />
        </div>
    );
}

// ─── 指标卡组件 ────────────────────────────────────────────────────────────────

function MetricCard({
    icon,
    iconBg,
    label,
    value,
    target,
    barColor,
    fullWidth = false,
}: {
    icon: ReactNode;
    iconBg: string;
    label: string;
    value: number | string;
    target?: number;
    barColor: string;
    fullWidth?: boolean;
}) {
    return (
        <div className={cn('bg-white rounded-2xl p-4 shadow-sm', fullWidth ? 'col-span-2' : '')}>
            <div className="flex items-center gap-1.5 mb-1">
                <span className={cn('w-5 h-5 flex items-center justify-center rounded', iconBg)}>{icon}</span>
                <span className="text-xs text-gray-500">{label}</span>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold text-gray-900">{value}</span>
                {target !== undefined && (
                    <span className="text-sm text-gray-400">/ {target}</span>
                )}
            </div>
            <ProgressBar value={typeof value === 'number' ? value : 80} target={target} color={barColor} />
        </div>
    );
}

// ─── 主页面 ────────────────────────────────────────────────────────────────────

export default function DataDashboard() {
    const navigate = useNavigate();
    const [period, setPeriod] = useState<Period>('日');
    const [metric, setMetric] = useState('报名人数');
    const [showMetricDropdown, setShowMetricDropdown] = useState(false);

    const chart = chartData[period];
    const stats = metricData[period];

    return (
        <div className="min-h-screen bg-[#F5F6FA] pb-8">
            {/* 顶部导航栏 */}
            <div className="flex items-center justify-between px-4 pt-6 pb-4">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <ArrowLeft size={20} className="text-gray-700" />
                </button>
                <h1 className="text-xl font-bold text-gray-900">数据看板</h1>
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <MoreVertical size={20} className="text-gray-700" />
                </button>
            </div>

            {/* 周期切换 Tab */}
            <div className="px-4 mb-4">
                <div className="flex bg-white rounded-2xl shadow-sm p-1">
                    {(['日', '周', '月'] as Period[]).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={cn(
                                'flex-1 py-2 text-sm font-medium rounded-xl transition-all',
                                period === p
                                    ? 'bg-white text-gray-900 font-bold shadow-sm border border-gray-100'
                                    : 'text-gray-400'
                            )}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            <div className="px-4 space-y-3">
                {/* 指标趋势图 */}
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-gray-900 text-sm">指标趋势</span>
                        {/* 下拉筛选 */}
                        <div className="relative">
                            <button
                                onClick={() => setShowMetricDropdown(v => !v)}
                                className="flex items-center gap-1 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full"
                            >
                                {metric}
                                <ChevronDown size={14} className={cn('transition-transform', showMetricDropdown && 'rotate-180')} />
                            </button>
                            {showMetricDropdown && (
                                <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden py-1 z-10">
                                    {METRIC_OPTIONS.map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => { setMetric(opt); setShowMetricDropdown(false); }}
                                            className={cn(
                                                'w-full text-left px-4 py-2 text-sm transition-colors',
                                                metric === opt ? 'bg-violet-50 text-violet-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                                            )}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <BarChart data={chart} animKey={period} />
                </div>

                {/* 指标卡片 2×2 网格 */}
                <div className="grid grid-cols-2 gap-3">
                    <MetricCard
                        icon={<Users size={12} className="text-violet-500" />}
                        iconBg="bg-violet-50"
                        label="报名人数"
                        value={stats.signups.value}
                        target={stats.signups.target}
                        barColor="bg-violet-500"
                    />
                    <MetricCard
                        icon={<DollarSign size={12} className="text-green-500" />}
                        iconBg="bg-green-50"
                        label="现金"
                        value={stats.cash.value}
                        target={stats.cash.target}
                        barColor="bg-green-500"
                    />
                    <MetricCard
                        icon={<BookOpen size={12} className="text-blue-500" />}
                        iconBg="bg-blue-50"
                        label="跟进人数"
                        value={stats.followUps.value}
                        target={stats.followUps.target}
                        barColor="bg-blue-500"
                    />
                    <MetricCard
                        icon={<Footprints size={12} className="text-amber-500" />}
                        iconBg="bg-amber-50"
                        label="上门人数"
                        value={stats.visits.value}
                        target={stats.visits.target}
                        barColor="bg-amber-400"
                    />
                </div>

                {/* 已超时 - 全宽 */}
                <div className="bg-white rounded-2xl p-4 shadow-sm relative">
                    {/* 红色小圆点 */}
                    <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full" />
                    <div className="flex items-center gap-1.5 mb-1">
                        <span className="w-5 h-5 flex items-center justify-center rounded bg-red-50">
                            <AlertTriangle size={12} className="text-red-500" />
                        </span>
                        <span className="text-xs text-gray-500">已超时</span>
                    </div>
                    <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-bold text-red-500">{stats.overdue.value}</span>
                        {stats.overdue.target !== undefined && (
                            <span className="text-sm text-gray-400">/ {stats.overdue.target}</span>
                        )}
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2">
                        <div
                            className="h-1.5 rounded-full bg-red-500"
                            style={{
                                width: stats.overdue.target
                                    ? `${Math.min((stats.overdue.value / stats.overdue.target) * 100, 100)}%`
                                    : '80%'
                            }}
                        />
                    </div>
                </div>

                {/* 智能建议 */}
                <div className="bg-violet-50 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center">
                            <Lightbulb size={16} className="text-white" />
                        </div>
                        <span className="font-bold text-violet-800 text-sm">智能建议</span>
                    </div>
                    <p className="text-xs text-violet-700 leading-relaxed mb-3">
                        {stats.advice}
                    </p>
                    <button className="text-violet-600 text-xs font-bold flex items-center gap-1">
                        立即处理 →
                    </button>
                </div>
            </div>
        </div>
    );
}
