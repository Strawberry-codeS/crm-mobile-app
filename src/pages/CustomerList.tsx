import { Search, Filter, Phone, MessageSquare, ChevronDown, X, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useCustomers } from '@/hooks/useCustomers';
import type { Customer as CustomerData } from '@/lib/supabase';

export default function CustomerList() {
  const [showFilter, setShowFilter] = useState(false);
  const [activeTab, setActiveTab] = useState('全部客户');
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = ['全部客户', '新分配客户', '待继续跟进', '待上门试听', '重点客户'];

  const tabCategory = activeTab === '全部客户' ? undefined : activeTab;
  const { customers, loading, search } = useCustomers(tabCategory);

  const handleSearch = (q: string) => {
    setSearchTerm(q);
    search(q);
  };

  function buildInfo(c: CustomerData): string {
    const parts: string[] = [];
    if (c.product_line) parts.push(c.product_line);
    parts.push(c.is_key_deal ? '重点单' : '常规单');
    if (c.customer_level) parts.push(`${c.customer_level}类客户`);
    if (c.customer_stage) parts.push(c.customer_stage);
    return parts.join(' | ');
  }

  return (
    <div className="p-4 h-full flex flex-col relative">
      {/* Header */}
      <div className="flex justify-between items-center py-2 mb-2">
        <div className="flex items-center space-x-2">
          <ChevronDown className="text-gray-900" />
          <h1 className="text-xl font-bold text-gray-900">客户</h1>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowFilter(true)}
            className="flex items-center text-sm text-violet-600 bg-white px-3 py-1.5 rounded-full shadow-sm"
          >
            <Filter size={14} className="mr-1" /> 筛选
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          value={searchTerm}
          onChange={e => handleSearch(e.target.value)}
          placeholder="搜索客户姓名、手机号"
          className="w-full bg-white rounded-full py-3 pl-10 pr-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-100"
        />
      </div>

      {/* Tabs */}
      <div className="flex space-x-6 mb-4 border-b border-gray-100 px-2 overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "pb-2 font-medium whitespace-nowrap transition-colors relative",
              activeTab === tab ? "text-violet-600 font-bold" : "text-gray-400"
            )}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Secondary Filters removed per user request */}

      {/* List */}
      <div className="flex-1 space-y-3 overflow-y-auto pb-20 no-scrollbar">
        {loading && <div className="text-center py-10 text-gray-400 text-sm animate-pulse">加载中...</div>}
        {!loading && customers.length === 0 && <div className="text-center py-10 text-gray-400 text-sm">暂无客户数据</div>}
        {!loading && customers.map((c) => (
          <CustomerItem
            key={c.id}
            id={c.id}
            name={c.name}
            tags={[c.source_channel].filter(Boolean) as string[]}
            task={c.customer_stage ? `当前任务: ${c.customer_stage}` : '当前任务: 跟进'}
            info={buildInfo(c)}
            time={c.time_text ?? ''}
            color={(c.color as string) ?? 'gray'}
            timeStatus={(c.time_status as string) ?? 'success'}
          />
        ))}
      </div>

      {/* Filter Modal Overlay */}
      {showFilter && (
        <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 flex flex-col justify-end items-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowFilter(false)}></div>
          <div className="bg-white rounded-t-[2rem] p-5 w-full max-w-md max-h-[85vh] overflow-y-auto relative animate-in slide-in-from-bottom duration-300 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">更多筛选</h2>
              <button onClick={() => setShowFilter(false)} className="p-1 bg-gray-100 rounded-full">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-6 pb-24">
              <FilterSection title="渠道">
                <select className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none">
                  <option>线上渠道-抖音-阅读大冒险活动</option>
                  <option>线下渠道</option>
                </select>
              </FilterSection>

              <FilterSection title="年龄筛选">
                <select className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none">
                  <option>1岁</option>
                  <option>2岁</option>
                  <option>3岁</option>
                </select>
              </FilterSection>

              <FilterSection title="客户状态">
                <div className="grid grid-cols-4 gap-2">
                  <FilterChip active>已上门未缴费</FilterChip>
                  <FilterChip>承诺上门</FilterChip>
                  <FilterChip>承诺未上门</FilterChip>
                  <FilterChip>未承诺</FilterChip>
                  <FilterChip>已上门全款</FilterChip>
                  <FilterChip>已上门订金</FilterChip>
                  <FilterChip>无效</FilterChip>
                  <FilterChip>退费</FilterChip>
                </div>
              </FilterSection>

              <FilterSection title="客户等级">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full border border-violet-500 bg-violet-50 text-violet-600 flex items-center justify-center font-bold">A</div>
                  <div className="w-10 h-10 rounded-full border border-gray-200 text-gray-500 flex items-center justify-center">B</div>
                  <div className="w-10 h-10 rounded-full border border-gray-200 text-gray-500 flex items-center justify-center">C</div>
                  <div className="w-10 h-10 rounded-full border border-gray-200 text-gray-500 flex items-center justify-center">D</div>
                </div>
              </FilterSection>

              <FilterSection title="是否重点单">
                <div className="flex gap-3">
                  <FilterChip>是</FilterChip>
                  <FilterChip active>否</FilterChip>
                </div>
              </FilterSection>

              <FilterSection title="采单时间">
                <div className="flex gap-2 mb-3">
                  <FilterChip>今日</FilterChip>
                  <FilterChip>最近3天</FilterChip>
                  <FilterChip active>最近7天</FilterChip>
                  <FilterChip>自定义</FilterChip>
                </div>
                <div className="flex items-center bg-gray-50 rounded-xl p-3 text-sm">
                  <div className="flex-1 text-center">
                    <div className="text-xs text-gray-400">起始</div>
                    <div className="font-bold">2023-11-10</div>
                  </div>
                  <div className="w-4 h-px bg-gray-300 mx-2"></div>
                  <div className="flex-1 text-center">
                    <div className="text-xs text-gray-400">截止</div>
                    <div className="font-bold">2023-11-17</div>
                  </div>
                  <Calendar className="ml-2 text-violet-500" size={20} />
                </div>
              </FilterSection>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex gap-4 z-10 rounded-b-3xl">
              <button className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold" onClick={() => setShowFilter(false)}>重置</button>
              <button className="flex-1 py-3 rounded-xl bg-violet-600 text-white font-bold shadow-lg shadow-violet-200" onClick={() => setShowFilter(false)}>确定</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterSection({ title, children }: any) {
  return (
    <div>
      <div className="flex items-center mb-3 border-l-4 border-violet-600 pl-2">
        <h3 className="font-bold text-gray-700">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function FilterChip({ children, active }: any) {
  return (
    <button className={cn(
      "px-3 py-2 rounded-lg text-xs font-medium transition-colors border w-full truncate",
      active
        ? "bg-violet-50 text-violet-600 border-violet-200"
        : "bg-white text-gray-500 border-gray-200"
    )}>
      {children}
    </button>
  );
}

function CustomerItem({ id, name, tags, task, info, time, urgent, status, color = "red", timeStatus = "urgent" }: any) {
  const navigate = useNavigate();
  const isDone = status === 'done';

  let borderClass = "border-l-[6px] border-red-400";
  if (color === 'orange') borderClass = "border-l-[6px] border-orange-400";
  if (color === 'green') borderClass = "border-l-[6px] border-emerald-400";
  if (color === 'violet') borderClass = "border-l-[6px] border-violet-400";

  let timeColorClass = "text-red-500";
  if (timeStatus === 'warning') timeColorClass = "text-orange-500";
  if (timeStatus === 'success') timeColorClass = "text-emerald-500";

  return (
    <Link to={`/customers/${id}`} className={`block bg-white rounded-3xl p-5 shadow-sm relative overflow-hidden ${borderClass}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center flex-nowrap gap-2 min-w-0 overflow-hidden">
          <h3 className="font-bold text-lg text-gray-900 whitespace-nowrap shrink-0">{name}</h3>
          {tags.map((tag: string, i: number) => (
            <span key={i} className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 ${i === 0 ? 'bg-red-500 text-white' :
              tag.includes('小红书') ? 'bg-red-100 text-red-600' :
                tag.includes('抖音') || tag.includes('抖线上音') ? 'bg-violet-100 text-violet-600' :
                  tag.includes('试听') ? 'bg-purple-100 text-purple-600' :
                    tag.includes('线下') || tag.includes('地推') ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-600'
              }`}>
              {tag}
            </span>
          ))}
        </div>
        <div className={`flex items-center text-xs font-medium ${timeColorClass}`}>
          {timeStatus === 'urgent' && <ClockIcon className="mr-1" />}
          {timeStatus === 'warning' && <ClockIcon className="mr-1 text-orange-500" fill="#FDBA74" />}
          {timeStatus === 'success' && <ClockIcon className="mr-1 text-emerald-500" fill="#6EE7B7" />}
          {time}
        </div>
      </div>

      <div className="bg-orange-50 rounded-lg px-3 py-2 mb-4 inline-block w-full">
        <span className="text-xs text-orange-500 font-bold"><span className="text-orange-400 mr-1">当前任务:</span> {task.replace('当前任务: ', '').replace('客户阶段任务: ', '')}</span>
      </div>

      <div className="flex justify-between items-end">
        <div className="flex flex-wrap gap-2">
          {info.split('|').map((item: string, i: number) => (
            <span key={i} className={cn(
              "text-xs px-2 py-1 rounded-md font-medium",
              item.trim() === '重点单' ? "bg-red-50 text-red-500" : "bg-gray-100 text-gray-500"
            )}>
              {item.trim()}
            </span>
          ))}
        </div>
        <div className="flex space-x-3">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate(`/customers/${id}/add-note`, { state: { isCall: true } });
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

function ClockIcon({ className, fill = "#FCA5A5" }: { className?: string, fill?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={className}>
      <circle cx="7" cy="7" r="6" fill={fill} />
      <path d="M7 3.5V7L9 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={className}>
      <circle cx="7" cy="7" r="6" fill="#10B981" />
      <path d="M4 7L6 9L10 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
