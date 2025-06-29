import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { Toaster } from '@/components/ui/toaster';

export function Layout() {
  return (
    <div className="flex h-screen w-full bg-background">
      {/* Sidebar always visible for web view */}
      <div className="w-80 h-full">
        <Sidebar />
      </div>
      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="px-8 py-10">
          <Outlet />
        </div>
      </main>
      <Toaster />
    </div>
  );
}