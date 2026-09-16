import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { Card } from './Card';
import { Sparkline } from '../charts/Sparkline';
import { cn } from '../../lib/utils';

interface KpiCardProps {
  title: string;
  value: string;
  deltaPct?: number | null;
  deltaLabel?: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  sparklineData?: number[];
  className?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  deltaPct,
  deltaLabel = 'vs previous period',
  icon,
  iconBgColor = 'bg-primary-tint text-primary',
  sparklineData,
  className,
}) => {
  const isPositive = deltaPct !== null && deltaPct !== undefined && deltaPct > 0;
  const isNegative = deltaPct !== null && deltaPct !== undefined && deltaPct < 0;
  const isZero = deltaPct !== null && deltaPct !== undefined && deltaPct === 0;

  return (
    <Card className={cn('flex flex-col justify-between', className)} hoverEffect>
      <div className="flex items-start justify-between">
        <div className={cn('p-3 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-black/5', iconBgColor)}>
          {icon}
        </div>
        {sparklineData && sparklineData.length > 1 && (
          <Sparkline
            data={sparklineData}
            color={isNegative ? '#DC2626' : '#0C5C3D'}
          />
        )}
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-customText-secondary">
          {title}
        </p>
        <h3 className="text-2xl sm:text-3xl font-bold text-customText mt-1 tracking-tight">
          {value}
        </h3>

        {deltaPct !== null && deltaPct !== undefined ? (
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span
              className={cn(
                'inline-flex items-center gap-0.5 font-bold px-1.5 py-0.5 rounded-pill text-[11px]',
                isPositive && 'bg-emerald-50 text-emerald-700',
                isNegative && 'bg-rose-50 text-rose-700',
                isZero && 'bg-gray-100 text-gray-700'
              )}
            >
              {isPositive && <ArrowUpRight size={13} />}
              {isNegative && <ArrowDownRight size={13} />}
              {isZero && <Minus size={13} />}
              <span>{Math.abs(deltaPct)}%</span>
            </span>
            <span className="text-customText-muted text-[11px]">{deltaLabel}</span>
          </div>
        ) : (
          <div className="mt-2 text-[11px] text-customText-muted">
            Initial period data
          </div>
        )}
      </div>
    </Card>
  );
};
