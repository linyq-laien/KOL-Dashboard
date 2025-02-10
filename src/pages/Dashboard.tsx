import PageLayout from '../components/PageLayout';
import { useQuery } from '@tanstack/react-query';
import { api } from '../utils/api';

// 获取统计数据的函数
const fetchDashboardStats = async () => {
  // 只需要请求第一页,获取total即可
  const response = await api.kol.list(1, 1, [])
  
  return {
    totalNum: response.total, // 直接使用返回的total
    activeKols: 10000,
    averageEngagement: 2.5
  };
};

export default function Dashboard() {
  // 使用 React Query 获取数据
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats
  });

  // 加载状态
  if (isLoading) {
    return (
      <PageLayout
        title="数据概览"
        description="查看和分析您的KOL数据指标"
      >
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </PageLayout>
    );
  }

  // 错误状态
  if (isError) {
    return (
      <PageLayout
        title="数据概览"
        description="查看和分析您的KOL数据指标"
      >
        <div className="flex justify-center items-center h-64">
          <div className="text-red-600">加载数据失败</div>
        </div>
      </PageLayout>
    );
  }

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
            <span className="text-3xl font-bold text-blue-600">
              {data?.totalNum.toLocaleString()}
            </span>
            <span className="text-sm text-green-600 mb-1">+2.5%</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">较上月增长</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">平均互动率</h3>
          <div className="flex items-end space-x-2">
            <span className="text-3xl font-bold text-blue-600">
              {data?.averageEngagement.toFixed(1)}%
            </span>
            <span className="text-sm text-red-600 mb-1">-0.8%</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">较上月下降</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">活跃KOL</h3>
          <div className="flex items-end space-x-2">
            <span className="text-3xl font-bold text-blue-600">
              {data?.activeKols.toLocaleString()}
            </span>
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