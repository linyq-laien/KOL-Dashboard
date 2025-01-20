import React, { useState, useMemo } from 'react';
import { Plus, Download } from 'lucide-react';
import type { KOL, KOLMetrics, KOLOperationalData } from '../types/kol';
import TableColumnSelector from '../components/TableColumnSelector';
import TableFilter from '../components/TableFilter';
import { useSidebar } from '../contexts/SidebarContext';
import PageLayout from '../components/PageLayout';

// 模拟数据生成函数
function generateMockData(count: number): KOL[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${i + 1}`,
    name: `KOL ${i + 1}`,
    email: `kol${i + 1}@example.com`,
    gender: i % 2 === 0 ? 'MALE' : 'FEMALE',
    language: i % 3 === 0 ? '中文' : '英文',
    location: i % 4 === 0 ? '上海' : '北京',
    source: i % 2 === 0 ? '小红书' : '抖音',
    accountLink: `https://example.com/kol${i + 1}`,
    creatorId: `creator${i + 1}`,
    metrics: {
      followersK: Math.floor(Math.random() * 1000),
      likesK: Math.floor(Math.random() * 500),
      meanViewsK: Math.floor(Math.random() * 300),
      medianViewsK: Math.floor(Math.random() * 280),
      engagementRate: +(Math.random() * 10).toFixed(2),
      averageViewsK: Math.floor(Math.random() * 400),
      averageLikesK: Math.floor(Math.random() * 100),
      averageCommentsK: Math.floor(Math.random() * 10)
    },
    operational: {
      sendStatus: i % 3 === 0 ? 'SENT' : i % 3 === 1 ? 'PENDING' : 'FAILED',
      level: i % 5 === 0 ? 'MEGA' : i % 5 === 1 ? 'MACRO' : i % 5 === 2 ? 'MID' : i % 5 === 3 ? 'MICRO' : 'NANO',
      keywordsAI: ['时尚', '美妆', '生活方式'],
      mostUsedHashtags: ['#时尚', '#美妆', '#生活']
    },
    collaborations: []
  }));
}

const mockKOLs = generateMockData(20000);

interface Column {
  key: string;
  title: string;
}

const columns: Column[] = [
  { key: 'name', title: '姓名' },
  { key: 'email', title: '邮箱' },
  { key: 'gender', title: '性别' },
  { key: 'language', title: '语言' },
  { key: 'location', title: '地区' },
  { key: 'source', title: '平台来源' },
  { key: 'followersK', title: '粉丝数(K)' },
  { key: 'likesK', title: '获赞数(K)' },
  { key: 'engagementRate', title: '互动率' },
  { key: 'level', title: 'KOL等级' },
  { key: 'sendStatus', title: '发送状态' },
  { key: 'keywordsAI', title: 'AI关键词' },
  { key: 'mostUsedHashtags', title: '常用标签' }
];

export default function KOLManagement() {
  const { isCollapsed } = useSidebar();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [visibleColumns, setVisibleColumns] = useState(columns.map(col => col.key));
  const [filters, setFilters] = useState<any[]>([]);

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

  return (
    <PageLayout
      title="KOL 管理"
      description="管理和监控您的KOL资源"
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
                      {column.key === 'keywordsAI' || column.key === 'mostUsedHashtags' ? (
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
    </PageLayout>
  );
}