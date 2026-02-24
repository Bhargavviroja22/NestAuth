import axiosInstance from '@/lib/axios.instance';
import type {
  AuthTokens,
  LoginPayload,
  RegisterPayload,
  User,
} from '@/types/auth.types';

export const authApi = {
  async register(payload: RegisterPayload): Promise<{ message: string }> {
    const response = await axiosInstance.post<{ message: string }>(
      '/auth/register',
      payload,
    );
    return response.data;
  },

  async login(payload: LoginPayload): Promise<AuthTokens> {
    const response = await axiosInstance.post<AuthTokens>(
      '/auth/login',
      payload,
    );
    return response.data;
  },

  async logout(): Promise<{ message: string }> {
    const response = await axiosInstance.post<{ message: string }>(
      '/auth/logout',
    );
    return response.data;
  },

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const response = await axiosInstance.post<AuthTokens>('/auth/refresh', {
      refreshToken,
    });
    return response.data;
  },

  async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await axiosInstance.get<{ message: string }>(
      `/auth/verify-email?token=${token}`,
    );
    return response.data;
  },

  async resendVerification(email: string): Promise<{ message: string }> {
    const response = await axiosInstance.post<{ message: string }>(
      '/auth/resend-verification',
      { email },
    );
    return response.data;
  },

  async getMe(): Promise<User> {
    const response = await axiosInstance.get<User>('/users/me');
    return response.data;
  },
};
