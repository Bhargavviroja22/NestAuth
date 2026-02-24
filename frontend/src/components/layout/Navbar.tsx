'use client';

import { LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useLogout } from '@/hooks/useAuth';
import type { Role } from '@/types/auth.types';

const roleBadgeColors: Record<Role, string> = {
  ADMIN: 'bg-red-500/20 text-red-100',
  MODERATOR: 'bg-yellow-500/20 text-yellow-100',
  USER: 'bg-green-500/20 text-green-100',
};

export default function Navbar() {
  const { data: user } = useCurrentUser();
  const logoutMutation = useLogout();

  return (
    <nav className="bg-indigo-700 shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-sm font-bold text-white">
              A
            </div>
            <span className="text-lg font-semibold text-white">AuthApp</span>
          </div>

          {/* Right: User info + Logout */}
          <div className="flex items-center gap-4">
            {user && (
              <>
                <span className="text-sm text-indigo-100">
                  {user.username}
                </span>
                <span
                  className={cn(
                    'rounded-full px-2.5 py-0.5 text-xs font-medium',
                    roleBadgeColors[user.role],
                  )}
                >
                  {user.role}
                </span>
              </>
            )}
            <button
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-sm text-white transition-colors hover:bg-white/20 disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
