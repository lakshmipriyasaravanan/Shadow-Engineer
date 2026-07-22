"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { GitPullRequest, Activity, Shield, Code2 } from 'lucide-react';

export default function PRListPage() {
  const params = useParams();
  const repoId = params.id as string;
  const router = useRouter();
  const { token } = useAuth();
  const [prs, setPrs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPRs = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/v1/repositories/${repoId}/prs`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) setPrs(await res.json());
      } finally {
        setLoading(false);
      }
    };
    fetchPRs();
  }, [repoId, token]);

  const triggerSync = async () => {
    // In production, token comes from connected accounts DB. 
    // Sending hardcoded mock token to pass controller validation for prototype.
    setLoading(true);
    await fetch(`http://localhost:8080/api/v1/repositories/${repoId}/prs/sync`, {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${token}`,
        'X-GitHub-Token': 'mock_gh_token' 
      }
    });
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
          <GitPullRequest /> Pull Requests
        </h2>
        <button 
          onClick={triggerSync}
          className="bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-gray-900 flex items-center gap-2"
        >
          <Activity size={16} /> Sync from GitHub
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {loading ? (
          <p className="p-6 text-gray-500">Loading PRs...</p>
        ) : prs.length === 0 ? (
          <p className="p-6 text-gray-500">No Pull Requests synced. Click sync above.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">PR #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">State</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">AI Review</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {prs.map(pr => (
                <tr key={pr.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">#{pr.number}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">{pr.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{pr.author}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <span className="bg-green-100 text-green-800 px-2 inline-flex text-xs leading-5 font-semibold rounded-full">{pr.state}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button 
                      onClick={() => router.push(`/dashboard/repositories/${repoId}/prs/${pr.id}`)}
                      className="text-purple-600 hover:text-purple-900 font-semibold"
                    >
                      View AI Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
