import React, { useState, useMemo } from 'react';
import { Plus, Download, Eye } from 'lucide-react';
import type { KOL, KOLMetrics, KOLOperationalData } from '../types/kol';
import TableColumnSelector from '../components/TableColumnSelector';
import TableFilter from '../components/TableFilter';
import { useSidebar } from '../contexts/SidebarContext';
import PageLayout from '../components/PageLayout';
import KOLDetailModal from '../components/KOLDetailModal';
import { useQuery } from '@tanstack/react-query';

// API调用函数
const fetchKOLs = async (
  page: number,
  size: number,
  filters: Array<{
    column: string;
    operator: string;
    value: string | number;
  }>
): Promise<{
  total: number;
  items: KOL[];
  page: number;
  size: number;
  pages: number;
}> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  // 转换过滤条件
  filters.forEach(filter => {
    const value = filter.value;
    switch (filter.column) {
      case 'followersK':
        if (filter.operator === 'greater') {
          params.append('min_followers', value.toString());
        } else if (filter.operator === 'less') {
          params.append('max_followers', value.toString());
        }
        break;
      case 'name':
      case 'level':
      case 'gender':
      case 'location':
      case 'source':
      case 'sendStatus':
        params.append(
          filter.column === 'sendStatus' ? 'send_status' : filter.column.toLowerCase(),
          value.toString()
        );
        break;
    }
  });

  const response = await fetch(`/api/kols?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch KOLs');
  }

  const data = await response.json();
  
  // 转换响应数据格式
  return {
    total: data.total,
    page: data.page,
    size: data.size,
    pages: data.pages,
    items: data.items.map((item: any) => ({
      id: item.id.toString(),
      kolId: item.kol_id,
      email: item.email,
      name: item.name,
      bio: item.bio,
      accountLink: item.account_link,
      source: item.source,
      filter: item.filter,
      gender: item.gender,
      tag: item.tag,
      language: item.language,
      location: item.location,
      slug: item.slug,
      creatorId: item.creator_id,
      metrics: {
        followersK: item.followers_k,
        likesK: item.likes_k,
        meanViewsK: item.mean_views_k,
        medianViewsK: item.median_views_k,
        engagementRate: item.engagement_rate,
        averageViewsK: item.average_views_k,
        averageLikesK: item.average_likes_k,
        averageCommentsK: item.average_comments_k
      },
      operational: {
        sendStatus: item.send_status,
        sendDate: new Date(item.send_date),
        exportDate: new Date(item.export_date),
        level: item.level,
        keywordsAI: item.keywords_ai || [],
        mostUsedHashtags: item.most_used_hashtags || []
      }
    }))
  };
};

interface Column {
  key: string;
  title: string;
  tooltip?: string;
}

const columns: Column[] = [
  { key: 'kolId', title: 'KOL ID', tooltip: 'KOL唯一标识' },
  { key: 'email', title: 'Email', tooltip: '邮箱地址' },
  { key: 'sendStatus', title: 'Send Status', tooltip: '发送状态' },
  { key: 'sendDate', title: 'Send Date', tooltip: '发送日期' },
  { key: 'name', title: 'KOL Name', tooltip: 'KOL名称' },
  { key: 'bio', title: 'Bio', tooltip: '个人简介' },
  { key: 'exportDate', title: 'Export Date', tooltip: '导出日期' },
  { key: 'accountLink', title: 'Account Link', tooltip: '账号链接' },
  { key: 'source', title: 'Source', tooltip: '平台来源' },
  { key: 'filter', title: 'Filter', tooltip: '筛选标签' },
  { key: 'gender', title: 'Gender', tooltip: '性别' },
  { key: 'tag', title: 'Tag', tooltip: '标签' },
  { key: 'language', title: 'Language', tooltip: '语言' },
  { key: 'location', title: 'Location', tooltip: '地区' },
  { key: 'followersK', title: 'Followers(K)', tooltip: '粉丝数(K)' },
  { key: 'likesK', title: 'Likes(K)', tooltip: '获赞数(K)' },
  { key: 'meanViewsK', title: 'Mean Views(K)', tooltip: '平均观看数(K)' },
  { key: 'medianViewsK', title: 'Median Views(K)', tooltip: '中位观看数(K)' },
  { key: 'keywordsAI', title: 'Keywords-AI', tooltip: 'AI关键词' },
  { key: 'level', title: 'Level', tooltip: 'KOL等级' },
  { key: 'engagementRate', title: 'Engagement Rate(%)', tooltip: '互动率(%)' },
  { key: 'averageViewsK', title: 'Average Views(K)', tooltip: '平均观看数(K)' },
  { key: 'averageLikesK', title: 'Average Likes(K)', tooltip: '平均点赞数(K)' },
  { key: 'averageCommentsK', title: 'Average Comments(K)', tooltip: '平均评论数(K)' },
  { key: 'mostUsedHashtags', title: 'Most Used Hashtags', tooltip: '常用标签' },
  { key: 'slug', title: 'Slug', tooltip: '短链接' },
  { key: 'creatorId', title: 'Creator ID', tooltip: '创作者ID' }
];

export default function KOLManagement() {
  const { isCollapsed } = useSidebar();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [visibleColumns, setVisibleColumns] = useState(columns.map(col => col.key));
  const [filters, setFilters] = useState<Array<{
    column: string;
    operator: string;
    value: string | number;
  }>>([]);
  const [selectedKOL, setSelectedKOL] = useState<KOL | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 使用 React Query 获取数据
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['kols', currentPage, pageSize, filters],
    queryFn: () => fetchKOLs(currentPage, pageSize, filters)
  });

  const handleColumnToggle = (columnKey: string) => {
    if (visibleColumns.includes(columnKey)) {
      setVisibleColumns(visibleColumns.filter(key => key !== columnKey));
    } else {
      setVisibleColumns([...visibleColumns, columnKey]);
    }
  };

  const handleSave = async (updatedKol: KOL) => {
    try {
      const response = await fetch(`/api/kols/${updatedKol.kolId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: updatedKol.name,
          email: updatedKol.email,
          bio: updatedKol.bio,
          account_link: updatedKol.accountLink,
          source: updatedKol.source,
          filter: updatedKol.filter,
          gender: updatedKol.gender,
          tag: updatedKol.tag,
          language: updatedKol.language,
          location: updatedKol.location,
          slug: updatedKol.slug,
          creator_id: updatedKol.creatorId,
          followers_k: updatedKol.metrics.followersK,
          likes_k: updatedKol.metrics.likesK,
          mean_views_k: updatedKol.metrics.meanViewsK,
          median_views_k: updatedKol.metrics.medianViewsK,
          engagement_rate: updatedKol.metrics.engagementRate,
          average_views_k: updatedKol.metrics.averageViewsK,
          average_likes_k: updatedKol.metrics.averageLikesK,
          average_comments_k: updatedKol.metrics.averageCommentsK,
          send_status: updatedKol.operational.sendStatus,
          level: updatedKol.operational.level,
          keywords_ai: updatedKol.operational.keywordsAI,
          most_used_hashtags: updatedKol.operational.mostUsedHashtags
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update KOL');
      }
    } catch (error) {
      console.error('Error updating KOL:', error);
      // 这里可以添加错误提示
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/kols/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete KOL');
      }
    } catch (error) {
      console.error('Error deleting KOL:', error);
      // 这里可以添加错误提示
    }
  };

  // 加载状态
  if (isLoading) {
    return (
      <PageLayout
        title="KOL Management"
        description="Manage and monitor your KOL resources"
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
        title="KOL Management"
        description="Manage and monitor your KOL resources"
      >
        <div className="flex justify-center items-center h-64">
          <div className="text-red-600">Error loading KOLs: {(error as Error).message}</div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="KOL Management"
      description="Manage and monitor your KOL resources"
    >
      <div className="flex justify-end space-x-4 mb-6">
        <TableFilter
          columns={columns}
          onFilterChange={setFilters}
        />
        <TableColumnSelector
          columns={columns}
          visibleColumns={visibleColumns}
          onColumnToggle={handleColumnToggle}
        />
        <button className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg flex items-center space-x-2 hover:bg-gray-200 transition-colors">
          <Download size={20} />
          <span>导出</span>
        </button>
        <button className="px-4 py-2.5 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors">
          <Plus size={20} />
          <span>添加 KOL</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {columns.filter(col => visibleColumns.includes(col.key)).map((column) => (
                  <th
                    key={column.key}
                    className={`px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200
                      ${column.key === 'name' ? 'sticky left-0 bg-gray-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] z-10' : ''}`}
                    title={column.tooltip}
                  >
                    {column.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.items.map((kol, rowIndex) => (
                <tr 
                  key={kol.id} 
                  className={`hover:bg-blue-50/60 transition-colors cursor-pointer
                    ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  {columns.filter(col => visibleColumns.includes(col.key)).map((column) => (
                    <td
                      key={column.key}
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        column.key === 'name' 
                          ? 'sticky left-0 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] z-10' 
                          : ''
                      } ${
                        rowIndex % 2 === 0 
                          ? column.key === 'name' ? 'bg-white' : ''
                          : column.key === 'name' ? 'bg-gray-50' : ''
                      }`}
                    >
                      {column.key === 'name' ? (
                        <div className="flex items-center">
                          <span>{kol.name}</span>
                        </div>
                      ) : column.key === 'kolId' ? (
                        <div className="flex items-center justify-between">
                          <span>{kol.kolId}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedKOL(kol);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      ) : column.key === 'keywordsAI' || column.key === 'mostUsedHashtags' ? (
                        <div className="flex flex-wrap gap-1.5">
                          {kol.operational[column.key]?.map((tag: string, index: number) => (
                            <span
                              key={index}
                              className="px-2.5 py-1 text-xs bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : column.key === 'level' ? (
                        <span className="px-2.5 py-1 text-xs leading-4 font-semibold rounded-full bg-green-100 text-green-800 hover:bg-green-200 transition-colors">
                          {kol.operational.level}
                        </span>
                      ) : column.key === 'sendStatus' ? (
                        <span className={`px-2.5 py-1 text-xs leading-4 font-semibold rounded-full 
                          ${kol.operational.sendStatus ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'} 
                          transition-colors`}
                        >
                          {kol.operational.sendStatus || '未发送'}
                        </span>
                      ) : column.key === 'followersK' || column.key === 'likesK' ? (
                        <div className="text-gray-900 font-medium">
                          {kol.metrics[column.key as keyof KOLMetrics]}K
                        </div>
                      ) : column.key === 'engagementRate' ? (
                        <div className="text-gray-900 font-medium">
                          {kol.metrics.engagementRate}%
                        </div>
                      ) : (
                        <div className="text-gray-900">
                          {(kol as any)[column.key]}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700 whitespace-nowrap">
              每页显示
            </span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-lg border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {[10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-700 whitespace-nowrap">
              条 | 总计 {data?.total || 0} 条
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-3.5 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
            >
              首页
            </button>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3.5 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
            >
              上一页
            </button>
            <span className="text-sm text-gray-700 px-2">
              第 {currentPage} 页 / 共 {data?.pages || 0} 页
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === (data?.pages || 0)}
              className="px-3.5 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
            >
              下一页
            </button>
            <button
              onClick={() => setCurrentPage(data?.pages || 0)}
              disabled={currentPage === (data?.pages || 0)}
              className="px-3.5 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
            >
              末页
            </button>
          </div>
        </div>
      </div>

      <KOLDetailModal
        kol={selectedKOL}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedKOL(null);
        }}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </PageLayout>
  );
}