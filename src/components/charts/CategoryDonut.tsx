import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { CategoryBreakdown } from '../../lib/aggregations';
import { formatINR } from '../../lib/utils';

interface CategoryDonutProps {
  data: CategoryBreakdown[];
  totalSales: number;
  height?: number;
}

export const CategoryDonut: React.FC<CategoryDonutProps> = ({
  data,
  totalSales,
  height = 240,
}) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload as CategoryBreakdown;
      return (
        <div className="bg-white p-2.5 rounded-card shadow-lg border border-black/10 text-xs">
          <p className="font-semibold text-customText">{item.category}</p>
          <p className="text-primary font-bold">{formatINR(item.totalSales)}</p>
          <p className="text-customText-secondary text-[11px]">
            {item.percentage}% of store sales ({item.orderCount} orders)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      {/* Donut Chart */}
      <div className="relative w-48 h-48 shrink-0 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={data}
              dataKey="totalSales"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={54}
              outerRadius={78}
              paddingAngle={3}
              stroke="none"
            >
              {data.map(entry => (
                <Cell key={entry.category} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Total Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-[11px] text-customText-secondary font-medium">Total Sales</span>
          <span className="text-sm sm:text-base font-bold text-customText leading-tight">
            {formatINR(totalSales)}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex-1 w-full space-y-2">
        {data.map(item => (
          <div key={item.category} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-customText font-medium">{item.category}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-customText font-semibold">{item.percentage}%</span>
              <span className="text-customText-secondary text-[11px]">({formatINR(item.totalSales)})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
