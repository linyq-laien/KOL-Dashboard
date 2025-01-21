import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, User, Mail, Globe, MapPin, Link, Filter, Tag, Users, Heart, Eye, BarChart2, TrendingUp, Calendar, Send } from 'lucide-react';
import type { KOL } from '../types/kol';
import { useTimeZone, getTimeZoneOffset } from '../contexts/TimeZoneContext';

interface KOLDetailModalProps {
  kol: KOL | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedKol: KOL) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function KOLDetailModal({
  kol,
  isOpen,
  onClose,
  onSave,
  onDelete
}: KOLDetailModalProps) {
  const [editedKol, setEditedKol] = useState<KOL | null>(null);
  const [activeTab, setActiveTab] = useState('basic'); // basic, metrics, operational
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { timeZone } = useTimeZone();

  useEffect(() => {
    setEditedKol(kol);
  }, [kol]);

  if (!isOpen || !kol) return null;

  const handleSave = async () => {
    if (editedKol) {
      setIsLoading(true);
      try {
        await onSave(editedKol);
        onClose();
      } catch (error) {
        console.error('Error saving KOL:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete(kol.id);
      onClose();
    } catch (error) {
      console.error('Error deleting KOL:', error);
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info / 基本信息', icon: User },
    { id: 'metrics', label: 'Metrics / 数据指标', icon: BarChart2 },
    { id: 'operational', label: 'Operational / 运营数据', icon: TrendingUp }
  ];

  // 转换时间显示
  const formatDateToLocal = (date: Date | undefined) => {
    if (!date) return '';
    const offset = getTimeZoneOffset(timeZone);
    const localDate = new Date(date.getTime() + (offset * 60 - date.getTimezoneOffset()) * 60000);
    return localDate.toISOString().slice(0, 16);
  };

  // 从本地时间转换为 UTC
  const parseLocalToUTC = (dateString: string) => {
    if (!dateString) return undefined;
    const offset = getTimeZoneOffset(timeZone);
    const date = new Date(dateString);
    return new Date(date.getTime() - offset * 60 * 60000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 z-60 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">确认删除</h3>
            <p className="text-gray-600 mb-6">
              您确定要删除这个 KOL 吗？此操作不可恢复。
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={isLoading}
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Trash2 size={18} />
                )}
                <span>确认删除</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden animate-modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 bg-gradient-to-r from-blue-50 to-blue-100/50 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <User size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">KOL Details / KOL详情</h2>
              <p className="text-sm text-gray-500 mt-0.5">View and edit KOL information / 查看和编辑KOL信息</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-lg flex items-center space-x-2 hover:bg-red-100 transition-colors"
              disabled={isLoading}
            >
              <Trash2 size={18} />
              <span>删除</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save size={18} />
              )}
              <span>保存</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-8 py-4 bg-white border-b border-gray-200">
          <div className="flex space-x-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${activeTab === tab.id 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-12rem)] space-y-6">
          {/* Basic Information */}
          {activeTab === 'basic' && (
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-3 bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-200">
                <div className="px-6 py-4">
                  <h3 className="text-base font-medium text-gray-900">Profile Information / 个人资料</h3>
                </div>
                <div className="px-6 py-4 grid grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <div className="flex items-center space-x-2">
                        <User size={16} className="text-gray-400" />
                        <span>KOL ID</span>
                      </div>
                    </label>
                    <input
                      type="text"
                      value={editedKol?.kolId || ''}
                      readOnly
                      className="w-full rounded-lg border-gray-300 bg-gray-50 cursor-not-allowed text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <div className="flex items-center space-x-2">
                        <Mail size={16} className="text-gray-400" />
                        <span>Email</span>
                      </div>
                    </label>
                    <input
                      type="email"
                      value={editedKol?.email || ''}
                      onChange={(e) => setEditedKol(prev => prev ? {...prev, email: e.target.value} : null)}
                      className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <div className="flex items-center space-x-2">
                        <User size={16} className="text-gray-400" />
                        <span>Name</span>
                      </div>
                    </label>
                    <input
                      type="text"
                      value={editedKol?.name || ''}
                      onChange={(e) => setEditedKol(prev => prev ? {...prev, name: e.target.value} : null)}
                      className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
                    <textarea
                      value={editedKol?.bio || ''}
                      onChange={(e) => setEditedKol(prev => prev ? {...prev, bio: e.target.value} : null)}
                      rows={3}
                      className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter KOL's bio..."
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-3 bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-200">
                <div className="px-6 py-4">
                  <h3 className="text-base font-medium text-gray-900">Additional Information / 附加信息</h3>
                </div>
                <div className="px-6 py-4 grid grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <div className="flex items-center space-x-2">
                        <Users size={16} className="text-gray-400" />
                        <span>Gender / 性别</span>
                      </div>
                    </label>
                    <select
                      value={editedKol?.gender || ''}
                      onChange={(e) => setEditedKol(prev => prev ? {...prev, gender: e.target.value as 'MALE' | 'FEMALE'} : null)}
                      className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="MALE">Male / 男</option>
                      <option value="FEMALE">Female / 女</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <div className="flex items-center space-x-2">
                        <Globe size={16} className="text-gray-400" />
                        <span>Language</span>
                      </div>
                    </label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <div className="flex items-center space-x-2">
                        <MapPin size={16} className="text-gray-400" />
                        <span>Location</span>
                      </div>
                    </label>
                    <input
                      type="text"
                      value={editedKol?.location || ''}
                      onChange={(e) => setEditedKol(prev => prev ? {...prev, location: e.target.value} : null)}
                      className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-3 bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-200">
                <div className="px-6 py-4">
                  <h3 className="text-base font-medium text-gray-900">Platform Information / 平台信息</h3>
                </div>
                <div className="px-6 py-4 grid grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <div className="flex items-center space-x-2">
                        <Globe size={16} className="text-gray-400" />
                        <span>Source</span>
                      </div>
                    </label>
                    <input
                      type="text"
                      value={editedKol?.source || ''}
                      onChange={(e) => setEditedKol(prev => prev ? {...prev, source: e.target.value} : null)}
                      className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <div className="flex items-center space-x-2">
                        <Link size={16} className="text-gray-400" />
                        <span>Account Link</span>
                      </div>
                    </label>
                    <input
                      type="url"
                      value={editedKol?.accountLink || ''}
                      onChange={(e) => setEditedKol(prev => prev ? {...prev, accountLink: e.target.value} : null)}
                      className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <div className="flex items-center space-x-2">
                        <Filter size={16} className="text-gray-400" />
                        <span>Filter</span>
                      </div>
                    </label>
                    <input
                      type="text"
                      value={editedKol?.filter || ''}
                      onChange={(e) => setEditedKol(prev => prev ? {...prev, filter: e.target.value} : null)}
                      className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Metrics */}
          {activeTab === 'metrics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-6">
                {/* Key Metrics */}
                <div className="col-span-4 bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-200">
                  <div className="px-6 py-4">
                    <h3 className="text-base font-medium text-gray-900">Key Metrics / 核心指标</h3>
                  </div>
                  <div className="p-6 grid grid-cols-4 gap-6">
                    <div className="bg-blue-50 rounded-xl p-4">
                      <div className="flex items-center space-x-2 text-blue-600 mb-1">
                        <Users size={16} />
                        <span className="text-sm font-medium">Followers</span>
                      </div>
                      <input
                        type="number"
                        value={editedKol?.metrics.followersK || 0}
                        onChange={(e) => setEditedKol(prev => prev ? {
                          ...prev,
                          metrics: {...prev.metrics, followersK: Number(e.target.value)}
                        } : null)}
                        className="w-full bg-white rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-blue-600 mt-1">Thousand (K)</p>
                    </div>
                    <div className="bg-pink-50 rounded-xl p-4">
                      <div className="flex items-center space-x-2 text-pink-600 mb-1">
                        <Heart size={16} />
                        <span className="text-sm font-medium">Likes</span>
                      </div>
                      <input
                        type="number"
                        value={editedKol?.metrics.likesK || 0}
                        onChange={(e) => setEditedKol(prev => prev ? {
                          ...prev,
                          metrics: {...prev.metrics, likesK: Number(e.target.value)}
                        } : null)}
                        className="w-full bg-white rounded-lg border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                      <p className="text-xs text-pink-600 mt-1">Thousand (K)</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4">
                      <div className="flex items-center space-x-2 text-purple-600 mb-1">
                        <Eye size={16} />
                        <span className="text-sm font-medium">Mean Views</span>
                      </div>
                      <input
                        type="number"
                        value={editedKol?.metrics.meanViewsK || 0}
                        onChange={(e) => setEditedKol(prev => prev ? {
                          ...prev,
                          metrics: {...prev.metrics, meanViewsK: Number(e.target.value)}
                        } : null)}
                        className="w-full bg-white rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <p className="text-xs text-purple-600 mt-1">Thousand (K)</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4">
                      <div className="flex items-center space-x-2 text-green-600 mb-1">
                        <TrendingUp size={16} />
                        <span className="text-sm font-medium">Engagement Rate</span>
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        value={editedKol?.metrics.engagementRate || 0}
                        onChange={(e) => setEditedKol(prev => prev ? {
                          ...prev,
                          metrics: {...prev.metrics, engagementRate: Number(e.target.value)}
                        } : null)}
                        className="w-full bg-white rounded-lg border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <p className="text-xs text-green-600 mt-1">Percentage (%)</p>
                    </div>
                  </div>
                </div>

                {/* Additional Metrics */}
                <div className="col-span-4 bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-200">
                  <div className="px-6 py-4">
                    <h3 className="text-base font-medium text-gray-900">Additional Metrics / 其他指标</h3>
                  </div>
                  <div className="p-6 grid grid-cols-4 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Median Views (K)</label>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Average Views (K)</label>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Average Likes (K)</label>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Average Comments (K)</label>
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
              </div>
            </div>
          )}

          {/* Operational */}
          {activeTab === 'operational' && (
            <div className="space-y-6">
              {/* Status Information */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-200">
                <div className="px-6 py-4">
                  <h3 className="text-base font-medium text-gray-900">Status Information / 状态信息</h3>
                </div>
                <div className="p-6 grid grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <div className="flex items-center space-x-2">
                        <TrendingUp size={16} className="text-gray-400" />
                        <span>Level / KOL等级</span>
                      </div>
                    </label>
                    <select
                      value={editedKol?.operational.level || ''}
                      onChange={(e) => setEditedKol(prev => prev ? {
                        ...prev,
                        operational: {...prev.operational, level: e.target.value as any}
                      } : null)}
                      className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Mid 50k-500k">Mid (50k-500k)</option>
                      <option value="Micro 10k-50k">Micro (10k-50k)</option>
                      <option value="Nano 1-10k">Nano (1-10k)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <div className="flex items-center space-x-2">
                        <Send size={16} className="text-gray-400" />
                        <span>Send Status / 发送状态</span>
                      </div>
                    </label>
                    <select
                      value={editedKol?.operational.sendStatus || ''}
                      onChange={(e) => setEditedKol(prev => prev ? {
                        ...prev,
                        operational: {...prev.operational, sendStatus: e.target.value as any}
                      } : null)}
                      className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
                        <option key={num} value={`Round No.${num}`}>Round No.{num}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span>Send Date</span>
                      </div>
                    </label>
                    <input
                      type="datetime-local"
                      value={formatDateToLocal(editedKol?.operational.sendDate)}
                      onChange={(e) => {
                        setEditedKol(prev => prev ? {
                          ...prev,
                          operational: {
                            ...prev.operational,
                            sendDate: e.target.value ? parseLocalToUTC(e.target.value) : undefined
                          }
                        } : null);
                      }}
                      className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span>Export Date</span>
                      </div>
                    </label>
                    <input
                      type="datetime-local"
                      value={formatDateToLocal(editedKol?.operational.exportDate)}
                      onChange={(e) => {
                        setEditedKol(prev => prev ? {
                          ...prev,
                          operational: {
                            ...prev.operational,
                            exportDate: e.target.value ? parseLocalToUTC(e.target.value) : undefined
                          }
                        } : null);
                      }}
                      className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-200">
                <div className="px-6 py-4">
                  <h3 className="text-base font-medium text-gray-900">Tags / 标签</h3>
                </div>
                <div className="p-6 grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <div className="flex items-center space-x-2">
                        <Tag size={16} className="text-gray-400" />
                        <span>Keywords AI</span>
                      </div>
                    </label>
                    <div className="flex flex-wrap gap-2 p-3 border rounded-lg min-h-[100px] bg-gray-50">
                      {editedKol?.operational.keywordsAI?.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-full inline-flex items-center"
                        >
                          <Tag size={14} className="mr-1.5" />
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <div className="flex items-center space-x-2">
                        <Tag size={16} className="text-gray-400" />
                        <span>Most Used Hashtags</span>
                      </div>
                    </label>
                    <div className="flex flex-wrap gap-2 p-3 border rounded-lg min-h-[100px] bg-gray-50">
                      {editedKol?.operational.mostUsedHashtags?.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-full inline-flex items-center"
                        >
                          <Tag size={14} className="mr-1.5" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 