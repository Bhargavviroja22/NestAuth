'use client';

import { useEffect, useState } from 'react';
import { authApi } from '@/lib/auth.api';
import { useAuthStore } from '@/store/auth.store';
import type { User } from '@/types/auth.types';

export function useCurrentUser() {
  const isAuth = useAuthStore((state) => state.isAuth);
  const setUser = useAuthStore((state) => state.setUser);
  const [data, setData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuth) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    authApi
      .getMe()
      .then((user) => {
        if (!cancelled) {
          setData(user);
          setUser(user);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.message ?? 'Failed to fetch user');
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isAuth, setUser]);

  return { data, isLoading, error };
}
