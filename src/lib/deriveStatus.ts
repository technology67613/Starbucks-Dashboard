import { OrderRaw, OrderStatus } from '../types/order';

/**
 * Deterministically derives an order's status based on its order_id and order_date.
 * Grounded in TRD §5 / PRD §6.3:
 * - Historical orders (< pseudo-today):
 *   - Hash < 90  -> Completed (~90%)
 *   - Hash 90-95 -> Cancelled (~6%)
 *   - Hash > 95  -> Completed (ensures historical orders do not remain indefinitely "Preparing")
 * - Pseudo-today orders (order_date === today):
 *   - Hash % 10 < 7 -> Completed (70%)
 *   - Hash % 10 >= 7 -> Preparing (30% in-flight active orders)
 */
export function deriveOrderStatus(order: OrderRaw, todayDate: string): OrderStatus {
  const parts = order.order_id.split('-');
  const numericSuffix = parts.length >= 3 ? parseInt(parts[2], 10) : 0;
  const safeHash = isNaN(numericSuffix) ? 0 : Math.abs(numericSuffix);

  if (order.order_date === todayDate) {
    // 70% Completed, 30% Preparing for active day
    const split = safeHash % 10;
    if (split >= 7) {
      return 'Preparing';
    }
    return 'Completed';
  }

  // Historical records
  const mod100 = safeHash % 100;
  if (mod100 >= 90 && mod100 <= 95) {
    return 'Cancelled';
  }
  return 'Completed';
}

/**
 * Derives a clean short display order number (e.g. "SBX-PAT-5214" -> "#5214")
 */
export function deriveOrderNumber(orderId: string): string {
  const parts = orderId.split('-');
  return parts.length >= 3 ? `#${parts[2]}` : `#${orderId}`;
}
