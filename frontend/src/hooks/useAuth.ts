'use client';

import { useCallback, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/auth.api';
import { useAuthStore } from '@/store/auth.store';
import type { LoginPayload, RegisterPayload } from '@/types/auth.types';

export function useLogin() {
  const router = useRouter();
  const setTokens = useAuthStore((state) => state.setTokens);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (
      payload: LoginPayload,
      opts?: { onError?: (err: unknown) => void },
    ) => {
      setError(null);
      try {
        const data = await authApi.login(payload);
        setTokens(data);
        startTransition(() => {
          router.push('/dashboard');
        });
      } catch (err: any) {
        const msg =
          err?.response?.data?.message || 'Login failed';
        setError(msg);
        opts?.onError?.(err);
      }
    },
    [router, setTokens],
  );

  return { mutate, isPending, error };
}

export function useRegister() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (
      payload: RegisterPayload,
      opts?: { onError?: (err: unknown) => void },
    ) => {
      setError(null);
      setIsPending(true);
      try {
        await authApi.register(payload);
        router.push(`/login?registered=true&email=${encodeURIComponent(payload.email)}`);
      } catch (err: any) {
        const msg =
          err?.response?.data?.message || 'Registration failed';
        setError(msg);
        opts?.onError?.(err);
      } finally {
        setIsPending(false);
      }
    },
    [router],
  );

  return { mutate, isPending, error };
}

export function useLogout() {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(async () => {
    setIsPending(true);
    try {
      await authApi.logout();
    } catch {
      // ignore — force logout anyway
    } finally {
      clearAuth();
      setIsPending(false);
      router.push('/login');
    }
  }, [router, clearAuth]);

  return { mutate, isPending };
}
