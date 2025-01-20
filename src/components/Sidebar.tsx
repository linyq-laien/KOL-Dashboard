import React from 'react';
import { LayoutDashboard, Users, BarChart2, Settings, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from '../contexts/SidebarContext';

const menuItems = [
  { icon: LayoutDashboard, label: '数据概览', path: '/' },
  { icon: Users, label: 'KOL 管理', path: '/kols' },
  { icon: Search, label: '搜索', path: '/search' },
  { icon: BarChart2, label: '数据分析', path: '/analytics' },
  { icon: Settings, label: '设置', path: '/settings' },
];

export default function Sidebar() {
  const location = useLocation();
  const { isCollapsed, setIsCollapsed } = useSidebar();

  return (
    <div 
      className={`${
        isCollapsed ? 'w-16' : 'w-72'
      } h-screen bg-gray-900 text-white fixed left-0 top-0 transition-all duration-300 ease-in-out z-50 shadow-xl`}
    >
      <div className="flex flex-col h-full">
        {/* Logo区域 */}
        <div className="p-5 relative border-b border-gray-800">
          <h1 
            className={`text-2xl font-bold overflow-hidden transition-all duration-300 flex items-center ${
              isCollapsed ? 'opacity-0 w-0' : 'opacity-100'
            }`}
          >
            KOL Dashboard
          </h1>
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`absolute -right-4 top-1/2 -translate-y-1/2 bg-gray-900 rounded-full p-2.5 shadow-lg border border-gray-700 
              hover:bg-gray-800 hover:border-gray-600 transition-all duration-200 group
              ${isCollapsed ? 'hover:translate-x-1' : 'hover:-translate-x-1'}`}
          >
            <div className="w-6 h-6 flex items-center justify-center">
              {isCollapsed ? (
                <ChevronRight size={20} className="text-gray-400 group-hover:text-white transition-colors" />
              ) : (
                <ChevronLeft size={20} className="text-gray-400 group-hover:text-white transition-colors" />
              )}
            </div>
          </button>
        </div>

        {/* 导航菜单 */}
        <nav className="flex-1 py-6">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center ${isCollapsed ? 'justify-center px-3' : 'px-5'} py-3.5 mb-2 transition-all duration-200
                  ${isActive 
                    ? 'bg-blue-600 text-white relative before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-blue-400' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }
                  ${index === menuItems.length - 1 ? 'mt-auto' : ''}`}
                title={isCollapsed ? item.label : ''}
              >
                <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'space-x-3'}`}>
                  <Icon size={24} className={`transition-transform duration-200 ${isActive ? 'transform scale-110' : ''}`} />
                  <span 
                    className={`transition-all duration-300 ${
                      isCollapsed 
                        ? 'opacity-0 w-0 absolute' 
                        : 'opacity-100 relative'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* 底部分隔线 */}
        <div className="px-5 py-4 border-t border-gray-800">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
            <span className={`text-sm text-gray-400 transition-all duration-300 ${
              isCollapsed ? 'opacity-0 w-0 absolute' : 'opacity-100 relative'
            }`}>
              在线
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}