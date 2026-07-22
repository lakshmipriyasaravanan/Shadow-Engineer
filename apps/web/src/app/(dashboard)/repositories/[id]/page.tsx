"use client";

import { useParams } from 'next/navigation';

export default function RepositoryDetailsPage() {
  const params = useParams();
  const repoId = params.id;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold dark:text-white">Repository Dashboard</h2>
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">SYNCED</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">Lines of Code</p>
          <p className="text-2xl font-bold dark:text-white">45,210</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Files</p>
          <p className="text-2xl font-bold dark:text-white">342</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">Functions</p>
          <p className="text-2xl font-bold dark:text-white">1,204</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">Avg Complexity</p>
          <p className="text-2xl font-bold dark:text-white">4.2</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 h-96 flex items-center justify-center">
        <p className="text-gray-500">File Explorer / Graph Visualization Placeholder</p>
      </div>
    </div>
  );
}
