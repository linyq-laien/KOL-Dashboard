import React from 'react';
import { Search as SearchIcon } from 'lucide-react';
import PageLayout from '../components/PageLayout';

export default function Search() {
  return (
    <PageLayout
      title="搜索"
      description="搜索和发现潜在的KOL资源"
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索KOL、标签或平台..."
                className="w-full pl-12 pr-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">热门搜索</h3>
              <div className="flex flex-wrap gap-2">
                {['美妆', '时尚', '生活方式', '美食', '旅行', '科技'].map((tag) => (
                  <button
                    key={tag}
                    className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-700 mb-3">搜索历史</h3>
              <div className="space-y-3">
                {['时尚博主 互动率>5%', '美妆KOL 粉丝数>100K', '旅行视频创作者'].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <SearchIcon size={16} className="text-gray-400" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                    <button className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}