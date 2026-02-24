'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, User, Lock, Shield } from 'lucide-react';
import { AxiosError } from 'axios';
import {
  registerSchema,
  type RegisterFormValues,
} from '@/lib/validation.schemas';
import { useRegister } from '@/hooks/useAuth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function RegisterForm() {
  const registerMutation = useRegister();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      role: 'USER',
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    setApiError(null);
    registerMutation.mutate(data, {
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
        label="Username"
        type="text"
        placeholder="Choose a username"
        leftIcon={<User className="h-4 w-4" />}
        error={errors.username?.message}
        {...register('username')}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Create a strong password"
        leftIcon={<Lock className="h-4 w-4" />}
        error={errors.password?.message}
        {...register('password')}
      />

      {/* Role selection */}
      <div className="w-full">
        <label
          htmlFor="role"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Role
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Shield className="h-4 w-4" />
          </div>
          <select
            id="role"
            className={`block w-full rounded-lg border px-3 py-2.5 pl-10 text-sm text-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 ${
              errors.role
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
            }`}
            {...register('role')}
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
            <option value="MODERATOR">Moderator</option>
          </select>
        </div>
        {errors.role && (
          <p className="mt-1.5 flex items-center gap-1 text-sm text-red-600">
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
            {errors.role.message}
          </p>
        )}
      </div>

      <Button type="submit" fullWidth loading={registerMutation.isPending}>
        {registerMutation.isPending ? 'Creating account...' : 'Create Account'}
      </Button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-semibold text-indigo-600 hover:text-indigo-500"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
