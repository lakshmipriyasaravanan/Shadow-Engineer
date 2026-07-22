"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <aside className="w-64 bg-white shadow-md dark:bg-gray-800">
        <div className="p-4 font-bold text-lg dark:text-white">Shadow Engineer</div>
        <nav className="mt-4 px-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <a href="/dashboard" className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Overview</a>
          <a href="/dashboard/teams" className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Teams</a>
          <a href="/dashboard/settings" className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Settings</a>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <header className="flex items-center justify-between bg-white p-4 shadow-sm dark:bg-gray-800">
          <h1 className="text-xl font-semibold dark:text-white">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm dark:text-gray-300">{user?.email}</span>
            <button onClick={logout} className="text-sm text-red-500 hover:underline">Logout</button>
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
