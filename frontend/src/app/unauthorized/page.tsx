import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-4">
      <div className="text-center">
        <p className="text-6xl">🔒</p>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          Access Denied
        </h1>
        <p className="mt-2 text-gray-600">
          You don&apos;t have permission to access this page. Contact an
          administrator if you believe this is a mistake.
        </p>
        <div className="mt-6">
          <Link href="/dashboard">
            <Button variant="primary">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
