"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldAlert, Zap, BookOpen, Play } from 'lucide-react';

export default function PRReviewPage() {
  const params = useParams();
  const repoId = params.id as string;
  const prId = params.prId as string;
  const { token } = useAuth();
  
  const [review, setReview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchReview = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/v1/repositories/${repoId}/prs/${prId}/review`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Parse the embedded AI JSON response
        if (data.aiCommentsJson) {
          data.parsedJson = JSON.parse(data.aiCommentsJson);
        }
        setReview(data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReview();
  }, [prId]);

  const triggerReview = async () => {
    setLoading(true);
    await fetch(`http://localhost:8000/api/v1/review/trigger`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        repository_id: repoId,
        pull_request_id: prId,
        github_pr_id: 1 // mock
      })
    });
    // Wait for async queue then refresh
    setTimeout(fetchReview, 2000);
  };

  if (loading) return <div>Loading AI Review...</div>;

  if (!review || review.status === 'PENDING') {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-gray-500">No AI Review exists for this Pull Request.</p>
        <button 
          onClick={triggerReview}
          className="bg-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-purple-700 flex items-center gap-2"
        >
          <Play size={16} /> Run AI Code Review
        </button>
      </div>
    );
  }

  const aiData = review.parsedJson;

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-2">AI Executive Summary</h2>
        <p className="text-gray-300">{aiData?.executiveSummary}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-t-4 border-red-500 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Security Score</p>
            <p className="text-2xl font-bold text-red-600">{aiData?.securityScore}/100</p>
          </div>
          <ShieldAlert size={32} className="text-red-100" />
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-t-4 border-yellow-500 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Maintainability Score</p>
            <p className="text-2xl font-bold text-yellow-600">{aiData?.maintainabilityScore}/100</p>
          </div>
          <BookOpen size={32} className="text-yellow-100" />
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-t-4 border-green-500 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Performance Score</p>
            <p className="text-2xl font-bold text-green-600">{aiData?.performanceScore}/100</p>
          </div>
          <Zap size={32} className="text-green-100" />
        </div>
      </div>

      <h3 className="text-xl font-bold dark:text-white mt-8">Inline Comments & Suggestions</h3>
      <div className="space-y-4">
        {aiData?.comments?.map((comment: any, idx: number) => (
          <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-2">
              <span className="font-mono text-sm bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded text-blue-600">{comment.filePath}</span>
              <span className={`text-xs px-2 py-1 rounded font-bold ${comment.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {comment.severity}
              </span>
            </div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">{comment.reason}</p>
            <div className="mt-4 bg-gray-50 dark:bg-gray-900 p-3 rounded">
              <p className="text-sm font-mono text-gray-600 dark:text-gray-400">Suggestion: {comment.suggestion}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
