import React from 'react';
import { Settings2 } from 'lucide-react';

interface Column {
  key: string;
  title: string;
}

interface TableColumnSelectorProps {
  columns: Column[];
  visibleColumns: string[];
  onColumnToggle: (columnKey: string) => void;
}

export default function TableColumnSelector({
  columns,
  visibleColumns,
  onColumnToggle,
}: TableColumnSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center space-x-2 hover:bg-gray-200"
      >
        <Settings2 size={20} />
        <span>列设置</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">显示/隐藏列</h3>
            <div className="space-y-2">
              {columns.map((column) => (
                <label key={column.key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={visibleColumns.includes(column.key)}
                    onChange={() => onColumnToggle(column.key)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{column.title}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}