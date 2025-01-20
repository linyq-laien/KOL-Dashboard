import React from 'react';
import { BarChart2, TrendingUp, DollarSign } from 'lucide-react';

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <div className="flex space-x-3">
          <select className="px-4 py-2 bg-white border border-gray-300 rounded-lg">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>Last year</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Engagement Rate</p>
              <p className="text-2xl font-semibold mt-1">4.8%</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-full">
              <TrendingUp className="text-white" size={24} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-500 text-sm font-medium">+2.3%</span>
            <span className="text-gray-600 text-sm ml-2">vs last period</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Campaign ROI</p>
              <p className="text-2xl font-semibold mt-1">287%</p>
            </div>
            <div className="p-3 bg-green-500 rounded-full">
              <DollarSign className="text-white" size={24} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-500 text-sm font-medium">+15.2%</span>
            <span className="text-gray-600 text-sm ml-2">vs last period</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Campaigns</p>
              <p className="text-2xl font-semibold mt-1">156</p>
            </div>
            <div className="p-3 bg-purple-500 rounded-full">
              <BarChart2 className="text-white" size={24} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-500 text-sm font-medium">+8.2%</span>
            <span className="text-gray-600 text-sm ml-2">vs last period</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Performance by Platform</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Chart placeholder
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Engagement Trends</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Chart placeholder
          </div>
        </div>
      </div>
    </div>
  );
}