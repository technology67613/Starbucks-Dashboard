import Papa from 'papaparse';
import { OrderRaw, DerivedOrder, Category, PaymentMethod, OrderType } from '../types/order';
import { getPseudoToday } from './todayLogic';
import { deriveOrderStatus, deriveOrderNumber } from './deriveStatus';

export interface RawCsvRow {
  order_id: string;
  order_date: string;
  order_time: string;
  outlet: string;
  item_name: string;
  category: string;
  size: string;
  quantity: string | number;
  unit_price: string | number;
  total_amount: string | number;
  payment_method: string;
  order_type: string;
}

/**
 * Parses raw CSV string or file content into typed OrderRaw[] and DerivedOrder[]
 */
export function parseOrdersCsv(csvContent: string): { raw: OrderRaw[]; derived: DerivedOrder[]; today: string } {
  const result = Papa.parse<RawCsvRow>(csvContent, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
  });

  if (result.errors && result.errors.length > 0) {
    console.warn('PapaParse warnings/errors:', result.errors);
  }

  const raw: OrderRaw[] = result.data
    .filter(row => row.order_id && row.order_date)
    .map(row => {
      const quantity = Number(row.quantity) || 1;
      const unit_price = Number(row.unit_price) || 0;
      const total_amount = Number(row.total_amount) || (unit_price * quantity);

      return {
        order_id: (row.order_id || '').trim(),
        order_date: (row.order_date || '').trim(),
        order_time: (row.order_time || '').trim(),
        outlet: (row.outlet || 'P&M Mall').trim(),
        item_name: (row.item_name || '').trim(),
        category: (row.category || 'Hot Beverages').trim() as Category,
        size: (row.size || 'Regular').trim(),
        quantity,
        unit_price,
        total_amount,
        payment_method: (row.payment_method || 'Cash').trim() as PaymentMethod,
        order_type: (row.order_type || 'Dine-in').trim() as OrderType,
      };
    });

  const today = getPseudoToday(raw);

  const derived: DerivedOrder[] = raw.map(order => ({
    ...order,
    status: deriveOrderStatus(order, today),
    order_number: deriveOrderNumber(order.order_id),
  }));

  return { raw, derived, today };
}
