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

// 定义平台选项
const PLATFORM_OPTIONS = [
  { value: 'TikTok', label: 'TikTok' },
  { value: 'Instagram', label: 'Instagram' },
  // ... 其他平台
];

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
    if (!kol) return;
    
    setIsLoading(true);
    try {
      await onDelete?.(kol.kolId);
      toast.success('KOL 删除成功');
      onClose();
    } catch (error) {
      console.error('Error deleting KOL:', error);
      toast.error('删除失败: ' + (error instanceof Error ? error.message : '未知错误'));
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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* 背景遮罩 */}
      <div 
        className="fixed inset-0 bg-black opacity-30"
        onClick={onClose}
      />

      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white rounded-xl shadow-lg max-w-4xl w-full p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {mode === 'create' ? '创建 KOL' : '编辑 KOL'}
            </h2>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* 基本信息 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">基本信息</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    KOL ID
                  </label>
                  <input
                    type="text"
                    value={editedKol?.kolId || ''}
                    readOnly={mode === 'edit'}
                    onChange={(e) => mode === 'create' && setEditedKol(prev => prev ? {...prev, kolId: e.target.value} : null)}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                      mode === 'edit' ? 'bg-gray-50 cursor-not-allowed text-gray-500' : ''
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    名称
                  </label>
                  <input
                    type="text"
                    value={editedKol?.name || ''}
                    onChange={(e) => setEditedKol(prev => prev ? {...prev, name: e.target.value} : null)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    平台
                  </label>
                  <select
                    value={editedKol?.platform || ''}
                    onChange={(e) => handleFieldChange('platform', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    {PLATFORM_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    邮箱
                  </label>
                  <input
                    type="email"
                    value={editedKol?.email || ''}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
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
                  <label className="block text-sm font-medium text-gray-700">
                    性别
                  </label>
                  <select
                    value={editedKol?.gender || ''}
                    onChange={(e) => handleFieldChange('gender', e.target.value)}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
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
                  <label className="block text-sm font-medium text-gray-700">
                    语言
                  </label>
                  <select
                    value={editedKol?.language || ''}
                    onChange={(e) => setEditedKol(prev => prev ? {...prev, language: e.target.value} : null)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="English">English</option>
                    <option value="Chinese">Chinese</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    位置
                  </label>
                  <input
                    type="text"
                    value={editedKol?.location || ''}
                    onChange={(e) => setEditedKol(prev => prev ? {...prev, location: e.target.value} : null)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    来源
                  </label>
                  <select
                    value={editedKol?.source || ''}
                    onChange={(e) => handleFieldChange('source', e.target.value)}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
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
                  <label className="block text-sm font-medium text-gray-700">
                    账号链接
                  </label>
                  <input
                    type="url"
                    value={editedKol?.accountLink || ''}
                    onChange={(e) => handleFieldChange('accountLink', e.target.value)}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
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
                  <label className="block text-sm font-medium text-gray-700">
                    过滤器
                  </label>
                  <input
                    type="text"
                    value={editedKol?.filter || ''}
                    onChange={(e) => setEditedKol(prev => prev ? {...prev, filter: e.target.value} : null)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* 运营信息 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">运营信息</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    等级
                  </label>
                  <select
                    value={editedKol?.operational.level || ''}
                    onChange={(e) => handleFieldChange('operational.level', e.target.value as any)}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                      (fieldErrors['operational.level'] || validationErrors['operational.level']) ? 'border-red-500' : ''
                    }`}
                  >
                    <option value="">请选择等级</option>
                    {levelOptions.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {(fieldErrors['operational.level'] || validationErrors['operational.level']) && (
                    <p className="mt-1 text-sm text-red-600">
                      {fieldErrors['operational.level'] || validationErrors['operational.level']}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    发送状态
                  </label>
                  <select
                    value={editedKol?.operational.sendStatus || ''}
                    onChange={(e) => handleFieldChange('operational.sendStatus', e.target.value as any)}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                  >
                    {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
                      <option key={num} value={`Round No.${num}`}>Round No.{num}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    发送日期
                  </label>
                  <input
                    type="datetime-local"
                    value={formatDateToLocal(editedKol?.operational.sendDate)}
                    onChange={(e) => {
                      handleFieldChange('operational.sendDate', e.target.value ? parseLocalToUTC(e.target.value) : undefined, 'operational');
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    导出日期
                  </label>
                  <input
                    type="datetime-local"
                    value={formatDateToLocal(editedKol?.operational.exportDate)}
                    onChange={(e) => {
                      handleFieldChange('operational.exportDate', e.target.value ? parseLocalToUTC(e.target.value) : undefined, 'operational');
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* 按钮组 */}
            <div className="flex justify-end space-x-4 pt-4 border-t">
              {mode === 'edit' && onDelete && !showDeleteConfirm && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 text-red-600 hover:text-red-700 font-medium"
                >
                  删除
                </button>
              )}
              {showDeleteConfirm ? (
                <>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      '确认删除'
                    )}
                  </button>
                </>
              ) : (
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  保存
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 