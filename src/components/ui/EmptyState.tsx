import React from 'react';
import { PackageOpen, RotateCcw } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../lib/utils';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-surface/50 border border-dashed border-black/10 rounded-card',
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center text-customText-secondary mb-3">
        {icon || <PackageOpen size={24} />}
      </div>
      <h3 className="text-base font-semibold text-customText">{title}</h3>
      <p className="text-sm text-customText-secondary mt-1 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onAction}
          className="mt-4 gap-1.5"
        >
          <RotateCcw size={14} />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
