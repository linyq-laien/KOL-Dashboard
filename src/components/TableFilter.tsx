import React from 'react';
import { Filter } from 'lucide-react';

interface FilterConfig {
  column: string;
  value: string;
  operator: string;
}

interface TableFilterProps {
  columns: { key: string; title: string }[];
  onFilterChange: (filters: FilterConfig[]) => void;
}

export default function TableFilter({ columns, onFilterChange }: TableFilterProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [filters, setFilters] = React.useState<FilterConfig[]>([]);

  const operators = [
    { value: 'equals', label: '等于' },
    { value: 'contains', label: '包含' },
    { value: 'greater', label: '大于' },
    { value: 'less', label: '小于' },
  ];

  const addFilter = () => {
    const newFilter = {
      column: columns[0].key,
      operator: 'equals',
      value: '',
    };
    setFilters([...filters, newFilter]);
  };

  const updateFilter = (index: number, field: keyof FilterConfig, value: string) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const removeFilter = (index: number) => {
    const newFilters = filters.filter((_, i) => i !== index);
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center space-x-2 hover:bg-gray-200"
      >
        <Filter size={20} />
        <span>筛选</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-900">数据筛选</h3>
              <button
                onClick={addFilter}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                添加筛选条件
              </button>
            </div>

            <div className="space-y-4">
              {filters.map((filter, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <select
                    value={filter.column}
                    onChange={(e) => updateFilter(index, 'column', e.target.value)}
                    className="block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    {columns.map((column) => (
                      <option key={column.key} value={column.key}>
                        {column.title}
                      </option>
                    ))}
                  </select>

                  <select
                    value={filter.operator}
                    onChange={(e) => updateFilter(index, 'operator', e.target.value)}
                    className="block w-1/4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    {operators.map((op) => (
                      <option key={op.value} value={op.value}>
                        {op.label}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={filter.value}
                    onChange={(e) => updateFilter(index, 'value', e.target.value)}
                    className="block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="输入值"
                  />

                  <button
                    onClick={() => removeFilter(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    删除
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}