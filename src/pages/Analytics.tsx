import React from 'react';
import PageLayout from '../components/PageLayout';

export default function Analytics() {
  return (
    <PageLayout
      title="数据分析"
      description="深入分析KOL数据指标和趋势"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 数据趋势图表 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">粉丝增长趋势</h3>
          <div className="h-80 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
            <span className="text-gray-400">折线图区域</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">互动率分布</h3>
          <div className="h-80 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
            <span className="text-gray-400">饼图区域</span>
          </div>
        </div>

        {/* KOL分布统计 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">KOL等级分布</h3>
          <div className="space-y-4">
            {['MEGA', 'MACRO', 'MID', 'MICRO', 'NANO'].map((level) => (
              <div key={level} className="flex items-center space-x-4">
                <span className="w-20 text-sm text-gray-600">{level}</span>
                <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${Math.random() * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">{Math.floor(Math.random() * 1000)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 平台分布 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">平台分布</h3>
          <div className="space-y-4">
            {['小红书', '抖音', 'B站', '微博', '快手'].map((platform) => (
              <div key={platform} className="flex items-center space-x-4">
                <span className="w-20 text-sm text-gray-600">{platform}</span>
                <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${Math.random() * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">{Math.floor(Math.random() * 1000)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 内容分析 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">内容分析</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">热门标签</h4>
              <div className="flex flex-wrap gap-2">
                {['美妆', '时尚', '生活方式', '美食', '旅行'].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">内容类型分布</h4>
              <div className="space-y-2">
                {['图文', '短视频', '直播'].map((type) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{type}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {Math.floor(Math.random() * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">发布时间分布</h4>
              <div className="space-y-2">
                {['早晨', '下午', '晚上', '凌晨'].map((time) => (
                  <div key={time} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{time}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {Math.floor(Math.random() * 100)}%
                    </span>
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