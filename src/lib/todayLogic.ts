import { OrderRaw } from '../types/order';

/**
 * Computes the pseudo-"today" date dynamically as the latest date present in the dataset.
 */
export function getPseudoToday(orders: OrderRaw[]): string {
  if (!orders || orders.length === 0) return '2026-09-16';
  
  return orders.reduce((latest, curr) => {
    return curr.order_date > latest ? curr.order_date : latest;
  }, orders[0].order_date);
}

/**
 * Computes the prior date present in the dataset (for period-over-period deltas).
 */
export function getPreviousDate(orders: OrderRaw[], currentDate: string): string | null {
  if (!orders || orders.length === 0) return null;
  
  const distinctDates = Array.from(new Set(orders.map(o => o.order_date)))
    .filter(d => d < currentDate)
    .sort()
    .reverse();
    
  return distinctDates[0] || null;
}

/**
 * Returns dynamic greeting based on actual system clock time (Morning / Afternoon / Evening)
 */
export function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}
