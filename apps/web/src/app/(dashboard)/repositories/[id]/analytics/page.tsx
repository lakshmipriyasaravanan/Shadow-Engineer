"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { BarChart3, GitPullRequest, FileText, TestTube, Cpu, HeartPulse } from 'lucide-react';

export default function TenantAnalyticsPage() {
  const params = useParams();
  const repoId = params.id as string;
  const { token } = useAuth();
  
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/v1/repositories/${repoId}/analytics`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) setAnalytics(await res.json());
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [repoId, token]);

  if (loading) return <div>Loading Analytics...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
        <BarChart3 /> Repository Analytics & AI Insights
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Health Score */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-t-4 border-green-500 flex items-center justify-between col-span-1 md:col-span-2 lg:col-span-4">
          <div>
            <p className="text-gray-500 text-sm font-semibold uppercase">Repository AI Health Score</p>
            <div className="flex items-end gap-2 mt-2">
              <p className="text-5xl font-bold text-green-500">{analytics?.repositoryHealthScore}</p>
              <p className="text-gray-400 mb-1">/ 100</p>
            </div>
            <p className="text-sm text-gray-400 mt-2">Based on AI engagement, docs coverage, and PR reviews.</p>
          </div>
          <HeartPulse size={64} className="text-green-100 dark:text-green-900" />
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">PRs Reviewed by AI</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{analytics?.totalPrReviews}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg"><GitPullRequest className="text-blue-600" size={20} /></div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Docs/Diagrams Generated</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{analytics?.totalDocsGenerated}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg"><FileText className="text-purple-600" size={20} /></div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Test Suites Generated</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{analytics?.totalTestsGenerated}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg"><TestTube className="text-green-600" size={20} /></div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Tokens Consumed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{analytics?.tokensConsumed}</p>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg"><Cpu className="text-orange-600" size={20} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
