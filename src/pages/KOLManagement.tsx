import React, { useState, useMemo } from 'react';
import { Plus, Download, Eye } from 'lucide-react';
import type { KOL, KOLMetrics, KOLOperationalData } from '../types/kol';
import TableColumnSelector from '../components/TableColumnSelector';
import TableFilter from '../components/TableFilter';
import { useSidebar } from '../contexts/SidebarContext';
import PageLayout from '../components/PageLayout';
import KOLDetailModal from '../components/KOLDetailModal';

// 模拟数据生成函数
function generateMockData(count: number): KOL[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `kol${i + 1}`,
    kolId: `kol_${Math.random().toString(36).substring(7)}`,
    email: `${Math.random().toString(36).substring(7)}@example.com`,
    name: `KOL ${i + 1}`,
    bio: `Content creator focusing on ${i % 2 === 0 ? 'lifestyle' : 'fashion'}`,
    accountLink: `https://platform.com/user${i + 1}`,
    source: i % 3 === 0 ? 'TikTok' : i % 3 === 1 ? 'Instagram' : 'YouTube',
    filter: i % 2 === 0 ? 'nano-fitness' : 'diet-2603',
    gender: i % 2 === 0 ? 'MALE' : 'FEMALE',
    tag: ['lifestyle', 'fitness', 'health'][i % 3],
    language: i % 2 === 0 ? 'English' : 'Chinese',
    location: ['United States', 'United Kingdom', 'Canada', 'Australia'][i % 4],
    slug: `kol-${Math.random().toString(36).substring(7)}`,
    creatorId: Math.random().toString().slice(2, 18),
    metrics: {
      followersK: Number((Math.random() * 1000).toFixed(1)),
      likesK: Number((Math.random() * 800).toFixed(1)),
      meanViewsK: Number((Math.random() * 500).toFixed(1)),
      medianViewsK: Number((Math.random() * 400).toFixed(1)),
      engagementRate: Number((Math.random() * 15).toFixed(2)),
      averageViewsK: Number((Math.random() * 600).toFixed(1)),
      averageLikesK: Number((Math.random() * 200).toFixed(1)),
      averageCommentsK: Number((Math.random() * 20).toFixed(1))
    },
    operational: {
      sendStatus: i % 3 === 0 ? 'SENT' : i % 3 === 1 ? 'PENDING' : 'FAILED',
      sendDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
      exportDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
      level: i % 5 === 0 ? 'MEGA' : i % 5 === 1 ? 'MACRO' : i % 5 === 2 ? 'MID' : i % 5 === 3 ? 'MICRO' : 'NANO',
      keywordsAI: ['Coach', 'Champion', 'Fitness'][i % 3].split(','),
      mostUsedHashtags: ['#mentalhealth', '#selfcare', '#lifestyle'][i % 3].split(',')
    },
    collaborations: []
  }));
}

const mockKOLs = generateMockData(20000);

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
  const [filters, setFilters] = useState<any[]>([]);
  const [selectedKOL, setSelectedKOL] = useState<KOL | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleColumnToggle = (columnKey: string) => {
    if (visibleColumns.includes(columnKey)) {
      setVisibleColumns(visibleColumns.filter(key => key !== columnKey));
    } else {
      setVisibleColumns([...visibleColumns, columnKey]);
    }
  };

  const filteredData = useMemo(() => {
    return mockKOLs.filter(kol => {
      if (filters.length === 0) return true;
      
      return filters.every(filter => {
        const value = filter.column.includes('.')
          ? filter.column.split('.').reduce((obj: any, key: string) => obj?.[key], kol)
          : filter.column === 'followersK' || filter.column === 'likesK' || filter.column === 'engagementRate'
            ? kol.metrics[filter.column as keyof KOLMetrics]
            : filter.column === 'level' || filter.column === 'sendStatus'
              ? kol.operational[filter.column as keyof KOLOperationalData]
              : (kol as any)[filter.column];

        switch (filter.operator) {
          case 'equals':
            return String(value) === filter.value;
          case 'contains':
            return String(value).toLowerCase().includes(filter.value.toLowerCase());
          case 'greater':
            return Number(value) > Number(filter.value);
          case 'less':
            return Number(value) < Number(filter.value);
          default:
            return true;
        }
      });
    });
  }, [filters]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const handleSave = (updatedKol: KOL) => {
    // 在实际应用中,这里应该调用API更新数据
    console.log('Saving updated KOL:', updatedKol);
  };

  const handleDelete = (id: string) => {
    // 在实际应用中,这里应该调用API删除数据
    console.log('Deleting KOL:', id);
  };

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
              {paginatedData.map((kol, rowIndex) => (
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
                          ${kol.operational.sendStatus === 'SENT' 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : kol.operational.sendStatus === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                          } transition-colors`}
                        >
                          {kol.operational.sendStatus === 'SENT' ? '已发送' :
                           kol.operational.sendStatus === 'PENDING' ? '待发送' : '发送失败'}
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
              条 | 总计 {filteredData.length} 条
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
              第 {currentPage} 页 / 共 {totalPages} 页
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3.5 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
            >
              下一页
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
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