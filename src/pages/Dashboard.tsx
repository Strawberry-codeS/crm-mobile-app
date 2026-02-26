import { Bell, Calendar as CalendarIcon, Phone, MessageSquare, Search, Filter, Menu, X, ChevronLeft, ChevronRight, ChevronDown, Info, Calendar, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useCustomers } from '@/hooks/useCustomers';
import type { Customer as CustomerData } from '@/lib/supabase';

// ─── Supabase 数据映射辅助函数 ────────────────────────────────────────────────
function buildTags(c: CustomerData): string[] {
  const tags: string[] = [];
  if (c.source_channel) tags.push(c.source_channel);
  if (c.custom_tags && Array.isArray(c.custom_tags)) tags.push(...c.custom_tags);
  return tags.filter(Boolean);
}

function buildInfo(c: CustomerData): string {
  const parts: string[] = [];
  if (c.product_line) parts.push(c.product_line);
  parts.push(c.is_key_deal ? '重点单' : '常规单');
  if (c.customer_level) parts.push(`${c.customer_level}类客户`);
  if (c.customer_stage) parts.push(c.customer_stage);
  return parts.join(' | ');
}

// placeholder to keep tabCustomers reference alive for legacy code (will not be used)
const tabCustomers: Record<string, unknown[]> = {
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
  ],
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('新分配客户');
  const [activeSubFilter, setActiveSubFilter] = useState('全部');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [progressPage, setProgressPage] = useState(0);
  const [isCampusDropdownOpen, setIsCampusDropdownOpen] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState('大悦城校区');

  const campuses = ['大悦城校区', '广渠门校区'];
  const { customers, loading: customersLoading } = useCustomers(activeTab);

  const tabs = [
    '新分配客户',
    '待继续跟进',
    '待上门试听',
    '重点客户'
  ];

  const subFilters = [
    '全部',
    '线上渠道',
    '线下渠道'
  ];

  const tags: string[] = [];

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      if (progressPage === 0) setProgressPage(1);
    } else if (swipe > swipeConfidenceThreshold) {
      if (progressPage === 1) setProgressPage(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA] p-4 space-y-6 pb-24 relative overflow-x-hidden">
      {/* Header */}
      <div className="flex justify-between items-center pt-2 relative">
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
            <div className="absolute top-full left-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden py-1 z-[60]">
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
        <h1 className="text-xl font-bold text-gray-900 absolute left-1/2 -translate-x-1/2">工作台</h1>
        <Link to="/messages" className="relative p-2">
          <Bell className="text-violet-500" size={24} />
          <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="搜索今日待办客户"
          className="w-full bg-white rounded-2xl py-4 pl-12 pr-4 text-sm shadow-sm focus:outline-none text-gray-600 placeholder-gray-400"
        />
      </div>

      {/* Execution Progress */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <h2 className="font-bold text-xl text-gray-900">执行进度</h2>
          <button
            onClick={() => setShowCalendar(true)}
            className="bg-violet-100 p-1 rounded text-violet-600"
          >
            <CalendarIcon size={16} />
          </button>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm overflow-hidden relative min-h-[300px]">
          <AnimatePresence initial={false} mode="wait">
            {progressPage === 0 ? (
              <motion.div
                key="page1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                className="space-y-8 cursor-grab active:cursor-grabbing"
              >
                {/* Progress Item 1 */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-gray-600 text-sm font-medium">新分配跟进人数</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-violet-600 font-bold text-2xl">45</span>
                      <span className="text-gray-400 text-xs">/ 80人</span>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-50 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-500 w-[56%] rounded-full"></div>
                  </div>
                </div>

                {/* Progress Item 2 */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-gray-600 text-sm font-medium">待继续跟进人数</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-emerald-500 font-bold text-2xl">28</span>
                      <span className="text-gray-400 text-xs">/ 35人</span>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-50 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[80%] rounded-full"></div>
                  </div>
                </div>

                {/* Progress Item 3 */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 text-sm font-medium">超时人数</span>
                      <span className="text-[10px] bg-red-50 text-red-500 px-1.5 py-0.5 rounded font-medium">超时警告</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-red-500 font-bold text-2xl">120</span>
                      <span className="text-gray-400 text-xs">/ 0人</span>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-50 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 w-full rounded-full"></div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="page2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                className="space-y-6 cursor-grab active:cursor-grabbing"
              >
                {/* Recruitment Count */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-gray-600 text-sm font-medium">招生人数</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-gray-400 text-xs">本月</span>
                      <span className="text-gray-900 font-bold text-xl">18</span>
                      <span className="text-gray-400 text-xs">/ 20人</span>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-50 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-500 w-[90%] rounded-full"></div>
                  </div>
                </div>

                {/* Class Entry Count */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-gray-600 text-sm font-medium">进班人数</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-gray-400 text-xs">本月</span>
                      <span className="text-gray-900 font-bold text-xl">15</span>
                      <span className="text-gray-400 text-xs">/ 25人</span>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-50 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[60%] rounded-full"></div>
                  </div>
                </div>

                {/* Cash */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-gray-600 text-sm font-medium">现金 (元)</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-gray-400 text-xs">本月</span>
                      <span className="text-emerald-500 font-bold text-xl">42,800</span>
                      <span className="text-gray-400 text-xs">/ 60,000</span>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-50 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[71%] rounded-full"></div>
                  </div>
                </div>

                {/* Refund Count */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-600 text-sm font-medium">退费人数</span>
                      <Info size={12} className="text-gray-400" />
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-gray-400 text-xs">本月</span>
                      <span className="text-red-500 font-bold text-xl">4</span>
                      <span className="text-gray-400 text-xs">/ 5人限额</span>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-50 rounded-full overflow-hidden mb-1">
                    <div className="h-full bg-red-500 w-[80%] rounded-full"></div>
                  </div>
                  <div className="text-right text-[10px] text-red-400">
                    即将达到本月风控线
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setProgressPage(0)}
          className={cn(
            "w-2 h-2 rounded-full transition-colors",
            progressPage === 0 ? "bg-violet-500" : "bg-violet-200"
          )}
        />
        <button
          onClick={() => setProgressPage(1)}
          className={cn(
            "w-2 h-2 rounded-full transition-colors",
            progressPage === 1 ? "bg-violet-500" : "bg-violet-200"
          )}
        />
      </div>

      {/* Task List Section */}
      <div>
        {/* Main Tabs */}
        <div className="flex items-center justify-between pb-4 w-full">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "whitespace-nowrap px-2 py-2 rounded-full text-xs sm:text-sm font-bold transition-all flex-1 text-center",
                activeTab === tab
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-200"
                  : "bg-transparent text-gray-400 hover:text-gray-600"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Sub Filters */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex space-x-2 overflow-x-auto no-scrollbar">
            {subFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveSubFilter(filter)}
                className={cn(
                  "px-4 py-1.5 text-xs rounded-full font-medium transition-colors",
                  activeSubFilter === filter
                    ? "bg-violet-100 text-violet-600"
                    : "bg-transparent text-gray-500 hover:bg-gray-100"
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

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, i) => (
            <div key={i} className="flex items-center bg-gray-200 text-gray-500 text-[10px] px-2 py-1 rounded-md">
              {tag}
              <X size={10} className="ml-1 text-gray-400" />
            </div>
          ))}
        </div>
      </div>

      {/* Task Cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="space-y-4 pb-4"
        >
          {customersLoading && (
            <div className="text-center py-10 text-gray-400 text-sm animate-pulse">加载中...</div>
          )}
          {!customersLoading && customers.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm">暂无客户数据</div>
          )}
          {!customersLoading && customers.map((c) => (
            <TaskCard
              key={c.id}
              id={c.id}
              name={c.name}
              tags={buildTags(c)}
              color={(c.color as 'red' | 'orange' | 'green') ?? 'red'}
              timeText={c.time_text ?? ''}
              timeStatus={(c.time_status as 'urgent' | 'warning' | 'success') ?? 'urgent'}
              task={c.customer_stage ? `当前任务: ${c.customer_stage}` : '当前任务: 跟进'}
              info={buildInfo(c)}
              first_response_deadline_at={c.first_response_deadline_at}
              follow_up_period_days={c.follow_up_period_days}
              min_follow_ups_required={c.min_follow_ups_required}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Calendar Popup */}
      <AnimatePresence>
        {showCalendar && (
          <CalendarPopup onClose={() => setShowCalendar(false)} onFilterClick={() => setShowFilter(true)} />
        )}
      </AnimatePresence>

      {/* Filter Modal */}
      <AnimatePresence>
        {showFilter && (
          <FilterModal onClose={() => setShowFilter(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function CalendarPopup({ onClose, onFilterClick }: { onClose: () => void, onFilterClick: () => void }) {
  const days = ['日', '一', '二', '三', '四', '五', '六'];
  const dates = [
    { day: 22, active: false },
    { day: 23, active: false },
    { day: 24, active: true, hasDot: true },
    { day: 25, active: false, hasDot: true },
    { day: 26, active: false },
    { day: 27, active: false },
    { day: 28, active: false },
  ];
  const [isExpanded, setIsExpanded] = useState(false);

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
        initial={{ y: "100%" }}
        animate={{ y: 0, height: isExpanded ? '92vh' : 'calc(100vh - 120px)' }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={(_, { offset, velocity }) => {
          if (offset.y < -50) setIsExpanded(true);
          else if (offset.y > 50) {
            if (isExpanded) setIsExpanded(false);
            else onClose();
          }
        }}
        className="bg-[#F5F6FA] rounded-t-[2rem] w-full max-w-md relative flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Drag Handle */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 mb-4 flex-shrink-0" />

        {/* Calendar Header */}
        <div className="px-6 mb-4 flex-shrink-0">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-baseline space-x-3">
              <span className="text-2xl font-bold text-gray-900">2023年10月</span>
              <span className="text-xs text-violet-500">同步至系统日历</span>
            </div>
            <div className="flex space-x-6 text-violet-400">
              <ChevronLeft size={24} />
              <ChevronRight size={24} />
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center mb-2">
            {days.map((d, i) => (
              <div key={i} className="text-sm text-gray-400 mb-2">{d}</div>
            ))}
            {dates.map((d, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className={cn(
                  "w-10 h-10 flex items-center justify-center rounded-full text-lg font-medium mb-1",
                  d.active ? "bg-violet-600 text-white shadow-lg shadow-violet-300" : "text-gray-400"
                )}>
                  {d.day}
                </div>
                {d.hasDot && <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1"></div>}
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-2">
            <ChevronDown className="text-violet-200" />
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-t-[2.5rem] p-6 flex-1 overflow-y-auto pb-24">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">10月4日 待跟进 (12)</h2>
            <button
              onClick={onFilterClick}
              className="flex items-center text-xs text-violet-600 bg-violet-50 px-4 py-2 rounded-full font-bold"
            >
              <Filter size={14} className="mr-1" /> 筛选
            </button>
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
            {['抖音-社群活动', '美团-社群活动', '大众点评-社群活动'].map((tag, i) => (
              <div key={i} className="flex items-center bg-gray-100 text-gray-500 text-[10px] px-3 py-1.5 rounded-full whitespace-nowrap">
                {tag}
                <X size={10} className="ml-1 text-gray-400" />
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <TaskCard
              name="张三的家长"
              tags={['待跟进', '小红书活动']}
              task="客户阶段任务: 电话确认一致地址与人数"
              info="3.5岁 | 重点单 | 价格优惠"
              timeText="05:12 后超时"
              timeStatus="urgent"
              color="red"
            />
            <TaskCard
              name="王梓轩"
              tags={['待跟进', '小红书活动']}
              task="客户阶段任务: 电话确认一致地址与人数"
              info="5岁 | 常规单 | 绘本阅读精修"
              timeText="22:45 后超时"
              timeStatus="warning"
              color="orange"
            />
            <TaskCard
              name="李明妈妈"
              tags={['地推-商场采单']}
              task="当前任务: 询问痛点"
              info="4岁 | 常规单 | 口语启蒙进阶 | 承诺上门"
              timeText="2月15日 12:00跟进"
              timeStatus="success"
              color="green"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function FilterModal({ onClose }: { onClose: () => void }) {
  const [channel, setChannel] = useState('线上渠道-抖音-阅读大冒险活动');
  const [age, setAge] = useState('1');
  const [childCount, setChildCount] = useState('1');
  const [grade, setGrade] = useState('一年级');
  const [dealCount, setDealCount] = useState('0');
  const [customerStatus, setCustomerStatus] = useState('');
  const [customerLevel, setCustomerLevel] = useState('');
  const [isKeyDeal, setIsKeyDeal] = useState('');
  const [dispatchMethod, setDispatchMethod] = useState('');
  const [focusDimensions, setFocusDimensions] = useState<string[]>([]);
  const [collectionTime, setCollectionTime] = useState('');
  const [allocationTime, setAllocationTime] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleMultiSelect = (state: string[], setState: (val: string[]) => void, value: string) => {
    if (state.includes(value)) {
      setState(state.filter(item => item !== value));
    } else {
      setState([...state, value]);
    }
  };

  const handleReset = () => {
    setChannel('线上渠道-抖音-阅读大冒险活动');
    setAge('1');
    setChildCount('1');
    setGrade('一年级');
    setDealCount('0');
    setCustomerStatus('');
    setCustomerLevel('');
    setIsKeyDeal('');
    setDispatchMethod('');
    setFocusDimensions([]);
    setCollectionTime('');
    setAllocationTime('');
  };

  const handleConfirm = () => {
    console.log('Filters applied:', {
      channel, age, childCount, grade, dealCount,
      customerStatus, customerLevel, isKeyDeal,
      dispatchMethod, focusDimensions, collectionTime, allocationTime
    });
    onClose();
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
        initial={{ y: "100%" }}
        animate={{ y: 0, height: isExpanded ? '92vh' : 'calc(100vh - 120px)' }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={(_, { offset, velocity }) => {
          if (offset.y < -50) setIsExpanded(true);
          else if (offset.y > 50) {
            if (isExpanded) setIsExpanded(false);
            else onClose();
          }
        }}
        className="bg-white rounded-t-[2rem] w-full max-w-md relative flex flex-col shadow-2xl overflow-hidden"
      >
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-3 mb-2 flex-shrink-0" />

        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900">更多筛选</h2>
          <button onClick={onClose} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

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

          <FilterSection title="孩子数量">
            <select
              value={childCount}
              onChange={(e) => setChildCount(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none appearance-none"
            >
              <option>1</option>
              <option>2</option>
              <option>3</option>
            </select>
          </FilterSection>

          <FilterSection title="在读年级">
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none appearance-none"
            >
              <option>一年级</option>
              <option>二年级</option>
              <option>三年级</option>
            </select>
          </FilterSection>

          <FilterSection title="客户状态">
            <div className="flex flex-wrap gap-3">
              {['已上门未缴费', '承诺上门', '承诺未上门', '未承诺', '已上门全款', '已上门订金', '无效', '退费', '禁拨'].map(status => (
                <FilterChip
                  key={status}
                  active={customerStatus === status}
                  onClick={() => setCustomerStatus(status === customerStatus ? '' : status)}
                >
                  {status}
                </FilterChip>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="待继续跟进量">
            <select
              value={dealCount}
              onChange={(e) => setDealCount(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none appearance-none"
            >
              <option>0</option>
              <option>1</option>
              <option>2</option>
            </select>
          </FilterSection>

          <FilterSection title="客户等级">
            <div className="flex gap-4">
              {['A', 'B', 'C', 'D'].map(level => (
                <button
                  key={level}
                  onClick={() => setCustomerLevel(level === customerLevel ? '' : level)}
                  className={cn(
                    "w-12 h-12 rounded-full border flex items-center justify-center font-bold text-lg transition-colors",
                    customerLevel === level
                      ? "border-violet-500 bg-violet-50 text-violet-600"
                      : "border-gray-200 text-gray-500"
                  )}
                >
                  {level}
                </button>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="是否重点单">
            <div className="flex gap-4">
              {['是', '否'].map(opt => (
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

          <FilterSection title="下发方式">
            <div className="flex gap-3">
              {['拉访', '侧边栏', 'Walk-in'].map(method => (
                <FilterChip
                  key={method}
                  active={dispatchMethod === method}
                  onClick={() => setDispatchMethod(method === dispatchMethod ? '' : method)}
                >
                  {method}
                </FilterChip>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="关注维度">
            <div className="flex flex-wrap gap-3">
              {['服务质量', '接送距离', '优惠力度', '竞品对比', '课程内容', '师资力量', '品牌信任'].map(dim => (
                <FilterChip
                  key={dim}
                  active={focusDimensions.includes(dim)}
                  onClick={() => toggleMultiSelect(focusDimensions, setFocusDimensions, dim)}
                >
                  {dim}
                </FilterChip>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="采单时间">
            <div className="flex gap-3 mb-4">
              {['今日', '最近3天', '最近7天', '自定义'].map(time => (
                <FilterChip
                  key={time}
                  active={collectionTime === time}
                  onClick={() => setCollectionTime(time === collectionTime ? '' : time)}
                >
                  {time}
                </FilterChip>
              ))}
            </div>
            <div className="flex items-center bg-gray-50 rounded-xl p-4 text-sm">
              <div className="flex-1 text-center">
                <div className="text-xs text-gray-400 mb-1">起始</div>
                <div className="font-bold text-gray-900">2023-11-10</div>
              </div>
              <div className="w-8 h-px bg-gray-300 mx-4"></div>
              <div className="flex-1 text-center">
                <div className="text-xs text-gray-400 mb-1">截止</div>
                <div className="font-bold text-gray-900">2023-11-17</div>
              </div>
              <Calendar className="ml-4 text-violet-500" size={20} />
            </div>
          </FilterSection>

          <FilterSection title="分配时间">
            <div className="flex gap-3 mb-4">
              {['今日', '最近3天', '最近7天', '自定义'].map(time => (
                <FilterChip
                  key={time}
                  active={allocationTime === time}
                  onClick={() => setAllocationTime(time === allocationTime ? '' : time)}
                >
                  {time}
                </FilterChip>
              ))}
            </div>
            <div className="flex items-center bg-gray-50 rounded-xl p-4 text-sm">
              <div className="flex-1 text-center">
                <div className="text-xs text-gray-400 mb-1">起始</div>
                <div className="font-bold text-gray-900">2023-11-10</div>
              </div>
              <div className="w-8 h-px bg-gray-300 mx-4"></div>
              <div className="flex-1 text-center">
                <div className="text-xs text-gray-400 mb-1">截止</div>
                <div className="font-bold text-gray-900">2023-11-17</div>
              </div>
              <Calendar className="ml-4 text-violet-500" size={20} />
            </div>
          </FilterSection>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex gap-4 bg-white pb-24 pt-4">
          <button className="flex-1 py-3.5 rounded-xl border border-violet-200 text-violet-600 font-bold" onClick={handleReset}>重置</button>
          <button className="flex-1 py-3.5 rounded-xl bg-violet-600 text-white font-bold shadow-lg shadow-violet-200" onClick={handleConfirm}>确定</button>
        </div>
      </motion.div>
    </div>
  );
}

function FilterSection({ title, children }: any) {
  return (
    <div>
      <div className="flex items-center mb-4 border-l-4 border-violet-600 pl-3">
        <h3 className="font-bold text-gray-700 text-base">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function FilterChip({ children, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2.5 rounded-xl text-xs font-medium transition-colors border",
        active
          ? "bg-violet-50 text-violet-600 border-violet-500"
          : "bg-white text-gray-500 border-gray-200"
      )}
    >
      {children}
    </button>
  );
}

// ─ 色值映射 ─────────────────────────────────────────────────────────────────
const borderMap = { red: 'border-l-[6px] border-red-400', orange: 'border-l-[6px] border-orange-400', green: 'border-l-[6px] border-emerald-400' };
const clockFillMap = { urgent: '#FCA5A5', warning: '#FDBA74', success: '#6EE7B7' };
const timeColorMap = { urgent: 'text-red-500', warning: 'text-orange-500', success: 'text-emerald-500' };

function TaskCard({ id, name, tags, color = 'red', timeText, timeStatus = 'urgent', task, info, first_response_deadline_at, follow_up_period_days, min_follow_ups_required }: any) {
  const navigate = useNavigate();

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
  (tags as string[]).forEach(t => computedTags.push({ text: t, isUrgentBadge: false }));

  const borderClass = borderMap[color as keyof typeof borderMap] ?? borderMap.red;

  const activeTimeStatus = isTimeout ? 'urgent' : timeStatus;
  const clockFill = clockFillMap[activeTimeStatus as keyof typeof clockFillMap] ?? clockFillMap.urgent;
  const timeColorClass = timeColorMap[activeTimeStatus as keyof typeof timeColorMap] ?? timeColorMap.urgent;

  return (
    <Link to={`/customers/${id}`} className={`block bg-white rounded-3xl p-5 shadow-sm relative overflow-hidden ${borderClass}`}>
      {/* 顶部：姓名 + 色标标签 + 时钟 */}
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
                  : tag.text.includes('小红书') ? 'bg-red-100 text-red-600'
                    : tag.text.includes('抖音') ? 'bg-violet-100 text-violet-600'
                      : tag.text.includes('试听') ? 'bg-purple-100 text-purple-600'
                        : tag.text.includes('线下') || tag.text.includes('地推') ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-600'
              )}
            >
              {tag.text}
            </span>
          ))}
        </div>
        {/* 时钟图标 + 超时提示文字 */}
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

      {/* 底部：信息标签 + 操作按钮 */}
      <div className="flex justify-between items-end">
        <div className="flex flex-wrap gap-2">
          {(info as string).split('|').map((item, i) => (
            <span
              key={i}
              className={cn(
                'text-xs px-2 py-1 rounded-md font-medium',
                item.trim() === '重点单' ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-500'
              )}
            >
              {item.trim()}
            </span>
          ))}
        </div>
        <div className="flex space-x-3 shrink-0 ml-2">
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate('/customers/1/add-note', { state: { isCall: true } }); }}
            className="w-9 h-9 rounded-full bg-violet-50 flex items-center justify-center text-violet-600 hover:bg-violet-100 transition-colors"
          >
            <Phone size={18} />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            className="w-9 h-9 rounded-full bg-violet-50 flex items-center justify-center text-violet-600 hover:bg-violet-100 transition-colors"
          >
            <MessageSquare size={18} />
          </button>
        </div>
      </div>
    </Link>
  );
}

function ClockIcon({ fill = '#FCA5A5', className }: { fill?: string; className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={className}>
      <circle cx="7" cy="7" r="6" fill={fill} />
      <path d="M7 3.5V7L9 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={className}>
      <circle cx="7" cy="7" r="6" fill="#10B981" />
      <path d="M4 7L6 9L10 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
