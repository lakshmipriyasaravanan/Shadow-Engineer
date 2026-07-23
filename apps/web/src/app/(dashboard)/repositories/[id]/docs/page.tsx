"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FileText, Plus, Network, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MermaidViewer from '@/components/MermaidViewer';

export default function DocsPage() {
  const params = useParams();
  const repoId = params.id as string;
  const { token } = useAuth();
  
  const [artifacts, setArtifacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArtifact, setSelectedArtifact] = useState<any | null>(null);

  const fetchArtifacts = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/v1/repositories/${repoId}/artifacts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setArtifacts(data.filter((a: any) => a.type === 'DOCUMENTATION' || a.type === 'DIAGRAM'));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtifacts();
  }, [repoId]);

  const generateArtifact = async (type: string, title: string) => {
    setLoading(true);
    // 1. Create Artifact in Spring Boot
    const res = await fetch(`http://localhost:8080/api/v1/repositories/${repoId}/artifacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ type, title })
    });
    const newArtifact = await res.json();
    
    // 2. Trigger AI Generation
    await fetch(`http://localhost:8000/api/v1/generate/artifact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        repository_id: repoId,
        artifact_id: newArtifact.id,
        type: type,
        title: title
      })
    });
    
    fetchArtifacts();
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      
      {/* Sidebar: List of Docs/Diagrams */}
      <div className="w-1/3 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="font-bold dark:text-white flex items-center gap-2">
            <FileText size={18} /> Documentation Hub
          </h2>
        </div>
        
        <div className="p-4 space-y-2 border-b border-gray-200 dark:border-gray-700">
          <button onClick={() => generateArtifact('DOCUMENTATION', 'Repository Onboarding Guide')} className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-sm font-semibold flex items-center gap-2">
            <Plus size={16} /> Generate Onboarding Guide
          </button>
          <button onClick={() => generateArtifact('DIAGRAM', 'System Architecture Diagram')} className="w-full text-left px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded text-sm font-semibold flex items-center gap-2">
            <Network size={16} /> Generate Architecture Diagram
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <p className="text-gray-500 text-sm">Loading...</p>
          ) : artifacts.length === 0 ? (
            <p className="text-gray-500 text-sm">No documentation generated yet.</p>
          ) : (
            artifacts.map(a => (
              <div 
                key={a.id} 
                onClick={() => setSelectedArtifact(a)}
                className={`p-3 rounded cursor-pointer border ${selectedArtifact?.id === a.id ? 'border-purple-500 bg-purple-50 dark:bg-gray-700' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                <div className="flex items-center gap-2">
                  {a.type === 'DIAGRAM' ? <Network size={16} className="text-purple-500" /> : <FileText size={16} className="text-blue-500" />}
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{a.title}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">Status: {a.status}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
        {selectedArtifact ? (
          <>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
              <h3 className="font-bold text-lg dark:text-white">{selectedArtifact.title}</h3>
              {selectedArtifact.status === 'COMPLETED' && (
                <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  <Download size={20} />
                </button>
              )}
            </div>
            <div className="flex-1 p-6 overflow-y-auto prose prose-sm dark:prose-invert max-w-none">
              {selectedArtifact.status === 'PENDING' ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4"></div>
                  <p>AI is generating this artifact. Please wait...</p>
                </div>
              ) : selectedArtifact.type === 'DIAGRAM' ? (
                <MermaidViewer chart={selectedArtifact.content.replace(/```mermaid\n?/g, '').replace(/```\n?/g, '')} />
              ) : (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {selectedArtifact.content}
                </ReactMarkdown>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <FileText size={48} className="mb-4 text-gray-300 dark:text-gray-600" />
            <p>Select a document or diagram to view</p>
          </div>
        )}
      </div>
    </div>
  );
}
