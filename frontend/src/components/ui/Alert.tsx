'use client';

import { cn } from '@/lib/utils';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

const alertStyles = {
  success: {
    container: 'border-green-200 bg-green-50 text-green-800',
    icon: '✅',
  },
  error: {
    container: 'border-red-200 bg-red-50 text-red-800',
    icon: '❌',
  },
  warning: {
    container: 'border-yellow-200 bg-yellow-50 text-yellow-800',
    icon: '⚠️',
  },
  info: {
    container: 'border-blue-200 bg-blue-50 text-blue-800',
    icon: 'ℹ️',
  },
};

export default function Alert({ type, message }: AlertProps) {
  const styles = alertStyles[type];

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg border px-4 py-3 text-sm',
        styles.container,
      )}
      role="alert"
    >
      <span className="flex-shrink-0">{styles.icon}</span>
      <p>{message}</p>
    </div>
  );
}
