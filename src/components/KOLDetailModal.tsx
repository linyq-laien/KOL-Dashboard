import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, User, Mail, Globe, MapPin, Link, Filter, Tag, Users, Heart, Eye, BarChart2, TrendingUp, Calendar, Send } from 'lucide-react';
import type { KOL } from '../types/kol';
import { useTimeZone, getTimeZoneOffset } from '../contexts/TimeZoneContext';
import { toast } from 'react-hot-toast';

interface KOLDetailModalProps {
  kol: KOL | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedKol: KOL) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  mode?: 'edit' | 'create';
}

// 添加验证函数
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const validateNumber = (value: number, min: number, max: number) => {
  return value >= min && value <= max;
};

const genderOptions = ['MALE', 'FEMALE', 'LGBT'];
const languageOptions = ['English', 'Chinese'];
const levelOptions = ['Mid 50k-500k', 'Micro 10k-50k', 'Nano 1-10k'];
const sourceOptions = ['Collabstr', 'Manual', 'Creable', 'Heepsy'];

export default function KOLDetailModal({
  kol,
  isOpen,
  onClose,
  onSave,
  onDelete,
  mode = 'edit'
}: KOLDetailModalProps) {
  const [editedKol, setEditedKol] = useState<KOL | null>(null);
  const [activeTab, setActiveTab] = useState('basic'); // basic, metrics, operational
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const { timeZone } = useTimeZone();

  useEffect(() => {
    setEditedKol(kol);
    // 重置字段错误
    setFieldErrors({});
  }, [kol]);

  if (!isOpen || !kol) return null;

  // 修改验证函数
  const validateField = (field: string, value: any) => {
    const errors: Record<string, string> = {};
    
    switch (field) {
      case 'email':
        if (value && !validateEmail(value)) {
          errors.email = '请输入正确的邮箱格式';
        }
        break;
      case 'gender':
        if (value && !genderOptions.includes(value)) {
          errors.gender = `性别必须是以下选项之一: ${genderOptions.join(', ')}`;
        }
        break;
      case 'language':
        if (value && !languageOptions.includes(value)) {
          errors.language = `语言必须是以下选项之一: ${languageOptions.join(', ')}`;
        }
        break;
      case 'level':
        if (value && !levelOptions.includes(value)) {
          errors.level = `等级必须是以下选项之一: ${levelOptions.join(', ')}`;
        }
        break;
      case 'source':
        if (value && !sourceOptions.includes(value)) {
          errors.source = `来源必须是以下选项之一: ${sourceOptions.join(', ')}`;
        }
        break;
      case 'accountLink':
        if (value && !validateUrl(value)) {
          errors.accountLink = '请输入正确的URL格式';
        }
        break;
      case 'followersK':
      case 'likesK':
      case 'meanViewsK':
      case 'medianViewsK':
        if (value && !validateNumber(Number(value), 0, 1000000)) {
          errors[field] = '数值必须在 0-1000000 之间';
        }
        break;
      case 'engagementRate':
        if (value && !validateNumber(Number(value), 0, 100)) {
          errors.engagementRate = '互动率必须在 0-100% 之间';
        }
        break;
    }

    // 更新验证错误状态
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      if (Object.keys(errors).length > 0) {
        newErrors[field] = errors[field];
      } else {
        delete newErrors[field];
      }
      return newErrors;
    });
    
    return Object.keys(errors).length === 0;
  };

  const handleFieldChange = (field: string, value: any, section?: string) => {
    validateField(field, value);
    
    if (section === 'metrics') {
      setEditedKol(prev => prev ? {
        ...prev,
        metrics: {...prev.metrics, [field]: value}
      } : null);
    } else if (section === 'operational') {
      setEditedKol(prev => prev ? {
        ...prev,
        operational: {...prev.operational, [field]: value}
      } : null);
    } else {
      setEditedKol(prev => prev ? {...prev, [field]: value} : null);
    }
  };

  const handleSave = () => {
    if (!editedKol) return;

    // 确保 accountLink 是字符串类型
    const processedKol = {
      ...editedKol,
      accountLink: editedKol.accountLink ? editedKol.accountLink.toString() : '',
    };

    if (mode === 'create') {
      onSave(processedKol);
    } else {
      onSave(processedKol);
    }
    onClose();
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete?.(kol.id);
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
              <h2 className="text-xl font-semibold text-gray-900">
                {mode === 'create' ? 'Add New KOL / 添加KOL' : 'KOL Details / KOL详情'}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {mode === 'create' ? 'Create a new KOL / 创建新的KOL' : 'View and edit KOL information / 查看和编辑KOL信息'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {mode === 'edit' && onDelete && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg flex items-center space-x-2 hover:bg-red-100 transition-colors"
                disabled={isLoading}
              >
                <Trash2 size={18} />
                <span>删除</span>
              </button>
            )}
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
              <span>{mode === 'create' ? '创建' : '保存'}</span>
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
                      readOnly={mode === 'edit'}
                      onChange={(e) => mode === 'create' && setEditedKol(prev => prev ? {...prev, kolId: e.target.value} : null)}
                      className={`w-full px-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        mode === 'edit' ? 'bg-gray-50 cursor-not-allowed text-gray-500' : ''
                      }`}
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
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      className={`w-full px-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        (fieldErrors['email'] || validationErrors['email']) ? 'border-red-500' : ''
                      }`}
                      placeholder="请输入邮箱地址"
                    />
                    {(fieldErrors['email'] || validationErrors['email']) && (
                      <p className="mt-1 text-sm text-red-600">
                        {fieldErrors['email'] || validationErrors['email']}
                      </p>
                    )}
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
                      className="w-full px-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
                    <textarea
                      value={editedKol?.bio || ''}
                      onChange={(e) => setEditedKol(prev => prev ? {...prev, bio: e.target.value} : null)}
                      rows={3}
                      className="w-full px-2 py-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      onChange={(e) => handleFieldChange('gender', e.target.value)}
                      className={`w-full px-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        (fieldErrors['gender'] || validationErrors['gender']) ? 'border-red-500' : ''
                      }`}
                    >
                      <option value="">请选择性别</option>
                      {genderOptions.map(option => (
                        <option key={option} value={option}>
                          {option === 'MALE' ? '男' : option === 'FEMALE' ? '女' : 'LGBT'}
                        </option>
                      ))}
                    </select>
                    {(fieldErrors['gender'] || validationErrors['gender']) && (
                      <p className="mt-1 text-sm text-red-600">
                        {fieldErrors['gender'] || validationErrors['gender']}
                      </p>
                    )}
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
                      className="w-full px-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    <select
                      value={editedKol?.source || ''}
                      onChange={(e) => handleFieldChange('source', e.target.value)}
                      className={`w-full px-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        (fieldErrors['source'] || validationErrors['source']) ? 'border-red-500' : ''
                      }`}
                    >
                      <option value="">请选择来源平台</option>
                      {sourceOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    {(fieldErrors['source'] || validationErrors['source']) && (
                      <p className="mt-1 text-sm text-red-600">
                        {fieldErrors['source'] || validationErrors['source']}
                      </p>
                    )}
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
                      onChange={(e) => handleFieldChange('accountLink', e.target.value)}
                      className={`w-full px-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        (fieldErrors['accountLink'] || validationErrors['accountLink']) ? 'border-red-500' : ''
                      }`}
                      placeholder="请输入账号链接 (https://...)"
                    />
                    {(fieldErrors['accountLink'] || validationErrors['accountLink']) && (
                      <p className="mt-1 text-sm text-red-600">
                        {fieldErrors['accountLink'] || validationErrors['accountLink']}
                      </p>
                    )}
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
                      className="w-full px-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        onChange={(e) => handleFieldChange('followersK', Number(e.target.value), 'metrics')}
                        className={`w-full px-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          (fieldErrors['followersK'] || validationErrors['followersK']) ? 'border-red-500' : ''
                        }`}
                        min="0"
                        max="1000000"
                        step="0.1"
                      />
                      <p className="text-xs text-blue-600 mt-1">Thousand (K)</p>
                      {(fieldErrors['followersK'] || validationErrors['followersK']) && (
                        <p className="mt-1 text-sm text-red-600">
                          {fieldErrors['followersK'] || validationErrors['followersK']}
                        </p>
                      )}
                    </div>
                    <div className="bg-pink-50 rounded-xl p-4">
                      <div className="flex items-center space-x-2 text-pink-600 mb-1">
                        <Heart size={16} />
                        <span className="text-sm font-medium">Likes</span>
                      </div>
                      <input
                        type="number"
                        value={editedKol?.metrics.likesK || 0}
                        onChange={(e) => handleFieldChange('likesK', Number(e.target.value), 'metrics')}
                        className={`w-full px-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                          (fieldErrors['likesK'] || validationErrors['likesK']) ? 'border-red-500' : ''
                        }`}
                        min="0"
                        max="1000000"
                        step="0.1"
                      />
                      <p className="text-xs text-pink-600 mt-1">Thousand (K)</p>
                      {(fieldErrors['likesK'] || validationErrors['likesK']) && (
                        <p className="mt-1 text-sm text-red-600">
                          {fieldErrors['likesK'] || validationErrors['likesK']}
                        </p>
                      )}
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4">
                      <div className="flex items-center space-x-2 text-purple-600 mb-1">
                        <Eye size={16} />
                        <span className="text-sm font-medium">Mean Views</span>
                      </div>
                      <input
                        type="number"
                        value={editedKol?.metrics.meanViewsK || 0}
                        onChange={(e) => handleFieldChange('meanViewsK', Number(e.target.value), 'metrics')}
                        className={`w-full px-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          (fieldErrors['meanViewsK'] || validationErrors['meanViewsK']) ? 'border-red-500' : ''
                        }`}
                        min="0"
                        max="1000000"
                        step="0.1"
                      />
                      <p className="text-xs text-purple-600 mt-1">Thousand (K)</p>
                      {(fieldErrors['meanViewsK'] || validationErrors['meanViewsK']) && (
                        <p className="mt-1 text-sm text-red-600">
                          {fieldErrors['meanViewsK'] || validationErrors['meanViewsK']}
                        </p>
                      )}
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
                        onChange={(e) => handleFieldChange('engagementRate', Number(e.target.value), 'metrics')}
                        className={`w-full px-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          (fieldErrors['engagementRate'] || validationErrors['engagementRate']) ? 'border-red-500' : ''
                        }`}
                        min="0"
                        max="100"
                      />
                      <p className="text-xs text-green-600 mt-1">Percentage (%)</p>
                      {(fieldErrors['engagementRate'] || validationErrors['engagementRate']) && (
                        <p className="mt-1 text-sm text-red-600">
                          {fieldErrors['engagementRate'] || validationErrors['engagementRate']}
                        </p>
                      )}
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
                        onChange={(e) => handleFieldChange('medianViewsK', Number(e.target.value), 'metrics')}
                        className={`w-full px-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          (fieldErrors['medianViewsK'] || validationErrors['medianViewsK']) ? 'border-red-500' : ''
                        }`}
                        min="0"
                        max="1000000"
                        step="0.1"
                      />
                      {(fieldErrors['medianViewsK'] || validationErrors['medianViewsK']) && (
                        <p className="mt-1 text-sm text-red-600">
                          {fieldErrors['medianViewsK'] || validationErrors['medianViewsK']}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Average Views (K)</label>
                      <input
                        type="number"
                        value={editedKol?.metrics.averageViewsK || 0}
                        onChange={(e) => handleFieldChange('averageViewsK', Number(e.target.value), 'metrics')}
                        className={`w-full px-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          (fieldErrors['averageViewsK'] || validationErrors['averageViewsK']) ? 'border-red-500' : ''
                        }`}
                        min="0"
                        max="1000000"
                        step="0.1"
                      />
                      {(fieldErrors['averageViewsK'] || validationErrors['averageViewsK']) && (
                        <p className="mt-1 text-sm text-red-600">
                          {fieldErrors['averageViewsK'] || validationErrors['averageViewsK']}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Average Likes (K)</label>
                      <input
                        type="number"
                        value={editedKol?.metrics.averageLikesK || 0}
                        onChange={(e) => handleFieldChange('averageLikesK', Number(e.target.value), 'metrics')}
                        className={`w-full px-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          (fieldErrors['averageLikesK'] || validationErrors['averageLikesK']) ? 'border-red-500' : ''
                        }`}
                        min="0"
                        max="1000000"
                        step="0.1"
                      />
                      {(fieldErrors['averageLikesK'] || validationErrors['averageLikesK']) && (
                        <p className="mt-1 text-sm text-red-600">
                          {fieldErrors['averageLikesK'] || validationErrors['averageLikesK']}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Average Comments (K)</label>
                      <input
                        type="number"
                        value={editedKol?.metrics.averageCommentsK || 0}
                        onChange={(e) => handleFieldChange('averageCommentsK', Number(e.target.value), 'metrics')}
                        className={`w-full px-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          (fieldErrors['averageCommentsK'] || validationErrors['averageCommentsK']) ? 'border-red-500' : ''
                        }`}
                        min="0"
                        max="1000000"
                        step="0.1"
                      />
                      {(fieldErrors['averageCommentsK'] || validationErrors['averageCommentsK']) && (
                        <p className="mt-1 text-sm text-red-600">
                          {fieldErrors['averageCommentsK'] || validationErrors['averageCommentsK']}
                        </p>
                      )}
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
                      onChange={(e) => handleFieldChange('level', e.target.value as any, 'operational')}
                      className={`w-full px-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        (fieldErrors['level'] || validationErrors['level']) ? 'border-red-500' : ''
                      }`}
                    >
                      <option value="">请选择等级</option>
                      {levelOptions.map(option => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {(fieldErrors['level'] || validationErrors['level']) && (
                      <p className="mt-1 text-sm text-red-600">
                        {fieldErrors['level'] || validationErrors['level']}
                      </p>
                    )}
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
                      onChange={(e) => handleFieldChange('sendStatus', e.target.value as any, 'operational')}
                      className={`w-full px-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        (fieldErrors['sendStatus'] || validationErrors['sendStatus']) ? 'border-red-500' : ''
                      }`}
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
                        handleFieldChange('sendDate', e.target.value ? parseLocalToUTC(e.target.value) : undefined, 'operational');
                      }}
                      className="w-full px-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        handleFieldChange('exportDate', e.target.value ? parseLocalToUTC(e.target.value) : undefined, 'operational');
                      }}
                      className="w-full px-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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