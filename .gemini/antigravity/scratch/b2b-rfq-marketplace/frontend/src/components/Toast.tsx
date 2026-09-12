import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />,
  };

  const bgStyles = {
    success: 'bg-slate-900 border-emerald-500/50 text-white',
    error: 'bg-slate-900 border-rose-500/50 text-white',
    info: 'bg-slate-900 border-blue-500/50 text-white',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in max-w-sm">
      <div className={`p-4 rounded-2xl border shadow-2xl flex items-center space-x-3 text-xs font-semibold ${bgStyles[type]}`}>
        {icons[type]}
        <span className="flex-1 leading-snug">{message}</span>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
