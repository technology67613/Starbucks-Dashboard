import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { formatINR } from '../../lib/utils';

interface TrendDataPoint {
  label: string; // e.g. "8 AM" or "14 Sep"
  sales: number;
  orders?: number;
}

interface SalesTrendChartProps {
  data: TrendDataPoint[];
  height?: number;
  showGrid?: boolean;
  color?: string;
  tooltipTitle?: string;
}

export const SalesTrendChart: React.FC<SalesTrendChartProps> = ({
  data,
  height = 280,
  showGrid = true,
  color = '#0C5C3D',
  tooltipTitle = 'Sales',
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-[280px] flex items-center justify-center text-xs text-customText-secondary">
        No sales trend data available
      </div>
    );
  }

  // Y-axis tick formatter (e.g. ₹10k, ₹5k, ₹0)
  const formatYAxis = (val: number) => {
    if (val === 0) return '0';
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`;
    return `₹${val}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-card shadow-lg border border-black/10 text-xs">
          <p className="font-semibold text-customText">{label}</p>
          <p className="text-primary font-bold text-sm mt-1">
            {formatINR(point.sales)}
          </p>
          {point.orders !== undefined && (
            <p className="text-customText-secondary text-[11px] mt-0.5">
              {point.orders} {point.orders === 1 ? 'order' : 'orders'}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="salesTrendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.28} />
              <stop offset="95%" stopColor={color} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
          )}
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6B7280', fontSize: 11 }}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6B7280', fontSize: 11 }}
            tickFormatter={formatYAxis}
            dx={-4}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="sales"
            name={tooltipTitle}
            stroke={color}
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#salesTrendGradient)"
            dot={{ r: 3, fill: color, strokeWidth: 1.5, stroke: '#FFFFFF' }}
            activeDot={{ r: 6, fill: color, strokeWidth: 2, stroke: '#FFFFFF' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
