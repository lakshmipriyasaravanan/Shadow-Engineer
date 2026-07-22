"use client";

import { useRouter } from 'next/navigation';

export default function AIDashboardPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold dark:text-white">AI Knowledge Engine Dashboard</h2>
        <button 
          onClick={() => router.push('/dashboard/ai/search')}
          className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700"
        >
          Test Semantic Search
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Qdrant Status */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-t-4 border-blue-500">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg dark:text-white">Qdrant Vector DB</h3>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Connected</span>
          </div>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <p>Collection: <span className="font-mono">repository_knowledge</span></p>
            <p>Total Vectors: <strong>142,501</strong></p>
            <p>Vector Dimension: <strong>1536</strong> (text-embedding-3-small)</p>
          </div>
        </div>

        {/* Redis Worker Status */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-t-4 border-red-500">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg dark:text-white">Indexing Queue (Redis)</h3>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Healthy</span>
          </div>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <p>Active Workers: <strong>3</strong></p>
            <p>Jobs in Queue: <strong>0</strong></p>
            <p>Jobs Completed: <strong>12</strong></p>
          </div>
        </div>

        {/* LLM Gateway Status */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-t-4 border-green-500">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg dark:text-white">LLM Gateway</h3>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Online</span>
          </div>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <p>Provider: <strong>OpenAI</strong></p>
            <p>Model: <strong>gpt-4o</strong></p>
            <p>Latency: <strong>1.2s</strong> avg</p>
          </div>
        </div>
      </div>
    </div>
  );
}
