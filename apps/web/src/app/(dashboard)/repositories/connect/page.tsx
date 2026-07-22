"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function ConnectGithubPage() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { token: jwt } = useAuth();

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:8080/api/v1/github/test-connection', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`
        },
        body: JSON.stringify({ personalAccessToken: token }),
      });

      if (!res.ok) throw new Error('Invalid Token or Connection Failed');
      
      router.push('/dashboard/repositories');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold dark:text-white">Connect to GitHub</h2>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          To clone and analyze your repositories, Shadow Engineer needs a GitHub Personal Access Token (PAT) with `repo` scopes.
        </p>
        
        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

        <form onSubmit={handleConnect} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Personal Access Token</label>
            <input
              type="password"
              required
              className="mt-1 w-full rounded border p-2 text-black"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxx"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black dark:bg-white dark:text-black text-white py-2 rounded hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Connect GitHub'}
          </button>
        </form>
      </div>
    </div>
  );
}
