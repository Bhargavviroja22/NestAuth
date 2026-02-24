'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { Mail, Lock } from 'lucide-react';
import { AxiosError } from 'axios';
import { loginSchema, type LoginFormValues } from '@/lib/validation.schemas';
import { useLogin } from '@/hooks/useAuth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import Link from 'next/link';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const loginMutation = useLogin();
  const [apiError, setApiError] = useState<string | null>(null);

  const registered = searchParams.get('registered') === 'true';
  const emailParam = searchParams.get('email');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Pre-fill email from registration redirect
  useEffect(() => {
    if (emailParam) {
      setValue('email', emailParam);
    }
  }, [emailParam, setValue]);

  const onSubmit = (data: LoginFormValues) => {
    setApiError(null);
    loginMutation.mutate(data, {
      onError: (error) => {
        if (error instanceof AxiosError) {
          const message =
            error.response?.data?.message || 'An unexpected error occurred';
          setApiError(message);
        } else {
          setApiError('An unexpected error occurred');
        }
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {registered && (
        <Alert
          type="success"
          message="Registration successful! Please check your email to verify your account before signing in."
        />
      )}

      {apiError && <Alert type="error" message={apiError} />}

      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
        leftIcon={<Mail className="h-4 w-4" />}
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        leftIcon={<Lock className="h-4 w-4" />}
        error={errors.password?.message}
        {...register('password')}
      />

      <Button type="submit" fullWidth loading={loginMutation.isPending}>
        {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
      </Button>

      <p className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="font-semibold text-indigo-600 hover:text-indigo-500"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
