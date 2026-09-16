export type Category = 
  | "Hot Beverages" 
  | "Cold Beverages" 
  | "Bakery" 
  | "Food" 
  | "Merchandise";

export type PaymentMethod = 
  | "Starbucks App Wallet" 
  | "Credit/Debit Card" 
  | "UPI" 
  | "Cash";

export type OrderType = 
  | "Dine-in" 
  | "Takeaway" 
  | "Delivery";

export type OrderStatus = 
  | "Completed" 
  | "Preparing" 
  | "Cancelled";

export interface OrderRaw {
  order_id: string;
  order_date: string;
  order_time: string;
  outlet: string;
  item_name: string;
  category: Category;
  size: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  payment_method: PaymentMethod;
  order_type: OrderType;
}

export interface DerivedOrder extends OrderRaw {
  status: OrderStatus;
  order_number: string; // Shortened clean order ID e.g. #5214
}

export interface MenuItem {
  name: string;
  category: Category;
  basePrice: number;
  sizes: { size: string; price: number }[];
  isAvailable: boolean;
  orderCount: number;
}
