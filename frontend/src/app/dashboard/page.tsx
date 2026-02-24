'use client';

import Link from 'next/link';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import AuthGuard from '@/components/auth/AuthGuard';
import Navbar from '@/components/layout/Navbar';
import Spinner from '@/components/ui/Spinner';
import { cn } from '@/lib/utils';
import type { Role } from '@/types/auth.types';
import {
  Shield,
  Mail,
  Calendar,
  Hash,
  ArrowRight,
} from 'lucide-react';

const roleBadgeColors: Record<Role, string> = {
  ADMIN: 'bg-red-100 text-red-700',
  MODERATOR: 'bg-yellow-100 text-yellow-700',
  USER: 'bg-green-100 text-green-700',
};

function DashboardContent() {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const initial = user.username.charAt(0).toUpperCase();
  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="mb-8 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-900/5">
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-600 text-3xl font-bold text-white shadow-lg">
              {initial}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.username}
              </h1>
              <p className="text-gray-500">{user.email}</p>
              <span
                className={cn(
                  'mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold',
                  roleBadgeColors[user.role],
                )}
              >
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
            <div className="mb-2 flex items-center gap-2 text-gray-400">
              <Hash className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">
                Account ID
              </span>
            </div>
            <p className="truncate font-mono text-sm text-gray-900">
              {user.id}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
            <div className="mb-2 flex items-center gap-2 text-gray-400">
              <Mail className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">
                Email Status
              </span>
            </div>
            <p
              className={cn(
                'text-sm font-semibold',
                user.isEmailVerified ? 'text-green-600' : 'text-red-600',
              )}
            >
              {user.isEmailVerified ? 'Verified' : 'Not Verified'}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
            <div className="mb-2 flex items-center gap-2 text-gray-400">
              <Calendar className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">
                Member Since
              </span>
            </div>
            <p className="text-sm text-gray-900">{memberSince}</p>
          </div>
        </div>

        {/* Quick Access for elevated roles */}
        {(user.role === 'ADMIN' || user.role === 'MODERATOR') && (
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-900/5">
            <div className="mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Quick Access
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="flex items-center justify-between rounded-xl border border-gray-200 p-4 transition-colors hover:border-indigo-300 hover:bg-indigo-50"
                >
                  <div>
                    <p className="font-medium text-gray-900">Admin Panel</p>
                    <p className="text-sm text-gray-500">
                      Manage users and system settings
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </Link>
              )}
              <Link
                href="/moderator"
                className="flex items-center justify-between rounded-xl border border-gray-200 p-4 transition-colors hover:border-indigo-300 hover:bg-indigo-50"
              >
                <div>
                  <p className="font-medium text-gray-900">Moderator Panel</p>
                  <p className="text-sm text-gray-500">
                    Review and moderate content
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
