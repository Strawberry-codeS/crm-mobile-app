import { Home, Users, User, MessageSquare, Bell } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function BottomNav() {
  const location = useLocation();
  const path = location.pathname;

  const navItems = [
    { icon: Home, label: '工作台', path: '/' },
    { icon: Users, label: '客户', path: '/customers' },
    { icon: User, label: '我的', path: '/profile' },
  ];

  return (
    <div className="bg-white border-t border-gray-100 px-6 py-2 pb-safe flex justify-between items-center shrink-0">
      {navItems.map((item) => {
        const isActive = path === item.path || (item.path !== '/' && path.startsWith(item.path));
        return (
          <Link
            key={item.path}
            to={item.path}
            className="flex flex-col items-center justify-center w-full space-y-1"
          >
            <item.icon
              size={24}
              className={cn(
                "transition-colors",
                isActive ? "text-violet-600 fill-current" : "text-gray-400"
              )}
              strokeWidth={isActive ? 0 : 2}
            />
            <span className={cn("text-[10px]", isActive ? "text-violet-600 font-medium" : "text-gray-400")}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
