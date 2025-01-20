import React from 'react';
import { Search as SearchIcon } from 'lucide-react';

export default function Search() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Search KOLs</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, location, or tags..."
              className="w-full px-4 py-3 pl-12 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <SearchIcon className="absolute left-4 top-3.5 text-gray-400" size={20} />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Filters</h3>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Followers Range
                </label>
                <div className="flex space-x-4">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Enter location"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Advanced Filters</h3>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Engagement Rate
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Content Type
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span className="ml-2 text-sm text-gray-700">Livestream</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span className="ml-2 text-sm text-gray-700">Short Video</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span className="ml-2 text-sm text-gray-700">Post</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
              Reset
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}