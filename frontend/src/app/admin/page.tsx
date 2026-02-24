'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import Navbar from '@/components/layout/Navbar';
import { Users, Settings, FileText } from 'lucide-react';

function AdminContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-900/5">
          <div className="mb-6 flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
              ADMIN
            </span>
          </div>

          <p className="mb-8 text-gray-600">
            Full system access granted. Manage users, configure system settings,
            and review audit logs.
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200 p-6 transition-colors hover:border-red-200 hover:bg-red-50/50">
              <Users className="mb-3 h-8 w-8 text-red-600" />
              <h3 className="mb-1 font-semibold text-gray-900">
                User Management
              </h3>
              <p className="text-sm text-gray-500">
                View, edit, and manage all user accounts in the system.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 p-6 transition-colors hover:border-red-200 hover:bg-red-50/50">
              <Settings className="mb-3 h-8 w-8 text-red-600" />
              <h3 className="mb-1 font-semibold text-gray-900">
                System Configuration
              </h3>
              <p className="text-sm text-gray-500">
                Configure application settings, email templates, and API keys.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 p-6 transition-colors hover:border-red-200 hover:bg-red-50/50">
              <FileText className="mb-3 h-8 w-8 text-red-600" />
              <h3 className="mb-1 font-semibold text-gray-900">Audit Logs</h3>
              <p className="text-sm text-gray-500">
                Review system activity, login attempts, and security events.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AuthGuard allowedRoles={['ADMIN']}>
      <AdminContent />
    </AuthGuard>
  );
}
