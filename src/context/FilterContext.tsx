import React, { createContext, useContext, useState } from 'react';
import { OrderStatus } from '../types/order';

interface DateRange {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}

interface FilterContextType {
  // Orders filters
  ordersStatusFilter: 'All' | OrderStatus;
  setOrdersStatusFilter: (status: 'All' | OrderStatus) => void;
  ordersSearch: string;
  setOrdersSearch: (query: string) => void;
  ordersDate: string; // Specific date or '' for all
  setOrdersDate: (date: string) => void;
  
  // Reports filters
  reportsDateRange: DateRange;
  setReportsDateRange: (range: DateRange) => void;
  reportsActiveTab: 'overview' | 'sales' | 'orders' | 'topItems';
  setReportsActiveTab: (tab: 'overview' | 'sales' | 'orders' | 'topItems') => void;

  // Global search
  globalSearch: string;
  setGlobalSearch: (query: string) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ordersStatusFilter, setOrdersStatusFilter] = useState<'All' | OrderStatus>('All');
  const [ordersSearch, setOrdersSearch] = useState<string>('');
  const [ordersDate, setOrdersDate] = useState<string>('2026-09-16'); // Defaults to pseudo-today
  
  const [reportsDateRange, setReportsDateRange] = useState<DateRange>({
    startDate: '2025-07-01',
    endDate: '2025-09-14',
  });
  const [reportsActiveTab, setReportsActiveTab] = useState<'overview' | 'sales' | 'orders' | 'topItems'>('overview');
  const [globalSearch, setGlobalSearch] = useState<string>('');

  return (
    <FilterContext.Provider
      value={{
        ordersStatusFilter,
        setOrdersStatusFilter,
        ordersSearch,
        setOrdersSearch,
        ordersDate,
        setOrdersDate,
        reportsDateRange,
        setReportsDateRange,
        reportsActiveTab,
        setReportsActiveTab,
        globalSearch,
        setGlobalSearch,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};
