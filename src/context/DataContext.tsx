import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { DerivedOrder, MenuItem, OrderStatus, OrderRaw } from '../types/order';
import { InventoryItem } from '../types/inventory';
import { parseOrdersCsv } from '../lib/parseOrders';
import { extractMenuItems } from '../lib/aggregations';
import { getPreviousDate } from '../lib/todayLogic';
import rawInventoryData from '../data/inventory.json';
import csvContent from '../data/mock_starbucks_patna_dataset.csv?raw';

interface DataContextType {
  orders: DerivedOrder[];
  rawOrders: OrderRaw[];
  inventory: InventoryItem[];
  menuItems: MenuItem[];
  today: string;
  previousDate: string | null;
  loading: boolean;
  error: string | null;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  toggleItemAvailability: (itemName: string) => void;
  addMenuItem: (item: Omit<MenuItem, 'orderCount'>) => void;
  updateInventoryStock: (itemId: string, newStock: number) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'last_updated'>) => void;
  resetData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<DerivedOrder[]>([]);
  const [rawOrders, setRawOrders] = useState<OrderRaw[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>(rawInventoryData as InventoryItem[]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [today, setToday] = useState<string>('2025-09-14');
  const [previousDate, setPreviousDate] = useState<string | null>('2025-09-13');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const { raw, derived, today: computedToday } = parseOrdersCsv(csvContent);
      setRawOrders(raw);
      setOrders(derived);
      setToday(computedToday);
      
      const prev = getPreviousDate(raw, computedToday);
      setPreviousDate(prev);

      const items = extractMenuItems(raw);
      setMenuItems(items);
      setLoading(false);

      // Console verification check per TRD §5 & PROMPTS.md Prompt 02
      const totalRevenue = derived.reduce((acc, o) => acc + o.total_amount, 0);
      const todayOrdersCount = derived.filter(o => o.order_date === computedToday).length;
      console.log('--- Starbucks Patna Data Layer Initialized ---');
      console.log(`Total Orders: ${derived.length} (Expected: 273)`);
      console.log(`Total Revenue: ₹${totalRevenue.toLocaleString('en-IN')} (Expected: ₹1,31,200)`);
      console.log(`Pseudo-Today: ${computedToday} with ${todayOrdersCount} orders (Expected: 15)`);
      console.log(`Prior Date: ${prev} (Expected: 2025-09-13)`);
      console.log('---------------------------------------------');
    } catch (err) {
      console.error('Failed to parse dataset:', err);
      setError(err instanceof Error ? err.message : 'Unknown CSV parse error');
      setLoading(false);
    }
  }, []);

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(order => 
      order.order_id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const toggleItemAvailability = (itemName: string) => {
    setMenuItems(prev => prev.map(item => 
      item.name === itemName ? { ...item, isAvailable: !item.isAvailable } : item
    ));
  };

  const addMenuItem = (newItem: Omit<MenuItem, 'orderCount'>) => {
    setMenuItems(prev => [
      {
        ...newItem,
        orderCount: 0,
      },
      ...prev,
    ]);
  };

  const updateInventoryStock = (itemId: string, newStock: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === itemId) {
        let status: InventoryItem['status'] = 'In Stock';
        if (newStock <= 0) {
          status = 'Out of Stock';
        } else if (newStock <= item.min_threshold) {
          status = 'Low Stock';
        }
        return {
          ...item,
          current_stock: newStock,
          status,
          last_updated: 'Just now',
        };
      }
      return item;
    }));
  };

  const addInventoryItem = (newItem: Omit<InventoryItem, 'id' | 'last_updated'>) => {
    const id = `INV-${String(inventory.length + 1).padStart(3, '0')}`;
    const item: InventoryItem = {
      ...newItem,
      id,
      last_updated: 'Just now',
    };
    setInventory(prev => [item, ...prev]);
  };

  const resetData = () => {
    const { raw, derived, today: computedToday } = parseOrdersCsv(csvContent);
    setRawOrders(raw);
    setOrders(derived);
    setToday(computedToday);
    setPreviousDate(getPreviousDate(raw, computedToday));
    setMenuItems(extractMenuItems(raw));
    setInventory(rawInventoryData as InventoryItem[]);
  };

  const value = useMemo(() => ({
    orders,
    rawOrders,
    inventory,
    menuItems,
    today,
    previousDate,
    loading,
    error,
    updateOrderStatus,
    toggleItemAvailability,
    addMenuItem,
    updateInventoryStock,
    addInventoryItem,
    resetData,
  }), [orders, rawOrders, inventory, menuItems, today, previousDate, loading, error]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
