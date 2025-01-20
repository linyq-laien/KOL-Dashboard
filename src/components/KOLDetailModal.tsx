import React from 'react';
import { X, Save, Trash2 } from 'lucide-react';
import type { KOL } from '../types/kol';

interface KOLDetailModalProps {
  kol: KOL | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedKol: KOL) => void;
  onDelete: (id: string) => void;
}

export default function KOLDetailModal({
  kol,
  isOpen,
  onClose,
  onSave,
  onDelete
}: KOLDetailModalProps) {
  const [editedKol, setEditedKol] = React.useState<KOL | null>(null);

  React.useEffect(() => {
    setEditedKol(kol);
  }, [kol]);

  if (!isOpen || !kol) return null;

  const handleSave = () => {
    if (editedKol) {
      onSave(editedKol);
      onClose();
    }
  };

  const handleDelete = () => {
    onDelete(kol.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">KOL 详情</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                <input
                  type="text"
                  value={editedKol?.name || ''}
                  onChange={(e) => setEditedKol(prev => prev ? {...prev, name: e.target.value} : null)}
                  className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                <input
                  type="email"
                  value={editedKol?.email || ''}
                  onChange={(e) => setEditedKol(prev => prev ? {...prev, email: e.target.value} : null)}
                  className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">性别</label>
                <select
                  value={editedKol?.gender || ''}
                  onChange={(e) => setEditedKol(prev => prev ? {...prev, gender: e.target.value} : null)}
                  className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="MALE">男</option>
                  <option value="FEMALE">女</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">语言</label>
                <select
                  value={editedKol?.language || ''}
                  onChange={(e) => setEditedKol(prev => prev ? {...prev, language: e.target.value} : null)}
                  className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="中文">中文</option>
                  <option value="英文">英文</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">数据指标</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">粉丝数(K)</label>
                  <input
                    type="number"
                    value={editedKol?.metrics.followersK || 0}
                    onChange={(e) => setEditedKol(prev => prev ? {
                      ...prev,
                      metrics: {...prev.metrics, followersK: Number(e.target.value)}
                    } : null)}
                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">互动率(%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editedKol?.metrics.engagementRate || 0}
                    onChange={(e) => setEditedKol(prev => prev ? {
                      ...prev,
                      metrics: {...prev.metrics, engagementRate: Number(e.target.value)}
                    } : null)}
                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">运营数据</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">KOL等级</label>
                  <select
                    value={editedKol?.operational.level || ''}
                    onChange={(e) => setEditedKol(prev => prev ? {
                      ...prev,
                      operational: {...prev.operational, level: e.target.value}
                    } : null)}
                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="MEGA">MEGA</option>
                    <option value="MACRO">MACRO</option>
                    <option value="MID">MID</option>
                    <option value="MICRO">MICRO</option>
                    <option value="NANO">NANO</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">发送状态</label>
                  <select
                    value={editedKol?.operational.sendStatus || ''}
                    onChange={(e) => setEditedKol(prev => prev ? {
                      ...prev,
                      operational: {...prev.operational, sendStatus: e.target.value}
                    } : null)}
                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="SENT">已发送</option>
                    <option value="PENDING">待发送</option>
                    <option value="FAILED">发送失败</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end px-6 py-4 border-t border-gray-200 space-x-3">
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-50 text-red-700 rounded-lg flex items-center space-x-2 hover:bg-red-100 transition-colors"
          >
            <Trash2 size={18} />
            <span>删除</span>
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Save size={18} />
            <span>保存</span>
          </button>
        </div>
      </div>
    </div>
  );
} 