"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { TestTube, Play, Download, CheckCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function TestsPage() {
  const params = useParams();
  const repoId = params.id as string;
  const { token } = useAuth();
  
  const [artifacts, setArtifacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArtifacts = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/v1/repositories/${repoId}/artifacts?type=TEST`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setArtifacts(await res.json());
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtifacts();
  }, [repoId]);

  const generateTests = async () => {
    setLoading(true);
    const title = `Unit Tests - ${new Date().toISOString().substring(0, 10)}`;
    const res = await fetch(`http://localhost:8080/api/v1/repositories/${repoId}/artifacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ type: 'TEST', title })
    });
    const newArtifact = await res.json();
    
    await fetch(`http://localhost:8000/api/v1/generate/artifact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        repository_id: repoId,
        artifact_id: newArtifact.id,
        type: 'TEST',
        title: title
      })
    });
    
    fetchArtifacts();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
          <TestTube /> AI Test Generation
        </h2>
        <button 
          onClick={generateTests}
          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 flex items-center gap-2"
        >
          <Play size={16} /> Generate Test Suite
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <p className="text-gray-500">Loading generated tests...</p>
        ) : artifacts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg text-center text-gray-500 shadow border border-gray-200 dark:border-gray-700">
            <TestTube size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p>No tests have been generated yet. Click the button above to generate a suite.</p>
          </div>
        ) : (
          artifacts.map((a) => (
            <div key={a.id} className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CheckCircle className={a.status === 'COMPLETED' ? 'text-green-500' : 'text-gray-400'} size={20} />
                  <h3 className="font-bold dark:text-white">{a.title}</h3>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">Status: {a.status}</span>
                  {a.status === 'COMPLETED' && (
                    <button className="text-gray-500 hover:text-blue-500 transition-colors">
                      <Download size={18} />
                    </button>
                  )}
                </div>
              </div>
              <div className="p-4 prose prose-sm dark:prose-invert max-w-none">
                {a.status === 'PENDING' ? (
                  <p className="text-gray-500 italic">Generating exhaustive test cases. This may take a few minutes...</p>
                ) : (
                  <ReactMarkdown>{a.content}</ReactMarkdown>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
