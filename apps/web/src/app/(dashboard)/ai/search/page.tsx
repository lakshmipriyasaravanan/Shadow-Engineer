"use client";

import { useState } from 'react';

export default function SemanticSearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:8000/api/v1/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Hardcoding a demo repository_id for testing
        body: JSON.stringify({ repository_id: 'demo-repo-id-123', query, limit: 3 }),
      });

      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setResults(data.results || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold dark:text-white">Semantic Search Preview</h2>
      
      <form onSubmit={handleSearch} className="flex gap-2">
        <input 
          type="text" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="E.g. How does the authentication middleware work?"
          className="flex-1 rounded border p-3 text-black"
          required
        />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <div className="text-red-500">{error}</div>}

      <div className="space-y-4">
        {results.map((result, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded shadow border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-mono bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded text-blue-600 dark:text-blue-400">
                {result.file_path}
              </span>
              <span className="text-xs text-gray-500">Score: {result.score.toFixed(3)}</span>
            </div>
            <pre className="text-sm overflow-x-auto p-2 bg-gray-50 dark:bg-gray-900 rounded text-gray-800 dark:text-gray-300">
              <code>{result.text}</code>
            </pre>
          </div>
        ))}
        {!loading && results.length === 0 && query && (
          <p className="text-gray-500 text-center py-8">No context found.</p>
        )}
      </div>
    </div>
  );
}
