import { Suspense } from 'react';
import AuthLayout from '@/components/layout/AuthLayout';
import LoginForm from '@/components/forms/LoginForm';
import GuestGuard from '@/components/auth/GuestGuard';
import Spinner from '@/components/ui/Spinner';

export default function LoginPage() {
  return (
    <GuestGuard>
      <AuthLayout
        title="Welcome back"
        description="Sign in to continue to your account"
      >
        <Suspense
          fallback={
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </AuthLayout>
    </GuestGuard>
  );
}
