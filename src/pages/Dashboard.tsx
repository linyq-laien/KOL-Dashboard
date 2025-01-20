import React from 'react';
import { Users, TrendingUp, DollarSign, BarChart2 } from 'lucide-react';

const stats = [
  {
    title: 'Total KOLs',
    value: '2,543',
    change: '+12.5%',
    icon: Users,
    color: 'bg-blue-500',
  },
  {
    title: 'Avg. Engagement Rate',
    value: '4.8%',
    change: '+2.3%',
    icon: TrendingUp,
    color: 'bg-green-500',
  },
  {
    title: 'Total Investment',
    value: '$1.2M',
    change: '+15.3%',
    icon: DollarSign,
    color: 'bg-purple-500',
  },
  {
    title: 'Active Campaigns',
    value: '156',
    change: '+8.2%',
    icon: BarChart2,
    color: 'bg-orange-500',
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-lg p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-green-500 text-sm font-medium">
                  {stat.change}
                </span>
                <span className="text-gray-600 text-sm ml-2">vs last month</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Top Performing KOLs</h3>
          {/* Add chart or table here */}
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Campaign Performance</h3>
          {/* Add chart or table here */}
        </div>
      </div>
    </div>
  );
}