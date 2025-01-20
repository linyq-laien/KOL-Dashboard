import React from 'react';
import { Search as SearchIcon } from 'lucide-react';

export default function Search() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">搜索KOL</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="按姓名、地区或标签搜索..."
              className="w-full px-4 py-3 pl-12 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <SearchIcon className="absolute left-4 top-3.5 text-gray-400" size={20} />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">筛选条件</h3>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  粉丝数范围
                </label>
                <div className="flex space-x-4">
                  <input
                    type="number"
                    placeholder="最小值"
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="number"
                    placeholder="最大值"
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  地区
                </label>
                <input
                  type="text"
                  placeholder="输入地区"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">高级筛选</h3>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  互动率
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  内容类型
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span className="ml-2 text-sm text-gray-700">直播</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span className="ml-2 text-sm text-gray-700">短视频</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span className="ml-2 text-sm text-gray-700">图文</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
              重置
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              搜索
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}