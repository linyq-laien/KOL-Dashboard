import React from 'react';
import { Save } from 'lucide-react';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">General Settings</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Dashboard Name
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  defaultValue="KOL Dashboard"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Default Currency
                </label>
                <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                  <option>CNY (¥)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Time Zone
                </label>
                <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  <option>UTC</option>
                  <option>UTC+8 (Beijing)</option>
                  <option>UTC-5 (Eastern)</option>
                  <option>UTC+1 (Central European)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
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
                    Email Notifications
                  </label>
                  <p className="text-sm text-gray-500">
                    Receive email notifications for important updates
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
                    Desktop Notifications
                  </label>
                  <p className="text-sm text-gray-500">
                    Show desktop notifications for real-time updates
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-3 bg-gray-50 flex justify-end rounded-b-lg">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <Save size={20} />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
}