export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-wider">Shadow Admin</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <a href="/admin" className="block px-4 py-2 rounded hover:bg-gray-800 transition-colors">Global Dashboard</a>
          <a href="/admin/audit-logs" className="block px-4 py-2 rounded hover:bg-gray-800 transition-colors">Audit Logs</a>
          <a href="/dashboard" className="block px-4 py-2 rounded hover:bg-gray-800 transition-colors text-purple-400 mt-8">← Back to App</a>
        </nav>
      </aside>

      {/* Admin Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
