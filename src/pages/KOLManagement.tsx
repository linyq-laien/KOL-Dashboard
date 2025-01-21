import React, { useState, useMemo } from 'react';
import { Plus, Download, Eye } from 'lucide-react';
import type { KOL, KOLMetrics, KOLOperationalData } from '../types/kol';
import TableColumnSelector from '../components/TableColumnSelector';
import TableFilter from '../components/TableFilter';
import { useSidebar } from '../contexts/SidebarContext';
import PageLayout from '../components/PageLayout';
import KOLDetailModal from '../components/KOLDetailModal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

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
      accountLink: item.account_link ? String(item.account_link) : null,
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
        sendDate: item.send_date ? new Date(item.send_date) : null,
        exportDate: item.export_date ? new Date(item.export_date) : null,
        level: item.level,
        keywordsAI: item.keywords_ai || [],
        mostUsedHashtags: item.most_used_hashtags || []
      },
      collaborations: item.collaborations || []
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

// 渲染标签列表的函数
const renderTags = (tags: string[] = [], total: number) => {
  const displayTags = tags.slice(0, 2);
  const remaining = total - displayTags.length;

  return (
    <div className="flex items-center space-x-1.5 overflow-hidden">
      {displayTags.map((tag: string, index: number) => (
        <span
          key={index}
          className="px-2.5 py-1 text-xs bg-gray-100 rounded-full whitespace-nowrap"
        >
          {tag}
        </span>
      ))}
      {remaining > 0 && (
        <span className="text-xs text-gray-500 whitespace-nowrap">
          +{remaining} more...
        </span>
      )}
    </div>
  );
};

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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // 使用 React Query 获取数据
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['kols', currentPage, pageSize, filters],
    queryFn: () => fetchKOLs(currentPage, pageSize, filters)
  });

  // 更新 KOL 的 mutation
  const updateKolMutation = useMutation({
    mutationFn: async (updatedKol: KOL) => {
      // 准备更新数据，确保类型正确
      const updateData = {
        name: updatedKol.name || null,
        email: updatedKol.email || null,
        bio: updatedKol.bio || null,
        account_link: updatedKol.accountLink ? String(updatedKol.accountLink) : null,
        source: updatedKol.source || null,
        filter: updatedKol.filter || null,
        gender: updatedKol.gender || null,
        tag: updatedKol.tag || null,
        language: updatedKol.language || null,
        location: updatedKol.location || null,
        slug: updatedKol.slug || null,
        creator_id: updatedKol.creatorId || null,
        followers_k: updatedKol.metrics.followersK || null,
        likes_k: updatedKol.metrics.likesK || null,
        mean_views_k: updatedKol.metrics.meanViewsK || null,
        median_views_k: updatedKol.metrics.medianViewsK || null,
        engagement_rate: updatedKol.metrics.engagementRate || null,
        average_views_k: updatedKol.metrics.averageViewsK || null,
        average_likes_k: updatedKol.metrics.averageLikesK || null,
        average_comments_k: updatedKol.metrics.averageCommentsK || null,
        send_status: updatedKol.operational.sendStatus || null,
        send_date: updatedKol.operational.sendDate instanceof Date 
          ? updatedKol.operational.sendDate.toISOString().slice(0, 19).replace('T', ' ')
          : null,
        export_date: updatedKol.operational.exportDate instanceof Date 
          ? updatedKol.operational.exportDate.toISOString().slice(0, 19).replace('T', ' ')
          : null,
        level: updatedKol.operational.level || null,
        keywords_ai: Array.isArray(updatedKol.operational.keywordsAI) ? updatedKol.operational.keywordsAI : [],
        most_used_hashtags: Array.isArray(updatedKol.operational.mostUsedHashtags) ? updatedKol.operational.mostUsedHashtags : [],
        collaborations: updatedKol.collaborations || []
      };

      const response = await fetch(`/api/kols/${updatedKol.kolId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || 'Failed to update KOL');
      }

      return response.json();
    },
    onSuccess: () => {
      // 更新成功后刷新数据
      queryClient.invalidateQueries({ queryKey: ['kols'] });
      toast.success('KOL 更新成功');
    },
    onError: (error) => {
      console.error('Error updating KOL:', error);
      toast.error('KOL 更新失败');
    }
  });

  // 删除 KOL 的 mutation
  const deleteKolMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/kols/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete KOL');
      }
    },
    onSuccess: () => {
      // 删除成功后刷新数据
      queryClient.invalidateQueries({ queryKey: ['kols'] });
      toast.success('KOL 删除成功');
    },
    onError: (error) => {
      console.error('Error deleting KOL:', error);
      toast.error('KOL 删除失败');
    }
  });

  // 创建 KOL 的 mutation
  const createKolMutation = useMutation({
    mutationFn: async (newKol: Omit<KOL, 'id'>) => {
      // 准备请求数据，确保类型正确
      const requestData = {
        kol_id: newKol.kolId,
        name: newKol.name || null,
        email: newKol.email || null,
        bio: newKol.bio || null,
        // 确保 account_link 是字符串类型
        account_link: newKol.accountLink ? `${newKol.accountLink}` : null,
        source: newKol.source || null,
        filter: newKol.filter || null,
        gender: newKol.gender || null,
        tag: newKol.tag || null,
        language: newKol.language || null,
        location: newKol.location || null,
        slug: newKol.slug || null,
        creator_id: newKol.creatorId || null,
        followers_k: newKol.metrics.followersK || null,
        likes_k: newKol.metrics.likesK || null,
        mean_views_k: newKol.metrics.meanViewsK || null,
        median_views_k: newKol.metrics.medianViewsK || null,
        engagement_rate: newKol.metrics.engagementRate || null,
        average_views_k: newKol.metrics.averageViewsK || null,
        average_likes_k: newKol.metrics.averageLikesK || null,
        average_comments_k: newKol.metrics.averageCommentsK || null,
        send_status: newKol.operational.sendStatus || null,
        send_date: newKol.operational.sendDate instanceof Date 
          ? newKol.operational.sendDate.toISOString().slice(0, 19).replace('T', ' ')
          : null,
        export_date: newKol.operational.exportDate instanceof Date 
          ? newKol.operational.exportDate.toISOString().slice(0, 19).replace('T', ' ')
          : null,
        level: newKol.operational.level || null,
        keywords_ai: Array.isArray(newKol.operational.keywordsAI) ? newKol.operational.keywordsAI : [],
        most_used_hashtags: Array.isArray(newKol.operational.mostUsedHashtags) ? newKol.operational.mostUsedHashtags : [],
        collaborations: newKol.collaborations || []
      };

      console.log('Creating KOL with data:', requestData);  // 添加日志

      const response = await fetch('/api/kols', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        // 解析错误信息
        if (response.status === 422) {
          const errorDetails = data.detail || [];
          const formattedErrors = errorDetails.map((error: any) => {
            const field = error.loc[1];
            const msg = error.msg;
            console.error(`Validation error for field ${field}:`, msg);  // 添加字段级别的错误日志
            return `${field}: ${msg}`;
          }).join('\n');
          throw new Error(`数据验证错误:\n${formattedErrors}`);
        } else if (response.status === 500) {
          console.error('Server error:', data);  // 添加服务器错误日志
          if (data.detail?.includes('duplicate')) {
            throw new Error('邮箱已存在，请使用其他邮箱地址');
          } else {
            throw new Error(data.detail || '服务器错误，请稍后重试');
          }
        } else {
          console.error('Unknown error:', data);  // 添加未知错误日志
          throw new Error(data.detail || '创建失败，请检查输入数据');
        }
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kols'] });
      toast.success('KOL 创建成功');
      setIsCreateModalOpen(false);
    },
    onError: (error: Error) => {
      console.error('Error creating KOL:', error);
      // 使用 toast 显示格式化的错误信息
      toast.error(error.message, {
        duration: 5000,  // 延长显示时间
        style: {
          maxWidth: '500px',  // 增加宽度以显示更多内容
          whiteSpace: 'pre-line'  // 保留换行符
        }
      });
    }
  });

  const handleColumnToggle = (columnKey: string) => {
    if (visibleColumns.includes(columnKey)) {
      setVisibleColumns(visibleColumns.filter(key => key !== columnKey));
    } else {
      setVisibleColumns([...visibleColumns, columnKey]);
    }
  };

  const handleSave = async (updatedKol: KOL) => {
    await updateKolMutation.mutateAsync(updatedKol);
  };

  const handleDelete = async (id: string) => {
    await deleteKolMutation.mutateAsync(id);
  };

  const handleCreate = async (newKol: KOL) => {
    const { id, ...kolData } = newKol;
    await createKolMutation.mutateAsync(kolData);
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
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
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
                      ${column.key === 'kolId' ? 'sticky left-0 bg-gray-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] z-10' : ''}`}
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
                        column.key === 'kolId' 
                          ? 'sticky left-0 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] z-10' 
                          : ''
                      } ${
                        rowIndex % 2 === 0 
                          ? column.key === 'kolId' ? 'bg-white' : ''
                          : column.key === 'kolId' ? 'bg-gray-50' : ''
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
                        <div className="max-w-md truncate">
                          {renderTags(
                            kol.operational[column.key],
                            kol.operational[column.key]?.length || 0
                          )}
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
                      ) : column.key === 'sendDate' || column.key === 'exportDate' ? (
                        <div className="text-gray-900">
                          {kol.operational[column.key as keyof KOLOperationalData] instanceof Date
                            ? (kol.operational[column.key as keyof KOLOperationalData] as Date).toLocaleString()
                            : '-'}
                        </div>
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
        mode="edit"
      />

      <KOLDetailModal
        kol={{
          id: '',
          kolId: '',
          email: '',
          name: '',
          bio: '',
          accountLink: '',
          source: '',
          filter: '',
          gender: 'MALE',
          tag: '',
          language: 'Chinese',
          location: '',
          slug: '',
          creatorId: '',
          metrics: {
            followersK: 0,
            likesK: 0,
            meanViewsK: 0,
            medianViewsK: 0,
            engagementRate: 0,
            averageViewsK: 0,
            averageLikesK: 0,
            averageCommentsK: 0
          },
          operational: {
            sendStatus: 'Round No.1',
            sendDate: undefined,
            exportDate: undefined,
            level: 'Mid 50k-500k',
            keywordsAI: [],
            mostUsedHashtags: []
          },
          collaborations: []
        }}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreate}
        mode="create"
      />
    </PageLayout>
  );
}