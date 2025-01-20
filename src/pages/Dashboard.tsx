import React from 'react';
import PageLayout from '../components/PageLayout';

export default function Dashboard() {
  return (
    <PageLayout
      title="数据概览"
      description="查看和分析您的KOL数据指标"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 数据卡片 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">总KOL数量</h3>
          <div className="flex items-end space-x-2">
            <span className="text-3xl font-bold text-blue-600">20,000</span>
            <span className="text-sm text-green-600 mb-1">+2.5%</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">较上月增长</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">平均互动率</h3>
          <div className="flex items-end space-x-2">
            <span className="text-3xl font-bold text-blue-600">5.2%</span>
            <span className="text-sm text-red-600 mb-1">-0.8%</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">较上月下降</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">活跃KOL</h3>
          <div className="flex items-end space-x-2">
            <span className="text-3xl font-bold text-blue-600">15,230</span>
            <span className="text-sm text-green-600 mb-1">+1.2%</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">较上月增长</p>
        </div>

        {/* 图表区域 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 md:col-span-2 lg:col-span-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">KOL增长趋势</h3>
          <div className="h-80 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
            <span className="text-gray-400">图表区域</span>
          </div>
        </div>

        {/* 最近活动 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 md:col-span-2 lg:col-span-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">最近活动</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">KOL {item}</p>
                    <p className="text-xs text-gray-500">发布了新的内容</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">2小时前</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}