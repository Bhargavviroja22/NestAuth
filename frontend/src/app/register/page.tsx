import AuthLayout from '@/components/layout/AuthLayout';
import RegisterForm from '@/components/forms/RegisterForm';
import GuestGuard from '@/components/auth/GuestGuard';

export default function RegisterPage() {
  return (
    <GuestGuard>
      <AuthLayout
        title="Create an account"
        description="Fill in the details below to get started"
      >
        <RegisterForm />
      </AuthLayout>
    </GuestGuard>
  );
}
