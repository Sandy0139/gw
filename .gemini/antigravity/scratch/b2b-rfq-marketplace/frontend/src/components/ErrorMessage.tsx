import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 my-4 text-rose-800 flex items-start space-x-3">
      <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-rose-900">An error occurred</h4>
        <p className="text-sm text-rose-700 mt-0.5">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-xs font-semibold text-rose-800 underline hover:text-rose-950"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};
