import React, { useState, useMemo } from 'react';
import { Plus, Download } from 'lucide-react';
import type { KOL } from '../types/kol';
import TableColumnSelector from '../components/TableColumnSelector';
import TableFilter from '../components/TableFilter';

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

const columns = [
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
          : kol[filter.column];

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">KOL 管理</h1>
        <div className="flex space-x-3">
          <TableFilter
            columns={columns}
            onFilterChange={setFilters}
          />
          <TableColumnSelector
            columns={columns}
            visibleColumns={visibleColumns}
            onColumnToggle={handleColumnToggle}
          />
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center space-x-2 hover:bg-gray-200">
            <Download size={20} />
            <span>导出</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <Plus size={20} />
            <span>添加 KOL</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.filter(col => visibleColumns.includes(col.key)).map((column) => (
                  <th
                    key={column.key}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      column.key === 'name' ? 'sticky left-0 bg-gray-50 z-10' : ''
                    }`}
                  >
                    {column.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((kol) => (
                <tr key={kol.id} className="hover:bg-gray-50">
                  {columns.filter(col => visibleColumns.includes(col.key)).map((column) => (
                    <td
                      key={column.key}
                      className={`px-6 py-4 whitespace-nowrap ${
                        column.key === 'name' ? 'sticky left-0 bg-white z-10' : ''
                      }`}
                    >
                      {column.key === 'keywordsAI' || column.key === 'mostUsedHashtags' ? (
                        <div className="flex flex-wrap gap-1">
                          {kol.operational[column.key]?.map((tag: string, index: number) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-gray-100 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : column.key === 'level' ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {kol.operational.level}
                        </span>
                      ) : column.key === 'sendStatus' ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {kol.operational.sendStatus}
                        </span>
                      ) : column.key.endsWith('K') ? (
                        <div className="text-sm text-gray-900">
                          {kol.metrics[column.key]}K
                        </div>
                      ) : column.key === 'engagementRate' ? (
                        <div className="text-sm text-gray-900">
                          {kol.metrics.engagementRate}%
                        </div>
                      ) : (
                        <div className="text-sm text-gray-900">
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

        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">
              每页显示
            </span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded border-gray-300"
            >
              {[10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-700">
              条 | 总计 {filteredData.length} 条
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50"
            >
              首页
            </button>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50"
            >
              上一页
            </button>
            <span className="text-sm text-gray-700">
              第 {currentPage} 页 / 共 {totalPages} 页
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50"
            >
              下一页
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50"
            >
              末页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}