import { Search, Filter, Phone, MessageSquare, ChevronDown, X, Calendar, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useCustomers } from '@/hooks/useCustomers';
import type { Customer as CustomerData } from '@/lib/supabase';
import { InlineCallPlayer, useInlineCallPlayer } from '@/components/InlineCallPlayer';

export default function CustomerList() {
  const [showFilter, setShowFilter] = useState(false);
  const [activeTab, setActiveTab] = useState('全部客户');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCampusDropdownOpen, setIsCampusDropdownOpen] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState('大悦城校区');

  const campuses = ['大悦城校区', '广渠门校区'];

  const tabs = ['全部客户', '新分配客户', '待继续跟进', '待上门试听', '重点客户'];

  const tabCategory = activeTab === '全部客户' ? undefined : activeTab;
  const { customers, loading, search } = useCustomers(tabCategory);

  const handleSearch = (q: string) => {
    setSearchTerm(q);
    search(q);
  };

  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const dragged = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragged.current = false;
    if (!scrollRef.current) return;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    if (Math.abs(walk) > 5) {
      dragged.current = true;
    }
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleTabClick = (tab: string, e: React.MouseEvent) => {
    if (dragged.current) {
      e.preventDefault();
      return;
    }
    setActiveTab(tab);
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
      <div className="flex justify-between items-center py-2 mb-2 relative z-50">
        <div className="relative">
          <button
            onClick={() => setIsCampusDropdownOpen(!isCampusDropdownOpen)}
            className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100"
          >
            <MapPin size={14} className="text-violet-600" />
            <span className="text-xs font-medium text-gray-700 max-w-[80px] truncate">{selectedCampus}</span>
            <ChevronDown size={12} className="text-gray-400" />
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
        <h1 className="text-xl font-bold text-gray-900 absolute left-1/2 -translate-x-1/2">客户</h1>
        <div className="w-[88px] invisible"></div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={e => handleSearch(e.target.value)}
            placeholder="搜索客户姓名、手机号"
            className="w-full bg-gray-50 rounded-full py-3.5 pl-11 pr-4 text-sm focus:outline-none border border-transparent focus:border-violet-200"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-3 border-b border-gray-100 pb-1">
        <div
          ref={scrollRef}
          className="flex space-x-6 px-2 overflow-x-auto no-scrollbar touch-pan-x cursor-grab active:cursor-grabbing select-none"
          style={{ WebkitOverflowScrolling: 'touch' }}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={(e) => handleTabClick(tab, e)}
              className={cn(
                "pb-2 font-medium whitespace-nowrap transition-colors relative flex-shrink-0",
                activeTab === tab ? "text-violet-600 font-bold" : "text-gray-400"
              )}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute -bottom-[5px] left-0 right-0 h-0.5 bg-violet-600 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="text-gray-400 text-sm">
          {activeTab} ({customers.length})
        </div>
        <button
          onClick={() => setShowFilter(true)}
          className="flex items-center justify-center text-violet-600 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 active:bg-violet-50 font-medium text-sm transition-colors"
        >
          <Filter size={14} className="mr-1.5" /> 筛选
        </button>
      </div>

      {/* Secondary Filters removed per user request */}

      {/* List */}
      <div className="flex-1 space-y-3 overflow-y-auto pb-20 no-scrollbar">
        {loading && <div className="text-center py-10 text-gray-400 text-sm animate-pulse">加载中...</div>}
        {!loading && customers.length === 0 && <div className="text-center py-10 text-gray-400 text-sm">暂无客户数据</div>}
        {!loading && customers.map((c) => {
          let cardTags = [c.source_channel].filter(Boolean) as string[];
          let cardTime = c.time_text ?? '';
          let cardTimeStatus = (c.time_status as string) ?? 'success';

          // Inject hardcoded overrides for specific demo users to match Workbench exactly
          if (c.name === '欧阳春晓') {
            cardTags = ['2天待跟进1次', '线上-小表单'];
            cardTime = '已超时';
            cardTimeStatus = 'urgent';
          } else if (c.name === '欧阳小明') {
            cardTags = ['2天待跟进1次', '线下-口碑'];
            cardTime = '已超时';
            cardTimeStatus = 'urgent';
          }

          return (
            <CustomerItem
              key={c.id}
              id={c.id}
              name={c.name}
              tags={cardTags}
              task={c.customer_stage ? `用户纪要：${c.customer_stage}` : '用户纪要：跟进'}
              info={buildInfo(c)}
              time={cardTime}
              color={(c.color as string) ?? 'gray'}
              timeStatus={cardTimeStatus}
            />
          );
        })}
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
  const [taskExpanded, setTaskExpanded] = useState(false);
  const callPlayer = useInlineCallPlayer("03:15");

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
          {tags.map((tag: string, i: number) => {
            let bgColor = 'bg-gray-100';
            let textColor = 'text-gray-600';

            if (i === 0 && tag.includes('天待跟进')) {
              bgColor = 'bg-red-500'; textColor = 'text-white';
            } else if (tag.includes('小红书') || tag.includes('小表单')) {
              bgColor = 'bg-red-100'; textColor = 'text-red-600';
            } else if (tag.includes('抖音') || tag.includes('线上')) {
              bgColor = 'bg-violet-100'; textColor = 'text-violet-600';
            } else if (tag.includes('试听')) {
              bgColor = 'bg-purple-100'; textColor = 'text-purple-600';
            } else if (tag.includes('线下') || tag.includes('地推') || tag.includes('口碑')) {
              bgColor = 'bg-blue-100'; textColor = 'text-blue-600';
            }

            return (
              <span key={i} className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 ${bgColor} ${textColor}`}>
                {tag}
              </span>
            );
          })}
        </div>
        <div className={`flex items-center text-xs font-medium shrink-0 ml-2 ${timeColorClass}`}>
          {timeStatus === 'urgent' && <ClockIcon className="mr-1" />}
          {timeStatus === 'warning' && <ClockIcon className="mr-1 text-orange-500" fill="#FDBA74" />}
          {timeStatus === 'success' && <ClockIcon className="mr-1 text-emerald-500" fill="#6EE7B7" />}
          {time}
        </div>
      </div>

      <div className="bg-orange-50 rounded-lg px-3 py-2 mb-4 w-full">
        <div className="flex items-center justify-between">
          <span className="text-xs text-orange-500 font-bold flex-1 min-w-0 truncate">
            <span className="text-orange-400 mr-1">
              {task.startsWith('用户纪要') ? '' : '当前任务:'}
            </span>
            {task.startsWith('用户纪要') ? task : task.replace('当前任务: ', '').replace('客户阶段任务: ', '')}
          </span>
          <div className="flex items-center gap-1.5 ml-2 shrink-0">
            {/* 播放按钮 */}
            {task.startsWith('用户纪要') && (
              <button
                onClick={callPlayer.togglePlay}
                className="w-6 h-6 flex items-center justify-center text-orange-400 hover:text-orange-600 transition-colors bg-white rounded-full shadow-sm"
                title="播放"
              >
                {callPlayer.playing ? (
                  <svg width="10" height="10" viewBox="0 0 14 14" fill="currentColor">
                    <rect x="2" y="2" width="3.5" height="10" rx="1" />
                    <rect x="8.5" y="2" width="3.5" height="10" rx="1" />
                  </svg>
                ) : (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor">
                    <polygon points="3,2 10,6 3,10" />
                  </svg>
                )}
              </button>
            )}
            {/* 下拉按钮 */}
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setTaskExpanded(v => !v); }}
              className="w-6 h-6 flex items-center justify-center text-orange-400 hover:text-orange-600 transition-colors"
            >
              <svg
                width="12" height="12" viewBox="0 0 12 12" fill="currentColor"
                style={{ transform: taskExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
              >
                <polygon points="1,3 6,9 11,3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Inline call player expanded view */}
        {task.startsWith('用户纪要') && <InlineCallPlayer player={callPlayer} />}
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
