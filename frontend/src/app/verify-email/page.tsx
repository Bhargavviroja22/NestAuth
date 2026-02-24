'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle } from 'lucide-react';
import { authApi } from '@/lib/auth.api';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import Link from 'next/link';

type VerifyState = 'loading' | 'success' | 'error';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [state, setState] = useState<VerifyState>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setState('error');
      setMessage('No verification token provided.');
      return;
    }

    authApi
      .verifyEmail(token)
      .then((res) => {
        setState('success');
        setMessage(res.message);
      })
      .catch((err) => {
        setState('error');
        setMessage(
          err?.response?.data?.message ||
            'Verification failed. The token may be invalid or expired.',
        );
      });
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl ring-1 ring-gray-900/5">
        {state === 'loading' && (
          <div className="flex flex-col items-center gap-4">
            <Spinner size="lg" />
            <p className="text-gray-600">Verifying your email...</p>
          </div>
        )}

        {state === 'success' && (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <h2 className="text-xl font-bold text-gray-900">
              Email Verified!
            </h2>
            <p className="text-gray-600">{message}</p>
            <Link href="/login">
              <Button variant="primary">Continue to Login</Button>
            </Link>
          </div>
        )}

        {state === 'error' && (
          <div className="flex flex-col items-center gap-4">
            <XCircle className="h-16 w-16 text-red-500" />
            <h2 className="text-xl font-bold text-gray-900">
              Verification Failed
            </h2>
            <p className="text-gray-600">{message}</p>
            <Link href="/register">
              <Button variant="ghost">Back to Register</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
