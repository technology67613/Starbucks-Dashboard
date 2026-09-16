import React from 'react';
import { cn } from '../../lib/utils';

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-black/[0.06] rounded-md',
        className
      )}
    />
  );
};

export const KpiCardSkeleton: React.FC = () => {
  return (
    <div className="bg-surface rounded-card p-6 border border-black/5 shadow-card flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <Skeleton className="w-10 h-10 rounded-full" />
        <Skeleton className="w-16 h-5 rounded-pill" />
      </div>
      <div className="mt-4">
        <Skeleton className="w-24 h-4" />
        <Skeleton className="w-32 h-8 mt-2" />
      </div>
      <Skeleton className="w-full h-8 mt-4" />
    </div>
  );
};

export const TableRowSkeleton: React.FC<{ cols?: number }> = ({ cols = 6 }) => {
  return (
    <tr className="border-b border-black/5">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <Skeleton className="w-full h-5" />
        </td>
      ))}
    </tr>
  );
};
