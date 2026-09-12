import React from 'react';
import { PackageOpen, LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = PackageOpen,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm my-4">
      <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium text-sm rounded-lg transition shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
