import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Plus, Download, Eye } from 'lucide-react';
import type { KOL, KOLMetrics, KOLOperationalData, Gender, KOLPlatform } from '../types/kol';
import TableColumnSelector from '../components/TableColumnSelector';
import TableFilter from '../components/TableFilter';
import { useSidebar } from '../contexts/SidebarContext';
import PageLayout from '../components/PageLayout';
import KOLDetailModal from '../components/KOLDetailModal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { api } from '../utils/api';

// API调用函数
const fetchKOLs = async (
  page: number,
  size: number,
  filters: Array<{
    column: string;
    operator: string;
    value: string | number;
  }>
) => {
  // 打印日志，查看API请求参数
  console.log('API request parameters:', {
    page,
    size,
    filters
  });

  const response = await api.kol.list(page, size, filters);
  
  // 打印日志，查看API响应
  console.log('API response:', response);
  
  // 转换响应数据格式
  return {
    total: response.total,
    page: response.page,
    size: response.size,
    pages: response.pages,
    items: response.items.map((item: any) => ({
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
      platform: item.platform,
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

// 修改 Column 接口以匹配 TableFilter 组件的需求
type FieldType = 'string' | 'enum' | 'number' | 'date';

interface Column {
  key: string;
  title: string;
  tooltip?: string;
  type: FieldType;
  enumOptions?: { value: string; label: string }[];
}

const columns: Column[] = [
  { key: 'kolId', title: 'KOL ID', tooltip: 'KOL唯一标识', type: 'string' },
  { key: 'email', title: 'Email', tooltip: '邮箱地址', type: 'string' },
  { 
    key: 'sendStatus', 
    title: 'Send Status', 
    tooltip: '发送状态', 
    type: 'enum',
    enumOptions: [
      { value: 'Round No.1', label: 'Round No.1' },
      { value: 'Round No.2', label: 'Round No.2' },
      // ... 其他选项
    ]
  },
  { key: 'sendDate', title: 'Send Date', tooltip: '发送日期', type: 'date' },
  { key: 'name', title: 'KOL Name', tooltip: 'KOL名称', type: 'string' },
  { key: 'bio', title: 'Bio', tooltip: '个人简介', type: 'string' },
  { key: 'exportDate', title: 'Export Date', tooltip: '导出日期', type: 'date' },
  { key: 'accountLink', title: 'Account Link', tooltip: '账号链接', type: 'string' },
  { key: 'source', title: 'Source', tooltip: '平台来源', type: 'string' },
  { 
    key: 'platform', 
    title: 'Platform', 
    tooltip: '平台',
    type: 'enum',
    enumOptions: [
      { value: 'TikTok', label: 'TikTok' },
      { value: 'Instagram', label: 'Instagram' },
      // ... 其他平台
    ]
  },
  { key: 'filter', title: 'Filter', tooltip: '筛选标签', type: 'string' },
  { 
    key: 'gender', 
    title: 'Gender', 
    tooltip: '性别',
    type: 'enum',
    enumOptions: [
      { value: 'MALE', label: '男' },
      { value: 'FEMALE', label: '女' }
    ]
  },
  { key: 'tag', title: 'Tag', tooltip: '标签', type: 'string' },
  { 
    key: 'language', 
    title: 'Language', 
    tooltip: '语言',
    type: 'enum',
    enumOptions: [
      { value: 'Chinese', label: '中文' },
      { value: 'English', label: '英文' },
      // ... 其他语言
    ]
  },
  { key: 'location', title: 'Location', tooltip: '地区', type: 'string' },
  { key: 'followersK', title: 'Followers(K)', tooltip: '粉丝数(K)', type: 'number' },
  { key: 'likesK', title: 'Likes(K)', tooltip: '获赞数(K)', type: 'number' },
  { key: 'meanViewsK', title: 'Mean Views(K)', tooltip: '平均观看数(K)', type: 'number' },
  { key: 'medianViewsK', title: 'Median Views(K)', tooltip: '中位观看数(K)', type: 'number' },
  { key: 'keywordsAI', title: 'Keywords-AI', tooltip: 'AI关键词', type: 'string' },
  { key: 'level', title: 'Level', tooltip: 'KOL等级', type: 'string' },
  { key: 'engagementRate', title: 'Engagement Rate(%)', tooltip: '互动率(%)', type: 'number' },
  { key: 'averageViewsK', title: 'Average Views(K)', tooltip: '平均观看数(K)', type: 'number' },
  { key: 'averageLikesK', title: 'Average Likes(K)', tooltip: '平均点赞数(K)', type: 'number' },
  { key: 'averageCommentsK', title: 'Average Comments(K)', tooltip: '平均评论数(K)', type: 'number' },
  { key: 'mostUsedHashtags', title: 'Most Used Hashtags', tooltip: '常用标签', type: 'string' },
  { key: 'slug', title: 'Slug', tooltip: '短链接', type: 'string' },
  { key: 'creatorId', title: 'Creator ID', tooltip: '创作者ID', type: 'string' }
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

// 添加一个获取枚举值样式的函数
const getEnumStyle = (value: string, type: string) => {
  switch (type) {
    case 'gender':
      return value === 'MALE' 
        ? 'bg-blue-100 text-blue-800' 
        : 'bg-pink-100 text-pink-800';
    case 'platform':
      switch (value) {
        case 'TikTok':
          return 'bg-purple-100 text-purple-800';
        case 'Instagram':
          return 'bg-orange-100 text-orange-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    case 'language':
      switch (value) {
        case 'Chinese':
          return 'bg-red-100 text-red-800';
        case 'English':
          return 'bg-blue-100 text-blue-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    case 'sendStatus':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isColumnSelectorOpen, setIsColumnSelectorOpen] = useState(false);
  
  const filterRef = useRef<HTMLDivElement>(null);
  const columnSelectorRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
      if (columnSelectorRef.current && !columnSelectorRef.current.contains(event.target as Node)) {
        setIsColumnSelectorOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 使用 React Query 获取数据
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['kols', currentPage, pageSize, filters],
    queryFn: () => {
      // 打印日志，查看发送到API的筛选条件
      console.log('Sending filters to API:', filters);
      return fetchKOLs(currentPage, pageSize, filters);
    }
  });

  useEffect(() => {
    console.log('Filters updated:', filters);
  }, [filters]);

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
        platform: updatedKol.platform,
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

      return api.kol.update(updatedKol.kolId, updateData);
    },
    onSuccess: () => {
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
    mutationFn: (id: string) => api.kol.delete(id),
    onSuccess: () => {
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
    mutationFn: (newKol: Omit<KOL, 'id'>) => api.kol.create(newKol),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kols'] });
      toast.success('KOL 创建成功');
    },
    onError: (error) => {
      console.error('Error creating KOL:', error);
      toast.error('KOL 创建失败');
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

  const handleCreate = async (newKol: Omit<KOL, 'id'>) => {
    await createKolMutation.mutateAsync(newKol);
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
      <div className="flex justify-end items-center space-x-4 mb-6">
        <div ref={filterRef}>
          <TableFilter
            columns={columns}
            onFilterChange={setFilters}
            isOpen={isFilterOpen}
            onToggle={() => setIsFilterOpen(!isFilterOpen)}
          />
        </div>
        <div ref={columnSelectorRef}>
          <TableColumnSelector
            columns={columns}
            visibleColumns={visibleColumns}
            onColumnToggle={handleColumnToggle}
            isOpen={isColumnSelectorOpen}
            onToggle={() => setIsColumnSelectorOpen(!isColumnSelectorOpen)}
          />
        </div>
        <button 
          className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg flex items-center space-x-2 hover:bg-gray-200 transition-colors"
        >
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
              {data?.items.map((kol: KOL, rowIndex: number) => (
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
                          <span>{kol.name || '-'}</span>
                        </div>
                      ) : column.key === 'kolId' ? (
                        <div className="flex items-center justify-between">
                          <span>{kol.kolId || '-'}</span>
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
                      ) : column.type === 'enum' ? (
                        <span className={`px-2.5 py-1 text-xs leading-5 font-medium rounded-full ${getEnumStyle((kol as any)[column.key], column.key)}`}>
                          {(kol as any)[column.key] || '-'}
                        </span>
                      ) : column.key === 'keywordsAI' || column.key === 'mostUsedHashtags' ? (
                        <div className="max-w-md truncate">
                          {kol.operational[column.key as keyof KOLOperationalData]?.length > 0
                            ? renderTags(
                                kol.operational[column.key as keyof KOLOperationalData] as string[],
                                (kol.operational[column.key as keyof KOLOperationalData] as string[])?.length || 0
                              )
                            : '-'
                          }
                        </div>
                      ) : column.key === 'level' ? (
                        <span className="px-2.5 py-1 text-xs leading-4 font-medium rounded-full bg-green-100 text-green-800">
                          {kol.operational.level || '-'}
                        </span>
                      ) : column.key === 'sendStatus' ? (
                        <span className={`px-2.5 py-1 text-xs leading-4 font-medium rounded-full ${getEnumStyle(kol.operational.sendStatus || '', 'sendStatus')}`}>
                          {kol.operational.sendStatus || '-'}
                        </span>
                      ) : column.key === 'sendDate' || column.key === 'exportDate' ? (
                        <div className="text-gray-900">
                          {kol.operational[column.key as keyof KOLOperationalData] instanceof Date
                            ? (kol.operational[column.key as keyof KOLOperationalData] as Date).toLocaleString()
                            : '-'}
                        </div>
                      ) : column.type === 'number' ? (
                        <div className="text-gray-900 font-medium">
                          {(kol as any)[column.key] ? `${(kol as any)[column.key]}${column.key.includes('Rate') ? '%' : 'K'}` : '-'}
                        </div>
                      ) : (
                        <div className="text-gray-900">
                          {(kol as any)[column.key] || '-'}
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
          platform: 'TikTok',
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