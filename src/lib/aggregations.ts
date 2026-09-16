import { DerivedOrder, OrderRaw, Category, MenuItem } from '../types/order';

export interface KPISummary {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  salesDeltaPct: number | null;
  ordersDeltaPct: number | null;
  aovDeltaPct: number | null;
}

export interface HourlyDataPoint {
  hour24: number;
  hourLabel: string;
  sales: number;
  orders: number;
}

export interface TodayHighlights {
  bestSellingItem: {
    name: string;
    quantity: number;
    category: Category;
  } | null;
  peakHour: {
    label: string;
    orderCount: number;
  } | null;
  totalCustomers: number;
  customersDeltaPct: number | null;
}

export interface CategoryBreakdown {
  category: Category;
  totalSales: number;
  orderCount: number;
  percentage: number;
  color: string;
}

export interface TopItemData {
  rank: number;
  name: string;
  category: Category;
  quantitySold: number;
  totalRevenue: number;
  percentageOfTotal: number;
}

export interface DailyTrendPoint {
  date: string;
  formattedDate: string;
  sales: number;
  orders: number;
}

export const CATEGORY_COLORS: Record<Category, string> = {
  'Hot Beverages': '#0C5C3D',
  'Cold Beverages': '#10B981',
  'Bakery': '#F59E0B',
  'Food': '#EF4444',
  'Merchandise': '#6366F1',
};

/**
 * Calculates KPI summary including comparison deltas
 */
export function calculateKPIs(currentOrders: DerivedOrder[], previousOrders: DerivedOrder[] = []): KPISummary {
  const totalSales = currentOrders.reduce((acc, o) => acc + o.total_amount, 0);
  const totalOrders = currentOrders.length;
  const averageOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

  let salesDeltaPct: number | null = null;
  let ordersDeltaPct: number | null = null;
  let aovDeltaPct: number | null = null;

  if (previousOrders.length > 0) {
    const prevSales = previousOrders.reduce((acc, o) => acc + o.total_amount, 0);
    const prevOrders = previousOrders.length;
    const prevAov = prevOrders > 0 ? prevSales / prevOrders : 0;

    if (prevSales > 0) {
      salesDeltaPct = Math.round(((totalSales - prevSales) / prevSales) * 100);
    }
    if (prevOrders > 0) {
      ordersDeltaPct = Math.round(((totalOrders - prevOrders) / prevOrders) * 100);
    }
    if (prevAov > 0) {
      aovDeltaPct = Math.round(((averageOrderValue - prevAov) / prevAov) * 100);
    }
  }

  return {
    totalSales,
    totalOrders,
    averageOrderValue,
    salesDeltaPct,
    ordersDeltaPct,
    aovDeltaPct,
  };
}

/**
 * Computes hourly breakdown for a specific date (defaults to hours 8 AM to 10 PM)
 */
export function calculateHourlySales(orders: DerivedOrder[]): HourlyDataPoint[] {
  const hourMap = new Map<number, { sales: number; orders: number }>();

  // Initialize store operating hours (8 AM to 10 PM: 8 to 22)
  for (let h = 8; h <= 22; h += 2) {
    hourMap.set(h, { sales: 0, orders: 0 });
  }

  for (const order of orders) {
    if (!order.order_time) continue;
    const h = parseInt(order.order_time.split(':')[0], 10);
    if (isNaN(h)) continue;

    // Find closest bucket (even hours: 8, 10, 12, 14, 16, 18, 20, 22)
    const bucket = Math.min(22, Math.max(8, Math.floor(h / 2) * 2));
    const current = hourMap.get(bucket) || { sales: 0, orders: 0 };
    hourMap.set(bucket, {
      sales: current.sales + order.total_amount,
      orders: current.orders + 1,
    });
  }

  const result: HourlyDataPoint[] = [];
  for (let h = 8; h <= 22; h += 2) {
    const val = hourMap.get(h) || { sales: 0, orders: 0 };
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    result.push({
      hour24: h,
      hourLabel: `${hour12} ${ampm}`,
      sales: val.sales,
      orders: val.orders,
    });
  }

  return result;
}

/**
 * Computes Today's Highlights panel data defensively
 */
export function calculateTodayHighlights(todayOrders: DerivedOrder[], prevDayOrders: DerivedOrder[] = []): TodayHighlights {
  if (todayOrders.length === 0) {
    return {
      bestSellingItem: null,
      peakHour: null,
      totalCustomers: 0,
      customersDeltaPct: null,
    };
  }

  // 1. Best Selling Item
  const itemCounts = new Map<string, { qty: number; category: Category }>();
  for (const order of todayOrders) {
    const prev = itemCounts.get(order.item_name) || { qty: 0, category: order.category };
    itemCounts.set(order.item_name, {
      qty: prev.qty + order.quantity,
      category: order.category,
    });
  }

  let bestItem: { name: string; quantity: number; category: Category } | null = null;
  let maxQty = -1;
  for (const [name, info] of itemCounts.entries()) {
    if (info.qty > maxQty) {
      maxQty = info.qty;
      bestItem = { name, quantity: info.qty, category: info.category };
    }
  }

  // 2. Peak Hour computation
  const hourOrders = new Map<number, number>();
  for (const order of todayOrders) {
    const h = parseInt(order.order_time.split(':')[0], 10);
    hourOrders.set(h, (hourOrders.get(h) || 0) + 1);
  }

  let peakH = 14;
  let maxHCount = 0;
  for (const [h, cnt] of hourOrders.entries()) {
    if (cnt > maxHCount) {
      maxHCount = cnt;
      peakH = h;
    }
  }

  // Convert to nice window e.g. "1 PM – 4 PM" or "4 PM – 6 PM"
  const start12 = peakH % 12 || 12;
  const startAmPm = peakH >= 12 ? 'PM' : 'AM';
  const endH = Math.min(22, peakH + 2);
  const end12 = endH % 12 || 12;
  const endAmPm = endH >= 12 ? 'PM' : 'AM';
  const peakHourLabel = `${start12} ${startAmPm} – ${end12} ${endAmPm}`;

  // 3. Customers proxy
  const totalCustomers = todayOrders.length;
  let customersDeltaPct: number | null = null;
  if (prevDayOrders.length > 0) {
    customersDeltaPct = Math.round(((totalCustomers - prevDayOrders.length) / prevDayOrders.length) * 100);
  }

  return {
    bestSellingItem: bestItem,
    peakHour: {
      label: peakHourLabel,
      orderCount: maxHCount,
    },
    totalCustomers,
    customersDeltaPct,
  };
}

/**
 * Computes breakdown by 5 real categories
 */
export function calculateCategoryBreakdown(orders: DerivedOrder[]): CategoryBreakdown[] {
  const totalRevenue = orders.reduce((acc, o) => acc + o.total_amount, 0);
  const catMap = new Map<Category, { sales: number; orders: number }>();
  
  const allCategories: Category[] = [
    'Hot Beverages',
    'Cold Beverages',
    'Bakery',
    'Food',
    'Merchandise',
  ];

  allCategories.forEach(cat => catMap.set(cat, { sales: 0, orders: 0 }));

  for (const order of orders) {
    const curr = catMap.get(order.category) || { sales: 0, orders: 0 };
    catMap.set(order.category, {
      sales: curr.sales + order.total_amount,
      orders: curr.orders + 1,
    });
  }

  return allCategories.map(category => {
    const data = catMap.get(category) || { sales: 0, orders: 0 };
    const percentage = totalRevenue > 0 ? Math.round((data.sales / totalRevenue) * 100) : 0;
    return {
      category,
      totalSales: data.sales,
      orderCount: data.orders,
      percentage,
      color: CATEGORY_COLORS[category],
    };
  });
}

/**
 * Computes Top N selling items
 */
export function calculateTopSellingItems(orders: DerivedOrder[], topN = 5): TopItemData[] {
  const totalRevenue = orders.reduce((acc, o) => acc + o.total_amount, 0);
  const itemMap = new Map<string, { category: Category; qty: number; revenue: number }>();

  for (const order of orders) {
    const curr = itemMap.get(order.item_name) || { category: order.category, qty: 0, revenue: 0 };
    itemMap.set(order.item_name, {
      category: order.category,
      qty: curr.qty + order.quantity,
      revenue: curr.revenue + order.total_amount,
    });
  }

  const sorted = Array.from(itemMap.entries())
    .map(([name, val]) => ({
      name,
      category: val.category,
      quantitySold: val.qty,
      totalRevenue: val.revenue,
      percentageOfTotal: totalRevenue > 0 ? Math.round((val.revenue / totalRevenue) * 100) : 0,
    }))
    .sort((a, b) => b.quantitySold - a.quantitySold || b.totalRevenue - a.totalRevenue);

  return sorted.slice(0, topN).map((item, idx) => ({
    ...item,
    rank: idx + 1,
  }));
}

/**
 * Computes daily trend array for date range
 */
export function calculateDailyTrend(orders: DerivedOrder[]): DailyTrendPoint[] {
  const dateMap = new Map<string, { sales: number; orders: number }>();

  for (const order of orders) {
    const curr = dateMap.get(order.order_date) || { sales: 0, orders: 0 };
    dateMap.set(order.order_date, {
      sales: curr.sales + order.total_amount,
      orders: curr.orders + 1,
    });
  }

  const sortedDates = Array.from(dateMap.keys()).sort();

  return sortedDates.map(date => {
    const data = dateMap.get(date)!;
    const [, month, day] = date.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = months[parseInt(month, 10) - 1] || month;

    return {
      date,
      formattedDate: `${parseInt(day, 10)} ${monthName}`,
      sales: data.sales,
      orders: data.orders,
    };
  });
}

/**
 * Extracts unique menu items (19 items) from CSV
 */
export function extractMenuItems(orders: OrderRaw[]): MenuItem[] {
  const itemMap = new Map<string, {
    category: Category;
    sizes: Map<string, number>;
    orderCount: number;
  }>();

  for (const order of orders) {
    let item = itemMap.get(order.item_name);
    if (!item) {
      item = {
        category: order.category,
        sizes: new Map<string, number>(),
        orderCount: 0,
      };
      itemMap.set(order.item_name, item);
    }
    item.orderCount += 1;
    item.sizes.set(order.size, order.unit_price);
  }

  return Array.from(itemMap.entries()).map(([name, data]) => {
    const sizeArray = Array.from(data.sizes.entries()).map(([size, price]) => ({ size, price }));
    const basePrice = sizeArray.length > 0 ? Math.min(...sizeArray.map(s => s.price)) : 0;

    return {
      name,
      category: data.category,
      basePrice,
      sizes: sizeArray,
      isAvailable: true,
      orderCount: data.orderCount,
    };
  }).sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
}
