'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import Navbar from '@/components/layout/Navbar';
import { Eye, Flag, ShieldBan } from 'lucide-react';

function ModeratorContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-900/5">
          <div className="mb-6 flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">
              Moderator Panel
            </h1>
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
              MODERATOR
            </span>
          </div>

          <p className="mb-8 text-gray-600">
            Content moderation access granted. Review flagged content, manage
            reports, and enforce community guidelines.
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200 p-6 transition-colors hover:border-yellow-200 hover:bg-yellow-50/50">
              <Eye className="mb-3 h-8 w-8 text-yellow-600" />
              <h3 className="mb-1 font-semibold text-gray-900">
                Review Content
              </h3>
              <p className="text-sm text-gray-500">
                Review and approve user-submitted content and posts.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 p-6 transition-colors hover:border-yellow-200 hover:bg-yellow-50/50">
              <Flag className="mb-3 h-8 w-8 text-yellow-600" />
              <h3 className="mb-1 font-semibold text-gray-900">
                Manage Reports
              </h3>
              <p className="text-sm text-gray-500">
                Handle user reports and escalate issues as needed.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 p-6 transition-colors hover:border-yellow-200 hover:bg-yellow-50/50">
              <ShieldBan className="mb-3 h-8 w-8 text-yellow-600" />
              <h3 className="mb-1 font-semibold text-gray-900">Ban Users</h3>
              <p className="text-sm text-gray-500">
                Temporarily or permanently ban users violating guidelines.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ModeratorPage() {
  return (
    <AuthGuard allowedRoles={['ADMIN', 'MODERATOR']}>
      <ModeratorContent />
    </AuthGuard>
  );
}
