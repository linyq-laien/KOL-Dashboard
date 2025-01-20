import React from 'react';
import { LayoutDashboard, Users, BarChart2, Settings, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { icon: LayoutDashboard, label: '数据概览', path: '/' },
  { icon: Users, label: 'KOL 管理', path: '/kols' },
  { icon: Search, label: '搜索', path: '/search' },
  { icon: BarChart2, label: '数据分析', path: '/analytics' },
  { icon: Settings, label: '设置', path: '/settings' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 h-screen bg-gray-900 text-white fixed left-0 top-0">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-8">KOL Dashboard</h1>
        <nav>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 p-3 rounded-lg mb-2 transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}