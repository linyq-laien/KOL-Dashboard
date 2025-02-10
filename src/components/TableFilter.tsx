import React, { useState, useEffect } from 'react';
import { Filter, X, Plus } from 'lucide-react';

// 定义字段类型
type FieldType = 'string' | 'enum' | 'number' | 'date';

// 定义枚举选项接口
interface EnumOption {
  value: string;
  label: string;
}

// 扩展Column接口
interface Column {
  key: string;
  title: string;
  tooltip?: string;
  type: FieldType;
  enumOptions?: EnumOption[];
}

interface FilterCondition {
  id: string;
  column: string;
  operator: string;
  value: string | number;
}

interface Props {
  columns: Column[];
  onFilterChange: (filters: Array<{ column: string; operator: string; value: string | number }>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

// 操作符定义
const OPERATORS = [
  { value: 'greater', label: '大于' },
  { value: 'less', label: '小于' },
  { value: 'equal', label: '等于' },
  { value: 'not_equal', label: '不等于' },
  { value: 'is_null', label: '为空' },
  { value: 'is_not_null', label: '不为空' }
];

// 字段映射表
const COLUMN_MAPPING: { [key: string]: string } = {
  followersK: 'followers_k',
  sendStatus: 'send_status',
  // 添加其他需要的字段映射
};

// 根据字段类型获取可用的操作符
const getOperatorsByType = (type: FieldType): typeof OPERATORS => {
  switch (type) {
    case 'number':
      return OPERATORS;  // 数值类型支持所有操作符
    case 'date':
      return OPERATORS;  // 日期类型支持所有操作符
    case 'enum':
      return OPERATORS.filter(op => ['equal', 'not_equal', 'is_null', 'is_not_null'].includes(op.value));
    default:
      return OPERATORS.filter(op => ['equal', 'not_equal', 'is_null', 'is_not_null'].includes(op.value));
  }
};

// 添加一个检查值是否有效的辅助函数
const isValidFilterValue = (condition: FilterCondition, columnDef?: Column): boolean => {
  // 为空和不为空操作符不需要检查值
  if (['is_null', 'is_not_null'].includes(condition.operator)) {
    return true;
  }

  // 如果没有找到列定义，认为无效
  if (!columnDef) {
    return false;
  }

  // 根据不同类型进行检查
  switch (columnDef.type) {
    case 'number':
      // 数字类型：只要是有效数字即可
      return !isNaN(Number(condition.value));
    case 'date':
      // 日期类型：如果有值，必须是有效日期
      return condition.value === '' || !isNaN(new Date(condition.value).getTime());
    case 'enum':
      // 枚举类型：值必须在选项中或为空
      return condition.value === '' || Boolean(condition.value);
    default:
      // 字符串类型：任何值都是有效的，包括空字符串
      return true;
  }
};

export default function TableFilter({ columns, onFilterChange, isOpen: externalIsOpen, onToggle }: Props) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isModified, setIsModified] = useState(false);
  
  // 使用外部或内部的状态
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const toggleOpen = onToggle || (() => setInternalIsOpen(!internalIsOpen));

  // 从 sessionStorage 读取初始筛选条件
  const [filterConditions, setFilterConditions] = useState<FilterCondition[]>(() => {
    const savedFilters = sessionStorage.getItem('tableFilterConditions');
    if (savedFilters) {
      const parsedFilters = JSON.parse(savedFilters);
      // 初始化时立即应用已存在的筛选条件
      setTimeout(() => {
        const formattedFilters = formatFiltersForAPI(parsedFilters);
        onFilterChange(formattedFilters);
      }, 0);
      return parsedFilters;
    }
    return [];
  });

  // 监听弹窗关闭事件
  useEffect(() => {
    if (!isOpen && isModified) {
      applyFilters();
      setIsModified(false);
    }
  }, [isOpen]);

  // 当筛选条件改变时保存到 sessionStorage
  useEffect(() => {
    if (filterConditions.length > 0) {
      sessionStorage.setItem('tableFilterConditions', JSON.stringify(filterConditions));
    } else {
      sessionStorage.removeItem('tableFilterConditions');
    }
  }, [filterConditions]);

  // 修改格式化筛选条件的辅助函数
  const formatFiltersForAPI = (conditions: FilterCondition[]) => {
    const validFilters = conditions.filter(condition => {
      const columnDef = columns.find(col => col.key === condition.column);
      return isValidFilterValue(condition, columnDef);
    });

    return validFilters.map(({ column, operator, value }) => {
      const columnDef = columns.find(col => col.key === column);
      let processedValue = value;
      let processedColumn = COLUMN_MAPPING[column] || column;

      if (columnDef?.type === 'number') {
        processedValue = Number(value);
      } else if (columnDef?.type === 'date') {
        processedValue = value ? new Date(value).toISOString() : '';
      } else {
        processedValue = value.toString();
      }

      if (['is_null', 'is_not_null'].includes(operator)) {
        processedValue = operator === 'is_null' ? '' : 'not_null';
      }

      return {
        column: processedColumn,
        operator,
        value: processedValue
      };
    });
  };

  const addFilterCondition = () => {
    const newCondition: FilterCondition = {
      id: Math.random().toString(36).substr(2, 9),
      column: columns[0].key,
      operator: 'equal',
      value: ''
    };
    setFilterConditions([...filterConditions, newCondition]);
    setIsModified(true);
  };

  const removeFilterCondition = (id: string) => {
    const newConditions = filterConditions.filter(condition => condition.id !== id);
    setFilterConditions(newConditions);
    setIsModified(true);
  };

  const updateFilterCondition = (
    id: string,
    field: 'column' | 'operator' | 'value',
    value: string | number
  ) => {
    setFilterConditions(prevConditions => {
      const newConditions = prevConditions.map(condition => {
        if (condition.id === id) {
          if (field === 'column') {
            return {
              ...condition,
              column: value as string,
              operator: 'equal',
              value: ''
            };
          }
          if (field === 'operator') {
            return {
              ...condition,
              operator: value as string,
              value: ['is_null', 'is_not_null'].includes(value as string) ? '' : condition.value
            };
          }

          const columnDef = columns.find(col => col.key === condition.column);
          let processedValue = value;

          if (columnDef?.type === 'number' && value !== '') {
            processedValue = Number(value);
          }

          return { ...condition, [field]: processedValue };
        }
        return condition;
      });

      setIsModified(true);
      return newConditions;
    });
  };

  const applyFilters = () => {
    const formattedFilters = formatFiltersForAPI(filterConditions);
    
    // 只保存有效的筛选条件
    if (formattedFilters.length > 0) {
      // 找出有效的筛选条件
      const validConditions = filterConditions.filter(condition => {
        const columnDef = columns.find(col => col.key === condition.column);
        return isValidFilterValue(condition, columnDef);
      });
      
      // 更新 filterConditions 状态
      setFilterConditions(validConditions);
      
      // 保存到 sessionStorage
      sessionStorage.setItem('tableFilterConditions', JSON.stringify(validConditions));
    } else {
      // 如果没有有效的筛选条件，清空所有状态
      setFilterConditions([]);
      sessionStorage.removeItem('tableFilterConditions');
    }
    
    onFilterChange(formattedFilters);
  };

  const clearAllFilters = () => {
    setFilterConditions([]);
    sessionStorage.removeItem('tableFilterConditions');
    onFilterChange([]);
    setIsModified(false);
    // 关闭弹窗
    if (onToggle) {
      onToggle();
    } else {
      setInternalIsOpen(false);
    }
  };

  // 渲染值输入组件
  const renderValueInput = (condition: FilterCondition, column: Column) => {
    if (['is_null', 'is_not_null'].includes(condition.operator)) {
      return null;
    }

    switch (column.type) {
      case 'enum':
        return (
          <select
            value={condition.value}
            onChange={(e) => updateFilterCondition(condition.id, 'value', e.target.value)}
            className="block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="" className="text-gray-400" disabled>
              请选择{column.title}
            </option>
            {column.enumOptions?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'number':
        return (
          <input
            type="number"
            value={condition.value}
            onChange={(e) => updateFilterCondition(condition.id, 'value', e.target.value)}
            placeholder={`请输入${column.title}`}
            className="block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm placeholder-gray-400"
          />
        );
      case 'date':
        return (
          <input
            type="date"
            value={condition.value}
            onChange={(e) => updateFilterCondition(condition.id, 'value', e.target.value)}
            className="block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm placeholder-gray-400"
          />
        );
      default:
        return (
          <input
            type="text"
            value={condition.value}
            onChange={(e) => updateFilterCondition(condition.id, 'value', e.target.value)}
            placeholder={`请输入${column.title}`}
            className="block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm placeholder-gray-400"
          />
        );
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleOpen}
        className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg flex items-center space-x-2 hover:bg-gray-200 transition-colors"
      >
        <Filter size={20} />
        <span>筛选{filterConditions.length > 0 ? ` (${filterConditions.length})` : ''}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 p-4 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[400px] z-50">
          <div className="space-y-4">
            {filterConditions.map((condition) => {
              const selectedColumn = columns.find(col => col.key === condition.column);
              return (
                <div key={condition.id} className="flex items-center space-x-2">
                  {/* 字段选择 */}
                  <select
                    value={condition.column}
                    onChange={(e) => updateFilterCondition(condition.id, 'column', e.target.value)}
                    className="block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="" className="text-gray-400" disabled>
                      请选择筛选字段
                    </option>
                    {columns.map((column) => (
                      <option key={column.key} value={column.key}>
                        {column.title}
                      </option>
                    ))}
                  </select>

                  {/* 操作符选择 */}
                  <select
                    value={condition.operator}
                    onChange={(e) => updateFilterCondition(condition.id, 'operator', e.target.value)}
                    className="block w-1/4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="" className="text-gray-400" disabled>
                      请选择操作符
                    </option>
                    {selectedColumn && getOperatorsByType(selectedColumn.type).map((operator) => (
                      <option key={operator.value} value={operator.value}>
                        {operator.label}
                      </option>
                    ))}
                  </select>

                  {/* 值输入 */}
                  {selectedColumn && renderValueInput(condition, selectedColumn)}

                  {/* 删除按钮 */}
                  <button
                    onClick={() => removeFilterCondition(condition.id)}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                </div>
              );
            })}

            {/* 添加筛选条件按钮 */}
            <button
              onClick={addFilterCondition}
              className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600"
            >
              <Plus size={16} />
              <span>添加筛选条件</span>
            </button>

            {/* 底部按钮 */}
            {filterConditions.length > 0 && (
              <div className="flex justify-start pt-4">
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 text-gray-600 hover:text-red-600"
                >
                  清除全部
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}