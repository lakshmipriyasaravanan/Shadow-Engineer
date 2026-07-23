"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Activity, HardDrive } from 'lucide-react';

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/v1/admin/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) setStats(await res.json());
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (loading) return <div>Loading Admin Stats...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold dark:text-white">Global Platform Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 border-blue-500 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-semibold uppercase">Total Registered Users</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats?.totalUsers || 0}</p>
          </div>
          <Users size={48} className="text-blue-100 dark:text-blue-900" />
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 border-purple-500 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-semibold uppercase">Total AI Events Fired</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats?.totalAiEvents || 0}</p>
          </div>
          <Activity size={48} className="text-purple-100 dark:text-purple-900" />
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 border-green-500 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-semibold uppercase">System Health</p>
            <p className="text-3xl font-bold text-green-500 mt-2">Operational</p>
          </div>
          <HardDrive size={48} className="text-green-100 dark:text-green-900" />
        </div>
      </div>
    </div>
  );
}
