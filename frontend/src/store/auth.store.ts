'use client';

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { tokenUtils } from '@/lib/token.utils';
import type { AuthState, AuthTokens, User } from '@/types/auth.types';

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        accessToken: tokenUtils.getAccess(),
        refreshToken: tokenUtils.getRefresh(),
        isAuth: !!tokenUtils.getAccess(),

        setTokens: (tokens: AuthTokens) => {
          tokenUtils.setTokens(tokens.accessToken, tokens.refreshToken);
          set(
            {
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken,
              isAuth: true,
            },
            false,
            'setTokens',
          );
        },

        setUser: (user: User) => {
          set({ user }, false, 'setUser');
        },

        clearAuth: () => {
          tokenUtils.clearAll();
          set(
            {
              user: null,
              accessToken: null,
              refreshToken: null,
              isAuth: false,
            },
            false,
            'clearAuth',
          );
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({ isAuth: state.isAuth }),
      },
    ),
    { name: 'AuthStore' },
  ),
);
