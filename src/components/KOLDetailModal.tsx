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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">KOL Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          <div className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">KOL ID</label>
                  <input
                    type="text"
                    value={editedKol?.kolId || ''}
                    readOnly
                    className="w-full rounded-lg border-gray-300 bg-gray-50 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editedKol?.email || ''}
                    onChange={(e) => setEditedKol(prev => prev ? {...prev, email: e.target.value} : null)}
                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editedKol?.name || ''}
                    onChange={(e) => setEditedKol(prev => prev ? {...prev, name: e.target.value} : null)}
                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    value={editedKol?.bio || ''}
                    onChange={(e) => setEditedKol(prev => prev ? {...prev, bio: e.target.value} : null)}
                    rows={3}
                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={editedKol?.gender || ''}
                    onChange={(e) => setEditedKol(prev => prev ? {...prev, gender: e.target.value as 'MALE' | 'FEMALE'} : null)}
                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <select
                    value={editedKol?.language || ''}
                    onChange={(e) => setEditedKol(prev => prev ? {...prev, language: e.target.value} : null)}
                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="English">English</option>
                    <option value="Chinese">Chinese</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={editedKol?.location || ''}
                    onChange={(e) => setEditedKol(prev => prev ? {...prev, location: e.target.value} : null)}
                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Platform Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Platform Information</h3>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                  <input
                    type="text"
                    value={editedKol?.source || ''}
                    onChange={(e) => setEditedKol(prev => prev ? {...prev, source: e.target.value} : null)}
                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Link</label>
                  <input
                    type="url"
                    value={editedKol?.accountLink || ''}
                    onChange={(e) => setEditedKol(prev => prev ? {...prev, accountLink: e.target.value} : null)}
                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Filter</label>
                  <input
                    type="text"
                    value={editedKol?.filter || ''}
                    onChange={(e) => setEditedKol(prev => prev ? {...prev, filter: e.target.value} : null)}
                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Metrics</h3>
              <div className="grid grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Followers (K)</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Likes (K)</label>
                  <input
                    type="number"
                    value={editedKol?.metrics.likesK || 0}
                    onChange={(e) => setEditedKol(prev => prev ? {
                      ...prev,
                      metrics: {...prev.metrics, likesK: Number(e.target.value)}
                    } : null)}
                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mean Views (K)</label>
                  <input
                    type="number"
                    value={editedKol?.metrics.meanViewsK || 0}
                    onChange={(e) => setEditedKol(prev => prev ? {
                      ...prev,
                      metrics: {...prev.metrics, meanViewsK: Number(e.target.value)}
                    } : null)}
                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Median Views (K)</label>
                  <input
                    type="number"
                    value={editedKol?.metrics.medianViewsK || 0}
                    onChange={(e) => setEditedKol(prev => prev ? {
                      ...prev,
                      metrics: {...prev.metrics, medianViewsK: Number(e.target.value)}
                    } : null)}
                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Engagement Rate (%)</label>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Average Views (K)</label>
                  <input
                    type="number"
                    value={editedKol?.metrics.averageViewsK || 0}
                    onChange={(e) => setEditedKol(prev => prev ? {
                      ...prev,
                      metrics: {...prev.metrics, averageViewsK: Number(e.target.value)}
                    } : null)}
                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Average Likes (K)</label>
                  <input
                    type="number"
                    value={editedKol?.metrics.averageLikesK || 0}
                    onChange={(e) => setEditedKol(prev => prev ? {
                      ...prev,
                      metrics: {...prev.metrics, averageLikesK: Number(e.target.value)}
                    } : null)}
                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Average Comments (K)</label>
                  <input
                    type="number"
                    value={editedKol?.metrics.averageCommentsK || 0}
                    onChange={(e) => setEditedKol(prev => prev ? {
                      ...prev,
                      metrics: {...prev.metrics, averageCommentsK: Number(e.target.value)}
                    } : null)}
                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Operational Data */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Operational Data</h3>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                  <select
                    value={editedKol?.operational.level || ''}
                    onChange={(e) => setEditedKol(prev => prev ? {
                      ...prev,
                      operational: {...prev.operational, level: e.target.value as any}
                    } : null)}
                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="MEGA">Mega</option>
                    <option value="MACRO">Macro</option>
                    <option value="MID">Mid</option>
                    <option value="MICRO">Micro</option>
                    <option value="NANO">Nano</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Send Status</label>
                  <select
                    value={editedKol?.operational.sendStatus || ''}
                    onChange={(e) => setEditedKol(prev => prev ? {
                      ...prev,
                      operational: {...prev.operational, sendStatus: e.target.value as any}
                    } : null)}
                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="SENT">Sent</option>
                    <option value="PENDING">Pending</option>
                    <option value="FAILED">Failed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Send Date</label>
                  <input
                    type="datetime-local"
                    value={editedKol?.operational.sendDate ? new Date(editedKol.operational.sendDate).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setEditedKol(prev => prev ? {
                      ...prev,
                      operational: {...prev.operational, sendDate: new Date(e.target.value)}
                    } : null)}
                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Export Date</label>
                  <input
                    type="datetime-local"
                    value={editedKol?.operational.exportDate ? new Date(editedKol.operational.exportDate).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setEditedKol(prev => prev ? {
                      ...prev,
                      operational: {...prev.operational, exportDate: new Date(e.target.value)}
                    } : null)}
                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Tags</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Keywords AI</label>
                  <div className="flex flex-wrap gap-2 p-2 border rounded-lg min-h-[80px]">
                    {editedKol?.operational.keywordsAI?.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-2.5 py-1 text-sm bg-blue-50 text-blue-700 rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Most Used Hashtags</label>
                  <div className="flex flex-wrap gap-2 p-2 border rounded-lg min-h-[80px]">
                    {editedKol?.operational.mostUsedHashtags?.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2.5 py-1 text-sm bg-green-50 text-green-700 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
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
            <span>Delete</span>
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Save size={18} />
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  );
} 