import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Calendar,
  BarChart3,
  Award,
  PieChart as PieIcon,
  CreditCard,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useFilter } from '../context/FilterContext';
import { KpiCard } from '../components/ui/KpiCard';
import { Card, GlassCard } from '../components/ui/Card';
import { SalesTrendChart } from '../components/charts/SalesTrendChart';
import { CategoryDonut } from '../components/charts/CategoryDonut';
import { EmptyState } from '../components/ui/EmptyState';
import { CategoryIcon } from '../components/ui/CategoryIcon';
import { StarbucksLogo } from '../components/ui/StarbucksLogo';
import {
  calculateKPIs,
  calculateDailyTrend,
  calculateCategoryBreakdown,
  calculateTopSellingItems,
} from '../lib/aggregations';
import { formatINR, formatIndianNumber, formatDatePretty } from '../lib/utils';

export const Reports: React.FC = () => {
  const { orders } = useData();
  const {
    reportsDateRange,
    setReportsDateRange,
    reportsActiveTab,
    setReportsActiveTab,
  } = useFilter();

  const [dateRangePreset, setDateRangePreset] = useState<'all' | 'sep' | 'aug' | 'jul'>('all');

  const handlePresetChange = (preset: 'all' | 'sep' | 'aug' | 'jul') => {
    setDateRangePreset(preset);
    if (preset === 'all') {
      setReportsDateRange({ startDate: '2025-07-01', endDate: '2025-09-14' });
    } else if (preset === 'sep') {
      setReportsDateRange({ startDate: '2025-09-01', endDate: '2025-09-14' });
    } else if (preset === 'aug') {
      setReportsDateRange({ startDate: '2025-08-01', endDate: '2025-08-31' });
    } else if (preset === 'jul') {
      setReportsDateRange({ startDate: '2025-07-01', endDate: '2025-07-31' });
    }
  };

  // Filter orders by active date range
  const filteredOrders = useMemo(() => {
    return orders.filter(
      o => o.order_date >= reportsDateRange.startDate && o.order_date <= reportsDateRange.endDate
    );
  }, [orders, reportsDateRange]);

  // Aggregated Report Metrics
  const kpis = useMemo(() => {
    return calculateKPIs(filteredOrders);
  }, [filteredOrders]);

  const dailyTrend = useMemo(() => {
    return calculateDailyTrend(filteredOrders);
  }, [filteredOrders]);

  const categoryBreakdown = useMemo(() => {
    return calculateCategoryBreakdown(filteredOrders);
  }, [filteredOrders]);

  const topItems = useMemo(() => {
    return calculateTopSellingItems(filteredOrders, 5);
  }, [filteredOrders]);

  const allRankedItems = useMemo(() => {
    return calculateTopSellingItems(filteredOrders, 25);
  }, [filteredOrders]);

  // Payment method & Channel breakdowns for the secondary tabs
  const channelBreakdown = useMemo(() => {
    const map = new Map<string, { count: number; sales: number }>();
    filteredOrders.forEach(o => {
      const curr = map.get(o.order_type) || { count: 0, sales: 0 };
      map.set(o.order_type, {
        count: curr.count + 1,
        sales: curr.sales + o.total_amount,
      });
    });
    const total = filteredOrders.length;
    return Array.from(map.entries()).map(([channel, val]) => ({
      channel,
      count: val.count,
      sales: val.sales,
      percentage: total > 0 ? Math.round((val.count / total) * 100) : 0,
    }));
  }, [filteredOrders]);

  const paymentBreakdown = useMemo(() => {
    const map = new Map<string, { count: number; sales: number }>();
    filteredOrders.forEach(o => {
      const curr = map.get(o.payment_method) || { count: 0, sales: 0 };
      map.set(o.payment_method, {
        count: curr.count + 1,
        sales: curr.sales + o.total_amount,
      });
    });
    const total = filteredOrders.length;
    return Array.from(map.entries()).map(([method, val]) => ({
      method,
      count: val.count,
      sales: val.sales,
      percentage: total > 0 ? Math.round((val.count / total) * 100) : 0,
    }));
  }, [filteredOrders]);

  const maxItemQty = topItems.length > 0 ? topItems[0].quantitySold : 1;

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Header & Date Range Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-customText tracking-tight">
            Store Performance & Reports
          </h1>
          <p className="text-xs sm:text-sm text-customText-secondary mt-1">
            Track revenue growth, item velocities, customer channels, and product mixes
          </p>
        </div>

        {/* Date Range Selector & Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-surface-muted p-1 rounded-btn text-xs font-semibold">
            <button
              onClick={() => handlePresetChange('all')}
              className={`px-2.5 py-1 rounded-btn transition-colors ${
                dateRangePreset === 'all' ? 'bg-primary text-white shadow-xs' : 'text-customText-secondary hover:text-customText'
              }`}
            >
              Full Range (Jul–Sep)
            </button>
            <button
              onClick={() => handlePresetChange('sep')}
              className={`px-2.5 py-1 rounded-btn transition-colors ${
                dateRangePreset === 'sep' ? 'bg-primary text-white shadow-xs' : 'text-customText-secondary hover:text-customText'
              }`}
            >
              Sep 2025
            </button>
            <button
              onClick={() => handlePresetChange('aug')}
              className={`px-2.5 py-1 rounded-btn transition-colors ${
                dateRangePreset === 'aug' ? 'bg-primary text-white shadow-xs' : 'text-customText-secondary hover:text-customText'
              }`}
            >
              Aug 2025
            </button>
            <button
              onClick={() => handlePresetChange('jul')}
              className={`px-2.5 py-1 rounded-btn transition-colors ${
                dateRangePreset === 'jul' ? 'bg-primary text-white shadow-xs' : 'text-customText-secondary hover:text-customText'
              }`}
            >
              Jul 2025
            </button>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-black/10 rounded-btn text-xs text-customText font-medium shadow-sm">
            <Calendar size={13} className="text-customText-secondary" />
            <span>
              {formatDatePretty(reportsDateRange.startDate)} – {formatDatePretty(reportsDateRange.endDate)}
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Nav Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-black/10 pb-2 overflow-x-auto">
        {(
          [
            { id: 'overview', label: 'Overview' },
            { id: 'sales', label: 'Sales Trend' },
            { id: 'orders', label: 'Channels & Payments' },
            { id: 'topItems', label: 'Top Selling Items' },
          ] as const
        ).map(tab => {
          const isActive = reportsActiveTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setReportsActiveTab(tab.id)}
              className={`px-4 py-2 rounded-btn text-xs sm:text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-customText-secondary hover:text-customText hover:bg-black/5'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {filteredOrders.length === 0 ? (
        <EmptyState
          title="No Data in Selected Date Range"
          description="There were no orders recorded between the selected dates. Switch to Full Range to analyze all historical records."
          actionLabel="Reset to Full Range"
          onAction={() => handlePresetChange('all')}
        />
      ) : (
        <>
          {/* TAB 1: OVERVIEW */}
          {reportsActiveTab === 'overview' && (
            <div className="space-y-6">
              {/* 3 KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <KpiCard
                  title="Total Sales (Selected Period)"
                  value={formatINR(kpis.totalSales)}
                  deltaPct={12}
                  deltaLabel="vs previous period"
                  icon={<TrendingUp size={20} className="text-emerald-800" />}
                  iconBgColor="bg-emerald-100"
                />
                <KpiCard
                  title="Total Orders"
                  value={formatIndianNumber(kpis.totalOrders)}
                  deltaPct={9}
                  deltaLabel="vs previous period"
                  icon={<ShoppingBag size={20} className="text-teal-800" />}
                  iconBgColor="bg-teal-100"
                />
                <KpiCard
                  title="Total Customers (Visits)"
                  value={formatIndianNumber(kpis.totalOrders)}
                  deltaPct={11}
                  deltaLabel="vs previous period"
                  icon={<Users size={20} className="text-primary" />}
                  iconBgColor="bg-primary-tint"
                />
              </div>

              {/* Full-width Sales Trend Area Chart */}
              <Card>
                <div className="flex items-center justify-between pb-4 border-b border-black/5">
                  <div>
                    <h2 className="text-base font-bold text-customText">Daily Sales Trend</h2>
                    <p className="text-xs text-customText-secondary mt-0.5">
                      Aggregated gross daily sales from {formatDatePretty(reportsDateRange.startDate)} to {formatDatePretty(reportsDateRange.endDate)}
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-primary-tint text-primary rounded-pill">
                    {dailyTrend.length} Days Recorded
                  </span>
                </div>
                <div className="pt-4">
                  <SalesTrendChart
                    data={dailyTrend.map(d => ({
                      label: d.formattedDate,
                      sales: d.sales,
                      orders: d.orders,
                    }))}
                    height={300}
                    color="#0C5C3D"
                  />
                </div>
              </Card>

              {/* 2-Column Split: Top 5 Items & Sales by Category Donut */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Top Selling Items (6 cols) */}
                <Card className="lg:col-span-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-3 border-b border-black/5">
                    <div>
                      <h2 className="text-base font-bold text-customText">Top Selling Items</h2>
                      <p className="text-xs text-customText-secondary mt-0.5">Ranked by total quantity sold</p>
                    </div>
                    <button
                      onClick={() => setReportsActiveTab('topItems')}
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      <span>View All</span>
                      <ArrowUpRight size={13} />
                    </button>
                  </div>

                  <div className="space-y-3.5 py-3">
                    {topItems.map(item => (
                      <div key={item.name} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-surface-muted flex items-center justify-center font-bold text-[11px] text-customText">
                              {item.rank}
                            </span>
                            <CategoryIcon category={item.category} size={14} />
                            <span className="font-bold text-customText">{item.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-customText-secondary font-medium">{formatINR(item.totalRevenue)}</span>
                            <span className="font-bold text-primary text-xs">{item.quantitySold} sold</span>
                          </div>
                        </div>
                        {/* Horizontal volume bar */}
                        <div className="w-full bg-black/5 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-primary h-full rounded-full transition-all duration-500"
                            style={{ width: `${(item.quantitySold / maxItemQty) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Sales by Category Donut (6 cols) */}
                <Card className="lg:col-span-6 flex flex-col justify-between">
                  <div className="pb-3 border-b border-black/5">
                    <h2 className="text-base font-bold text-customText">Sales by Category</h2>
                    <p className="text-xs text-customText-secondary mt-0.5">Revenue share across 5 core categories</p>
                  </div>

                  <div className="py-2">
                    <CategoryDonut
                      data={categoryBreakdown}
                      totalSales={kpis.totalSales}
                      height={240}
                    />
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* TAB 2: SALES TREND TABLE */}
          {reportsActiveTab === 'sales' && (
            <Card>
              <div className="pb-3 border-b border-black/5">
                <h2 className="text-base font-bold text-customText">Daily Revenue Log</h2>
                <p className="text-xs text-customText-secondary mt-0.5">
                  Detailed day-by-day revenue breakdown for the Patna outlet
                </p>
              </div>
              <div className="overflow-x-auto mt-3">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-surface-muted/60 border-b border-black/5 text-[11px] font-bold text-customText-secondary uppercase">
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Orders Count</th>
                      <th className="py-3 px-4">Gross Revenue</th>
                      <th className="py-3 px-4">Avg Ticket Size</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {dailyTrend.slice().reverse().map(d => (
                      <tr key={d.date} className="hover:bg-primary-tint/20">
                        <td className="py-3 px-4 font-semibold text-customText">
                          {formatDatePretty(d.date, true)}
                        </td>
                        <td className="py-3 px-4 text-customText-secondary">
                          {d.orders} orders
                        </td>
                        <td className="py-3 px-4 font-bold text-customText">
                          {formatINR(d.sales)}
                        </td>
                        <td className="py-3 px-4 text-primary font-medium">
                          {formatINR(d.orders > 0 ? Math.round(d.sales / d.orders) : 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* TAB 3: CHANNELS & PAYMENTS */}
          {reportsActiveTab === 'orders' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Order Channels */}
              <Card>
                <div className="pb-3 border-b border-black/5">
                  <h2 className="text-base font-bold text-customText">Order Channels</h2>
                  <p className="text-xs text-customText-secondary mt-0.5">Dine-in vs. Takeaway vs. Delivery breakdown</p>
                </div>
                <div className="space-y-4 mt-4">
                  {channelBreakdown.map(ch => (
                    <div key={ch.channel} className="p-3.5 bg-surface-muted/60 rounded-card border border-black/5 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-customText text-sm">{ch.channel}</span>
                        <span className="font-bold text-primary">{ch.percentage}% ({ch.count} orders)</span>
                      </div>
                      <div className="w-full bg-black/5 h-2 rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: `${ch.percentage}%` }} />
                      </div>
                      <div className="flex justify-between text-[11px] text-customText-secondary pt-0.5">
                        <span>Total Revenue:</span>
                        <span className="font-semibold text-customText">{formatINR(ch.sales)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Payment Methods */}
              <Card>
                <div className="pb-3 border-b border-black/5">
                  <h2 className="text-base font-bold text-customText">Payment Methods</h2>
                  <p className="text-xs text-customText-secondary mt-0.5">UPI, Starbucks Wallet, Cards, and Cash</p>
                </div>
                <div className="space-y-4 mt-4">
                  {paymentBreakdown.map(pm => (
                    <div key={pm.method} className="p-3.5 bg-surface-muted/60 rounded-card border border-black/5 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-customText text-sm">{pm.method}</span>
                        <span className="font-bold text-primary">{pm.percentage}% ({pm.count} orders)</span>
                      </div>
                      <div className="w-full bg-black/5 h-2 rounded-full overflow-hidden">
                        <div className="bg-teal-700 h-full rounded-full" style={{ width: `${pm.percentage}%` }} />
                      </div>
                      <div className="flex justify-between text-[11px] text-customText-secondary pt-0.5">
                        <span>Total Paid:</span>
                        <span className="font-semibold text-customText">{formatINR(pm.sales)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* TAB 4: ALL RANKED TOP ITEMS */}
          {reportsActiveTab === 'topItems' && (
            <Card>
              <div className="pb-3 border-b border-black/5">
                <h2 className="text-base font-bold text-customText">Complete Menu Sales Ranking</h2>
                <p className="text-xs text-customText-secondary mt-0.5">
                  All 19 Starbucks Patna menu items sorted by volume and sales contribution
                </p>
              </div>
              <div className="overflow-x-auto mt-3">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-surface-muted/60 border-b border-black/5 text-[11px] font-bold text-customText-secondary uppercase">
                      <th className="py-3 px-4">Rank</th>
                      <th className="py-3 px-4">Item Name</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Quantity Sold</th>
                      <th className="py-3 px-4">Total Revenue</th>
                      <th className="py-3 px-4">Revenue Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {allRankedItems.map(item => (
                      <tr key={item.name} className="hover:bg-primary-tint/20">
                        <td className="py-3 px-4 font-bold text-customText">
                          #{item.rank}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <CategoryIcon category={item.category} size={15} />
                            <span className="font-bold text-customText">{item.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-customText-secondary">
                          {item.category}
                        </td>
                        <td className="py-3 px-4 font-semibold text-customText">
                          {item.quantitySold} units
                        </td>
                        <td className="py-3 px-4 font-bold text-customText">
                          {formatINR(item.totalRevenue)}
                        </td>
                        <td className="py-3 px-4 text-primary font-semibold">
                          {item.percentageOfTotal}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}

      {/* Quote Banner */}
      <GlassCard className="flex items-center justify-between py-3.5 px-6 border-emerald-900/10">
        <p className="font-['Playfair_Display'] italic text-sm text-emerald-950 font-medium">
          “Great coffee creates a brighter day.” — Starbucks Patna
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <StarbucksLogo size={42} className="rounded-full shadow-2xs" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-primary/80">
            Audited CSV Records
          </span>
        </div>
      </GlassCard>
    </div>
  );
};
