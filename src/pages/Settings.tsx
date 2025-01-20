import React from 'react';
import { Save } from 'lucide-react';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">设置</h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">基本设置</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  仪表盘名称
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  defaultValue="KOL仪表盘"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  默认货币
                </label>
                <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  <option>美元 ($)</option>
                  <option>欧元 (€)</option>
                  <option>英镑 (£)</option>
                  <option>人民币 (¥)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  时区
                </label>
                <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  <option>世界标准时间</option>
                  <option>北京时间 (UTC+8)</option>
                  <option>美东时间 (UTC-5)</option>
                  <option>中欧时间 (UTC+1)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <h3 className="text-lg font-medium text-gray-900">通知设置</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3">
                  <label className="text-sm font-medium text-gray-700">
                    邮件通知
                  </label>
                  <p className="text-sm text-gray-500">
                    接收重要更新的邮件通知
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3">
                  <label className="text-sm font-medium text-gray-700">
                    桌面通知
                  </label>
                  <p className="text-sm text-gray-500">
                    显示实时更新的桌面通知
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-3 bg-gray-50 flex justify-end rounded-b-lg">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <Save size={20} />
            <span>保存更改</span>
          </button>
        </div>
      </div>
    </div>
  );
}