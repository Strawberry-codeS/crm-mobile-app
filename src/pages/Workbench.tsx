import { Bell, Phone, MessageSquare, Search, Filter, Menu, X, MapPin, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import React from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useCustomers } from '@/hooks/useCustomers';

// ─── 数据类型 ───────────────────────────────────────────────────────────────
export interface CustomerData {
    id?: string;
    name: string;
    /** 第一个标签显示为纯色背景(红/橙/绿)白字，后续为渠道标签 */
    tags: string[];
    /** 卡片左边框及时钟颜色: red / orange / green */
    color: 'red' | 'orange' | 'green';
    /** 时钟提示文字（如果有截止期限，此项将回退作为默认兜底） */
    timeText: string;
    /** 时钟状态: urgent红 / warning橙 / success绿 */
    timeStatus: 'urgent' | 'warning' | 'success';
    /** 任务描述 */
    task: string;
    /** 底部 | 分隔的信息标签 */
    info: string;

    first_response_deadline_at?: string | null;
    follow_up_period_days?: number | null;
    min_follow_ups_required?: number | null;
}

// ─── 每个 Tab 的数据 ─────────────────────────────────────────────────────────
const tabData: Record<string, CustomerData[]> = {
    新分配客户: [
        {
            name: '欧阳春晓',
            tags: ['3天待跟进2次', '线上-抖音表单'],
            color: 'red',
            timeText: '首次：15:00后超时',
            timeStatus: 'urgent',
            task: '当前任务: 询问痛点',
            info: '3.5岁 | 重点单 | 价格优惠 | 未承诺',
        },
        {
            name: '王梓轩',
            tags: ['3天待跟进2次', '线上-抖音-活动'],
            color: 'orange',
            timeText: '首次：25:00后超时',
            timeStatus: 'warning',
            task: '当前任务: 询问痛点',
            info: '5岁 | 常规单 | 绘本阅读精修 | 未承诺',
        },
        {
            name: '欧阳小明',
            tags: ['3天待跟进2次', '线下-口碑'],
            color: 'green',
            timeText: '首次：30:00后超时',
            timeStatus: 'success',
            task: '当前任务: 询问痛点',
            info: '4岁 | 常规单 | 口语启蒙进阶 | 未承诺',
        },
        {
            name: '陈杰森',
            tags: ['2天待跟进1次', '线上-美团-活动'],
            color: 'red',
            timeText: '今日18:00后超时',
            timeStatus: 'urgent',
            task: '当前任务: 发送课程介绍',
            info: '3岁 | 重点单 | 口语启蒙 | 未承诺',
        },
    ],
    待继续跟进: [
        {
            name: '张三的家长',
            tags: ['3天待跟进2次', '小红书-活码'],
            color: 'red',
            timeText: '今日22:00跟进',
            timeStatus: 'urgent',
            task: '当前任务: 询问痛点',
            info: '3.5岁 | 重点单 | 价格优惠 | 未承诺',
        },
        {
            name: '王梓轩',
            tags: ['抖音活动'],
            color: 'orange',
            timeText: '2月2日 12:00跟进',
            timeStatus: 'warning',
            task: '当前任务: 询问痛点',
            info: '5岁 | 常规单 | 绘本阅读精修 | 承诺上门',
        },
        {
            name: '李明妈妈',
            tags: ['地推-商场采单'],
            color: 'green',
            timeText: '2月15日 12:00跟进',
            timeStatus: 'success',
            task: '当前任务: 询问痛点',
            info: '4岁 | 常规单 | 口语启蒙进阶 | 承诺上门',
        },
    ],
    待上门试听: [
        {
            name: '萱萱',
            tags: ['小红书-活码', '2月3日试听'],
            color: 'red',
            timeText: '今日22:00跟进',
            timeStatus: 'urgent',
            task: '客户阶段任务: 电话确认一致地址与人数',
            info: '3.5岁 | 重点单 | 价格优惠 | 承诺上门',
        },
        {
            name: '王梓轩',
            tags: ['抖音活动', '2月12日试听'],
            color: 'orange',
            timeText: '2月2日 12:00跟进',
            timeStatus: 'warning',
            task: '客户阶段任务: 电话确认一致地址与人数',
            info: '5岁 | 常规单 | 绘本阅读精修 | 承诺上门',
        },
        {
            name: '李明妈妈',
            tags: ['地推-商场采单', '2月22日试听'],
            color: 'green',
            timeText: '2月15日 12:00跟进',
            timeStatus: 'success',
            task: '客户阶段任务: 电话确认一致地址与人数',
            info: '4岁 | 常规单 | 口语启蒙进阶 | 承诺上门',
        },
    ],
    重点客户: [
        {
            name: '萱萱',
            tags: ['3天待跟进2次', '小红书-活码'],
            color: 'red',
            timeText: '首次：15:00后超时',
            timeStatus: 'urgent',
            task: '客户阶段任务: 电话确认一致地址与人数',
            info: '3.5岁 | 重点单 | 价格优惠 | 承诺上门',
        },
        {
            name: '欧阳春晓',
            tags: ['3天待跟进2次', '线上-抖音表单'],
            color: 'red',
            timeText: '今日22:00跟进',
            timeStatus: 'urgent',
            task: '当前任务: 询问痛点',
            info: '3.5岁 | 重点单 | 价格优惠 | 未承诺',
        },
        {
            name: '陈杰森',
            tags: ['重点单', 'A类客户'],
            color: 'orange',
            timeText: '今日14:00跟进',
            timeStatus: 'warning',
            task: '当前任务: 确认demo邀约信息',
            info: '3岁 | 优惠价格 | 服务策略 | 承诺上门',
        },
    ],
};

// ─── 主页面组件 ───────────────────────────────────────────────────────────────
export default function Workbench() {
    const [activeTab, setActiveTab] = useState<string>('新分配客户');
    const [activeSubFilter, setActiveSubFilter] = useState('全部');
    const [showFilter, setShowFilter] = useState(false);
    const [activeTags, setActiveTags] = useState<string[]>([]);
    const [isCampusDropdownOpen, setIsCampusDropdownOpen] = useState(false);
    const [selectedCampus, setSelectedCampus] = useState('大悦城校区');

    const tabs = ['新分配客户', '待继续跟进', '待上门试听', '重点客户'];
    const subFilters = ['全部', '线上渠道', '线下渠道'];
    const campuses = ['大悦城校区', '广渠门校区'];

    const removeTag = (tag: string) => {
        setActiveTags(activeTags.filter((t) => t !== tag));
    };

    const { customers, loading: customersLoading } = useCustomers(activeTab);

    return (
        <div className="min-h-screen bg-[#F5F6FA] p-4 space-y-5 pb-24 relative overflow-x-hidden">

            {/* ── Header ────────────────────────────────────────── */}
            <div className="flex justify-between items-center pt-2 relative z-50">
                <div className="relative">
                    <button
                        onClick={() => setIsCampusDropdownOpen(!isCampusDropdownOpen)}
                        className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm"
                    >
                        <MapPin size={14} className="text-violet-600" />
                        <span className="text-sm font-medium text-gray-800">{selectedCampus}</span>
                        <ChevronDown size={14} className="text-gray-400" />
                    </button>

                    {/* Dropdown Menu */}
                    {isCampusDropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden py-1">
                            {campuses.map(campus => (
                                <button
                                    key={campus}
                                    onClick={() => {
                                        setSelectedCampus(campus);
                                        setIsCampusDropdownOpen(false);
                                    }}
                                    className={cn(
                                        "w-full text-left px-4 py-2 text-sm transition-colors",
                                        selectedCampus === campus ? "bg-violet-50 text-violet-600 font-medium" : "text-gray-700 hover:bg-gray-50"
                                    )}
                                >
                                    {campus}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <h1 className="text-xl font-bold text-gray-900 absolute left-1/2 -translate-x-1/2">
                    工作台
                </h1>
                <Link to="/messages" className="relative p-2">
                    <Bell className="text-violet-500" size={24} />
                    <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                </Link>
            </div>

            {/* ── Search Bar ────────────────────────────────────── */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="搜索今日待办客户"
                    className="w-full bg-white rounded-2xl py-4 pl-12 pr-4 text-sm shadow-sm focus:outline-none text-gray-600 placeholder-gray-400"
                />
            </div>

            {/* ── Tabs ──────────────────────────────────────────── */}
            <div className="flex items-center justify-between w-full">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            'whitespace-nowrap px-2 py-2 rounded-full text-xs sm:text-sm font-bold transition-all flex-1 text-center',
                            activeTab === tab
                                ? 'bg-violet-600 text-white shadow-lg shadow-violet-200'
                                : 'bg-transparent text-gray-400 hover:text-gray-600',
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* ── Sub Filters + Filter Button ───────────────────── */}
            <div className="flex items-center justify-between">
                <div className="flex space-x-2 overflow-x-auto no-scrollbar">
                    {subFilters.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveSubFilter(filter)}
                            className={cn(
                                'px-4 py-1.5 text-xs rounded-full font-medium transition-colors whitespace-nowrap',
                                activeSubFilter === filter
                                    ? 'bg-violet-100 text-violet-600'
                                    : 'bg-transparent text-gray-500 hover:bg-gray-100',
                            )}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => setShowFilter(true)}
                    className="flex items-center text-xs font-bold text-gray-700 bg-white px-4 py-2 rounded-full shadow-sm whitespace-nowrap ml-2"
                >
                    <Filter size={14} className="mr-1 text-violet-600" /> 筛选
                </button>
            </div>

            {/* ── Active Filter Tags ────────────────────────────── */}
            {activeTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {activeTags.map((tag, i) => (
                        <div
                            key={i}
                            className="flex items-center bg-gray-200 text-gray-500 text-[10px] px-2 py-1 rounded-md"
                        >
                            {tag}
                            <button onClick={() => removeTag(tag)}>
                                <X size={10} className="ml-1 text-gray-400" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Customer Cards ────────────────────────────────── */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4 pb-4"
                >
                    {customersLoading && (
                        <div className="text-center py-10 text-gray-400 text-sm animate-pulse">加载中...</div>
                    )}
                    {!customersLoading && customers.length === 0 && (
                        <div className="text-center py-10 text-gray-400 text-sm">暂无客户数据</div>
                    )}
                    {!customersLoading && customers.map((customer, index) => {
                        const { id, ...rest } = customer as any;
                        const cardTags = [];
                        if (rest.source_channel) cardTags.push(rest.source_channel);
                        if (rest.custom_tags && Array.isArray(rest.custom_tags)) cardTags.push(...rest.custom_tags);

                        return (
                            <div key={id || `customer-${index}`}>
                                <CustomerCard
                                    id={id}
                                    name={rest.name}
                                    tags={cardTags}
                                    color={rest.color || 'red'}
                                    timeText={rest.time_text || ''}
                                    timeStatus={rest.time_status || 'urgent'}
                                    task={rest.customer_stage ? `当前任务: ${rest.customer_stage}` : '当前任务: 跟进'}
                                    info={[rest.product_line, rest.is_key_deal ? '重点单' : '常规单', rest.customer_level ? `${rest.customer_level}类客户` : '', rest.customer_stage].filter(Boolean).join(' | ')}
                                    first_response_deadline_at={rest.first_response_deadline_at}
                                    follow_up_period_days={rest.follow_up_period_days}
                                    min_follow_ups_required={rest.min_follow_ups_required}
                                />
                            </div>
                        );
                    })}
                </motion.div>
            </AnimatePresence>

            {/* ── Filter Modal ──────────────────────────────────── */}
            <AnimatePresence>
                {showFilter && <FilterModal onClose={() => setShowFilter(false)} />}
            </AnimatePresence>
        </div>
    );
}

// ─── 客户卡片 ─────────────────────────────────────────────────────────────────
function CustomerCard({ id, name, tags, color, timeText, timeStatus, task, info, first_response_deadline_at, follow_up_period_days, min_follow_ups_required }: CustomerData) {
    const navigate = useNavigate();

    /* 倒计时逻辑 */
    const [timeLeft, setTimeLeft] = useState<string>('');
    const [isTimeout, setIsTimeout] = useState(false);

    useEffect(() => {
        if (timeText) {
            setTimeLeft(timeText);
            setIsTimeout(false);
            return;
        }

        if (!first_response_deadline_at) {
            setTimeLeft('今天跟进');
            setIsTimeout(false);
            return;
        }

        const tick = () => {
            const now = new Date().getTime();
            const deadline = new Date(first_response_deadline_at).getTime();
            const diff = deadline - now;

            if (diff <= 0) {
                setTimeLeft('已超时');
                setIsTimeout(true);
            } else {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const secs = Math.floor((diff % (1000 * 60)) / 1000);

                if (hours > 0) {
                    setTimeLeft(`首次: ${hours}h ${mins < 10 ? '0' : ''}${mins}m后超时`);
                } else {
                    setTimeLeft(`首次: ${mins}:${secs < 10 ? '0' : ''}${secs}后超时`);
                }
                setIsTimeout(false);
            }
        };

        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [first_response_deadline_at, timeText]);

    /* 生成智能标签列表 */
    const computedTags: { text: string; isUrgentBadge: boolean }[] = [];
    if (follow_up_period_days && min_follow_ups_required) {
        computedTags.push({ text: `${follow_up_period_days}天待跟进${min_follow_ups_required}次`, isUrgentBadge: true });
    }
    tags.forEach(t => computedTags.push({ text: t, isUrgentBadge: false }));

    /* 左边框颜色 */
    const borderClass = {
        red: 'border-l-[6px] border-red-400',
        orange: 'border-l-[6px] border-orange-400',
        green: 'border-l-[6px] border-emerald-400',
    }[color];

    /* 时钟颜色 */
    const activeTimeStatus = isTimeout ? 'urgent' : timeStatus;
    const clockFill = {
        urgent: '#FCA5A5',
        warning: '#FDBA74',
        success: '#6EE7B7',
    }[activeTimeStatus];

    const timeColorClass = {
        urgent: 'text-red-500',
        warning: 'text-orange-500',
        success: 'text-emerald-500',
    }[activeTimeStatus];

    return (
        <Link
            to={`/customers/${id || 1}`}
            className={`block bg-white rounded-3xl p-5 shadow-sm relative overflow-hidden ${borderClass}`}
        >
            {/* 顶部: 姓名 + 标签 + 时钟 */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center flex-nowrap gap-2 min-w-0 overflow-hidden">
                    <h3 className="font-bold text-lg text-gray-900 whitespace-nowrap shrink-0">{name}</h3>
                    {computedTags.map((tag, i) => (
                        <span
                            key={i}
                            className={cn(
                                'text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap shrink-0',
                                tag.isUrgentBadge
                                    ? 'bg-red-500 text-white'
                                    : tag.text.includes('小红书')
                                        ? 'bg-red-100 text-red-600'
                                        : tag.text.includes('抖音')
                                            ? 'bg-violet-100 text-violet-600'
                                            : tag.text.includes('演示') || tag.text.includes('试听')
                                                ? 'bg-purple-100 text-purple-600'
                                                : tag.text.includes('线下') || tag.text.includes('地推')
                                                    ? 'bg-blue-100 text-blue-600'
                                                    : 'bg-gray-100 text-gray-600',
                            )}
                        >
                            {tag.text}
                        </span>
                    ))}
                </div>

                {/* 时钟图标 + 提示文字 */}
                <div className={cn('flex items-center text-xs font-medium shrink-0 ml-2', timeColorClass)}>
                    <ClockIcon fill={clockFill} className="mr-1" />
                    {timeLeft}
                </div>
            </div>

            {/* 任务描述 */}
            <div className="bg-orange-50 rounded-lg px-3 py-2 mb-4 inline-block w-full">
                <span className="text-xs text-orange-500 font-bold">
                    <span className="text-orange-400 mr-1">
                        {task.startsWith('客户阶段任务') ? '客户阶段任务:' : '当前任务:'}
                    </span>
                    {task.replace('当前任务: ', '').replace('客户阶段任务: ', '')}
                </span>
            </div>

            {/* 底部: 信息标签 + 操作按钮 */}
            <div className="flex justify-between items-end">
                <div className="flex flex-wrap gap-2">
                    {info.split('|').map((item, i) => (
                        <span
                            key={i}
                            className={cn(
                                'text-xs px-2 py-1 rounded-md font-medium',
                                item.trim() === '重点单' ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-500',
                            )}
                        >
                            {item.trim()}
                        </span>
                    ))}
                </div>
                <div className="flex space-x-3 shrink-0 ml-2">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigate('/customers/1/add-note', { state: { isCall: true } });
                        }}
                        className="w-9 h-9 rounded-full bg-violet-50 flex items-center justify-center text-violet-600 hover:bg-violet-100 transition-colors"
                    >
                        <Phone size={18} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        className="w-9 h-9 rounded-full bg-violet-50 flex items-center justify-center text-violet-600 hover:bg-violet-100 transition-colors"
                    >
                        <MessageSquare size={18} />
                    </button>
                </div>
            </div>
        </Link>
    );
}

// ─── 时钟图标 SVG ─────────────────────────────────────────────────────────────
function ClockIcon({ fill = '#FCA5A5', className }: { fill?: string; className?: string }) {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={className}>
            <circle cx="7" cy="7" r="6" fill={fill} />
            <path
                d="M7 3.5V7L9 9"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

// ─── 筛选弹窗 ─────────────────────────────────────────────────────────────────
function FilterModal({ onClose }: { onClose: () => void }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [channel, setChannel] = useState('线上渠道-抖音-阅读大冒险活动');
    const [age, setAge] = useState('1');
    const [customerStatus, setCustomerStatus] = useState('');
    const [customerLevel, setCustomerLevel] = useState('');
    const [isKeyDeal, setIsKeyDeal] = useState('');
    const [collectionTime, setCollectionTime] = useState('');

    const handleReset = () => {
        setChannel('线上渠道-抖音-阅读大冒险活动');
        setAge('1');
        setCustomerStatus('');
        setCustomerLevel('');
        setIsKeyDeal('');
        setCollectionTime('');
    };

    return (
        <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40 flex flex-col justify-end items-center">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0, height: isExpanded ? '92vh' : 'calc(100vh - 120px)' }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, { offset }) => {
                    if (offset.y < -50) setIsExpanded(true);
                    else if (offset.y > 50) {
                        if (isExpanded) setIsExpanded(false);
                        else onClose();
                    }
                }}
                className="bg-white rounded-t-[2rem] w-full max-w-md relative flex flex-col shadow-2xl overflow-hidden"
            >
                {/* 拖拽把手 */}
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-3 mb-2 flex-shrink-0" />

                {/* 标题栏 */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 flex-shrink-0">
                    <h2 className="text-xl font-bold text-gray-900">更多筛选</h2>
                    <button onClick={onClose} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* 内容区 */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">
                    <FilterSection title="渠道">
                        <select
                            value={channel}
                            onChange={(e) => setChannel(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none appearance-none"
                        >
                            <option>线上渠道-抖音-阅读大冒险活动</option>
                            <option>线下渠道</option>
                        </select>
                    </FilterSection>

                    <FilterSection title="年龄筛选">
                        <select
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none appearance-none"
                        >
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                        </select>
                    </FilterSection>

                    <FilterSection title="客户状态">
                        <div className="flex flex-wrap gap-3">
                            {['已上门未缴费', '承诺上门', '承诺未上门', '未承诺', '已上门全款', '已上门订金', '无效', '退费'].map(
                                (status) => (
                                    <FilterChip
                                        key={status}
                                        active={customerStatus === status}
                                        onClick={() => setCustomerStatus(status === customerStatus ? '' : status)}
                                    >
                                        {status}
                                    </FilterChip>
                                ),
                            )}
                        </div>
                    </FilterSection>

                    <FilterSection title="客户等级">
                        <div className="flex gap-4">
                            {['A', 'B', 'C', 'D'].map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setCustomerLevel(level === customerLevel ? '' : level)}
                                    className={cn(
                                        'w-12 h-12 rounded-full border flex items-center justify-center font-bold text-lg transition-colors',
                                        customerLevel === level
                                            ? 'border-violet-500 bg-violet-50 text-violet-600'
                                            : 'border-gray-200 text-gray-500',
                                    )}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </FilterSection>

                    <FilterSection title="是否重点单">
                        <div className="flex gap-4">
                            {['是', '否'].map((opt) => (
                                <FilterChip
                                    key={opt}
                                    active={isKeyDeal === opt}
                                    onClick={() => setIsKeyDeal(opt === isKeyDeal ? '' : opt)}
                                >
                                    {opt}
                                </FilterChip>
                            ))}
                        </div>
                    </FilterSection>

                    <FilterSection title="采单时间">
                        <div className="flex gap-3">
                            {['今日', '最近3天', '最近7天', '自定义'].map((time) => (
                                <FilterChip
                                    key={time}
                                    active={collectionTime === time}
                                    onClick={() => setCollectionTime(time === collectionTime ? '' : time)}
                                >
                                    {time}
                                </FilterChip>
                            ))}
                        </div>
                    </FilterSection>
                </div>

                {/* 底部按钮 */}
                <div className="p-6 border-t border-gray-100 flex gap-4 bg-white pb-8 pt-4 flex-shrink-0">
                    <button
                        className="flex-1 py-3.5 rounded-xl border border-violet-200 text-violet-600 font-bold"
                        onClick={handleReset}
                    >
                        重置
                    </button>
                    <button
                        className="flex-1 py-3.5 rounded-xl bg-violet-600 text-white font-bold shadow-lg shadow-violet-200"
                        onClick={onClose}
                    >
                        确定
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <div className="flex items-center mb-4 border-l-4 border-violet-600 pl-3">
                <h3 className="font-bold text-gray-700 text-base">{title}</h3>
            </div>
            {children}
        </div>
    );
}

function FilterChip({
    children,
    active,
    onClick,
}: {
    children: React.ReactNode;
    active: boolean;
    onClick: () => void;
    key?: string;
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                'px-4 py-2.5 rounded-xl text-xs font-medium transition-colors border',
                active
                    ? 'bg-violet-50 text-violet-600 border-violet-500'
                    : 'bg-white text-gray-500 border-gray-200',
            )}
        >
            {children}
        </button>
    );
}
