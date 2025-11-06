import { ReactNode } from 'react';

interface MessageBoxProps {
  variant?: 'info' | 'success' | 'warning' | 'danger' | 'alert';
  children: ReactNode;
}

export default function MessageBox({ variant = 'info', children }: MessageBoxProps) {
  const variantStyles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    danger: 'bg-red-50 border-red-200 text-red-800',
    alert: 'bg-orange-50 border-orange-200 text-orange-800',
  };

  return (
    <div className={`border rounded-lg p-4 ${variantStyles[variant]}`}>
      {children}
    </div>
  );
}
