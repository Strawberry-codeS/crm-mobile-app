import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function Layout() {
  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gray-50 shadow-2xl overflow-hidden relative flex flex-col">
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="min-h-full pb-20">
          <Outlet />
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
