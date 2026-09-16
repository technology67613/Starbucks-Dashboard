import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  CreditCard,
  Award,
  Clock,
  Users,
  Info,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { KpiCard } from '../components/ui/KpiCard';
import { Card, GlassCard } from '../components/ui/Card';
import { SalesTrendChart } from '../components/charts/SalesTrendChart';
import { DatePicker, DateRange } from '../components/ui/DatePicker';
import { EmptyState } from '../components/ui/EmptyState';
import { CategoryIcon } from '../components/ui/CategoryIcon';
import { StarbucksLogo } from '../components/ui/StarbucksLogo';
import { ReceiptIcon, DocumentIcon, WalletIcon } from '../components/ui/ModernIcons';
import {
  calculateKPIs,
  calculateHourlySales,
  calculateTodayHighlights,
} from '../lib/aggregations';
import { formatINR, formatIndianNumber } from '../lib/utils';
import { getTimeBasedGreeting } from '../lib/todayLogic';

export const Dashboard: React.FC = () => {
  const { orders, today, previousDate } = useData();
  const [selectedDate, setSelectedDate] = useState<DateRange>({ start: today, end: today });

  // Filter orders for the selected date range
  const selectedDateOrders = useMemo(() => {
    if (!selectedDate) return orders;
    return orders.filter(o => o.order_date >= selectedDate.start && o.order_date <= selectedDate.end);
  }, [orders, selectedDate]);

  // Previous date orders for delta calculations
  const prevDateOrders = useMemo(() => {
    if (!selectedDate) return [];
    if (selectedDate.start === selectedDate.end && selectedDate.start === today && previousDate) {
      return orders.filter(o => o.order_date === previousDate);
    }
    
    const start = new Date(selectedDate.start);
    const end = new Date(selectedDate.end);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    const prevEnd = new Date(start);
    prevEnd.setDate(prevEnd.getDate() - 1);
    const prevStart = new Date(prevEnd);
    prevStart.setDate(prevStart.getDate() - diffDays + 1);

    const prevStartStr = prevStart.toISOString().split('T')[0];
    const prevEndStr = prevEnd.toISOString().split('T')[0];

    return orders.filter(o => o.order_date >= prevStartStr && o.order_date <= prevEndStr);
  }, [orders, selectedDate, today, previousDate]);

  // KPI Calculations
  const kpis = useMemo(() => {
    return calculateKPIs(selectedDateOrders, prevDateOrders);
  }, [selectedDateOrders, prevDateOrders]);

  // Hourly breakdown for chart
  const hourlyData = useMemo(() => {
    return calculateHourlySales(selectedDateOrders);
  }, [selectedDateOrders]);

  // Highlights
  const highlights = useMemo(() => {
    return calculateTodayHighlights(selectedDateOrders, prevDateOrders);
  }, [selectedDateOrders, prevDateOrders]);

  // Sparkline arrays from hourly data
  const hourlySalesTrend = useMemo(() => {
    return hourlyData.map(h => h.sales);
  }, [hourlyData]);

  const hourlyOrdersTrend = useMemo(() => {
    return hourlyData.map(h => h.orders);
  }, [hourlyData]);

  const greeting = getTimeBasedGreeting();
  const availableDates = Array.from(new Set(orders.map(o => o.order_date))).sort().reverse();

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-customText tracking-tight">
              {greeting}, Devraj
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-customText-secondary mt-1">
            Here's how your Patna (P&M Mall) store is doing today.
          </p>
        </div>

        {/* Date Selector & Decorative Quote */}
        <div className="flex items-center gap-3">
          <div className="hidden xl:block text-right pr-2">
            <span className="font-['Caveat'] text-lg text-primary block leading-none font-semibold rotate-[-2deg]">
              Brewing Better Days in Patna ♡
            </span>
          </div>
          <DatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            availableDates={availableDates}
            label="Date"
          />
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <KpiCard
          title="Total Sales"
          value={formatINR(kpis.totalSales)}
          deltaPct={kpis.salesDeltaPct}
          deltaLabel="vs yesterday"
          icon={<ReceiptIcon size={20} className="text-emerald-800" />}
          iconBgColor="bg-emerald-100"
          sparklineData={hourlySalesTrend}
        />
        <KpiCard
          title="Total Orders"
          value={formatIndianNumber(kpis.totalOrders)}
          deltaPct={kpis.ordersDeltaPct}
          deltaLabel="vs yesterday"
          icon={<DocumentIcon size={20} className="text-teal-800" />}
          iconBgColor="bg-teal-100"
          sparklineData={hourlyOrdersTrend}
        />
        <KpiCard
          title="Average Order Value"
          value={formatINR(kpis.averageOrderValue)}
          deltaPct={kpis.aovDeltaPct}
          deltaLabel="vs yesterday"
          icon={<WalletIcon size={20} className="text-primary" />}
          iconBgColor="bg-primary-tint"
          sparklineData={[kpis.averageOrderValue * 0.9, kpis.averageOrderValue * 0.95, kpis.averageOrderValue]}
        />
      </div>

      {/* Main Grid: Sales Today Chart + Highlights */}
      {selectedDateOrders.length === 0 ? (
        <EmptyState
          title="No Orders Recorded on This Date"
          description="There are no completed or in-progress orders recorded for the selected date. Choose another date from the picker above."
          actionLabel="View Today (16 Sep 2026)"
          onAction={() => setSelectedDate({ start: today, end: today })}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Sales Today Chart (65% width = 8 cols) */}
          <Card className="lg:col-span-8 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-4 border-b border-black/5">
              <div>
                <h2 className="text-base font-bold text-customText">Sales Today</h2>
                <p className="text-xs text-customText-secondary mt-0.5">
                  Hourly revenue flow across store operating hours (8 AM – 10 PM)
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-primary-tint text-primary rounded-pill">
                {selectedDate 
                  ? selectedDate.start === selectedDate.end 
                    ? selectedDate.start === today ? 'Today (16 Sep)' : selectedDate.start
                    : `${selectedDate.start} to ${selectedDate.end}`
                  : 'All Dates'}
              </span>
            </div>

            <div className="pt-4">
              <SalesTrendChart
                data={hourlyData.map(h => ({
                  label: h.hourLabel,
                  sales: h.sales,
                  orders: h.orders,
                }))}
                height={260}
                color="#0C5C3D"
              />
            </div>
          </Card>

          {/* Today's Highlights Panel (35% width = 4 cols) */}
          <Card className="lg:col-span-4 flex flex-col justify-between">
            <div className="pb-3 border-b border-black/5">
              <h2 className="text-base font-bold text-customText">Today's Highlights</h2>
              <p className="text-xs text-customText-secondary mt-0.5">
                Key milestones and daily store velocity
              </p>
            </div>

            <div className="space-y-4 py-3 flex-1 flex flex-col justify-around">
              {/* Best Selling Item */}
              <div className="flex items-center gap-3.5 p-3 rounded-card glass-pill">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  {highlights.bestSellingItem ? (
                    <CategoryIcon category={highlights.bestSellingItem.category} size={18} />
                  ) : (
                    <Award size={18} className="text-amber-800" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-customText-secondary">
                    Best Selling Item
                  </p>
                  <p className="text-sm font-bold text-customText truncate">
                    {highlights.bestSellingItem?.name || 'Caffè Latte'}
                  </p>
                  <p className="text-xs text-primary font-medium">
                    {highlights.bestSellingItem?.quantity || 0} items sold today
                  </p>
                </div>
              </div>

              {/* Peak Hour */}
              <div className="flex items-center gap-3.5 p-3 rounded-card glass-pill">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                  <Clock size={18} className="text-orange-800" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-customText-secondary">
                    Peak Footfall Window
                  </p>
                  <p className="text-sm font-bold text-customText">
                    {highlights.peakHour?.label || '1 PM – 4 PM'}
                  </p>
                  <p className="text-xs text-customText-secondary">
                    {highlights.peakHour?.orderCount || 0} peak hourly orders
                  </p>
                </div>
              </div>

              {/* Total Customers */}
              <div className="flex items-center gap-3.5 p-3 rounded-card glass-pill">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <Users size={18} className="text-emerald-800" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-customText-secondary">
                      Total Customers
                    </p>
                    <div title="Proxy: 1 unique order = 1 customer visit">
                      <Info size={11} className="text-customText-muted cursor-help" />
                    </div>
                  </div>
                  <p className="text-sm font-bold text-customText">
                    {formatIndianNumber(highlights.totalCustomers)} visits
                  </p>
                  {highlights.customersDeltaPct !== null && (
                    <p className="text-xs text-emerald-700 font-semibold">
                      {highlights.customersDeltaPct >= 0 ? '↑' : '↓'} {Math.abs(highlights.customersDeltaPct)}% vs yesterday
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Decorative Quote Strip (DESIGN.md §3) */}
      <GlassCard className="relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6 border-emerald-900/10">
        <div className="text-center sm:text-left">
          <p className="font-['Playfair_Display'] italic text-base sm:text-lg text-emerald-950 font-medium">
            “Great coffee creates a brighter day.”
          </p>
          <p className="text-xs text-emerald-800 font-medium tracking-wide mt-0.5">
            — Starbucks Patna, P&M Mall
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <StarbucksLogo size={52} className="shadow-xs rounded-full" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Store Ops v1.0
          </span>
        </div>
      </GlassCard>
    </div>
  );
};
