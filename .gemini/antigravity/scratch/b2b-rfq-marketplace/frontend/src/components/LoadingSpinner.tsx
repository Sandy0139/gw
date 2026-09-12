import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  fullPage?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading data...',
  fullPage = false,
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
      {message && <p className="text-sm font-medium text-slate-500">{message}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};
