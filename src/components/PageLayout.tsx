import React from 'react';
import { useSidebar } from '../contexts/SidebarContext';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export default function PageLayout({ children, title, description }: PageLayoutProps) {
  const { isCollapsed } = useSidebar();

  return (
    <div className={`${isCollapsed ? 'pl-16' : 'pl-72'} transition-all duration-300`}>
      <div className="min-h-screen p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Welcome back, Admin</h2>
          <p className="mt-2 text-gray-600">{description}</p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
} 