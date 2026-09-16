import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import { OrderStatus } from '../../types/order';
import { StockStatus } from '../../types/inventory';
import { cn } from '../../lib/utils';

export interface StatusBadgeProps {
  status: OrderStatus | StockStatus | string;
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className, size = 'sm' }) => {
  const iconSize = size === 'sm' ? 12 : 14;

  switch (status) {
    case 'Completed':
      return (
        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80', className)}>
          <CheckCircle2 size={iconSize} className="text-emerald-600" />
          <span>Completed</span>
        </span>
      );
    case 'Preparing':
    case 'In Progress':
      return (
        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/80', className)}>
          <Clock size={iconSize} className="text-amber-600 animate-pulse" />
          <span>Preparing</span>
        </span>
      );
    case 'Cancelled':
      return (
        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200/80', className)}>
          <XCircle size={iconSize} className="text-rose-600" />
          <span>Cancelled</span>
        </span>
      );
    case 'In Stock':
      return (
        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80', className)}>
          <CheckCircle2 size={iconSize} className="text-emerald-600" />
          <span>In Stock</span>
        </span>
      );
    case 'Low Stock':
      return (
        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/80', className)}>
          <AlertTriangle size={iconSize} className="text-amber-600" />
          <span>Low Stock</span>
        </span>
      );
    case 'Out of Stock':
      return (
        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200/80', className)}>
          <AlertCircle size={iconSize} className="text-rose-600" />
          <span>Out of Stock</span>
        </span>
      );
    default:
      return (
        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill text-xs font-medium bg-gray-100 text-gray-700', className)}>
          <span>{status}</span>
        </span>
      );
  }
};
