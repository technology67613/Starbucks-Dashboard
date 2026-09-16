import React, { useState, useMemo } from 'react';
import {
  Search,
  Eye,
  Plus,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  ShoppingBag,
  CreditCard,
  User,
  Calendar,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useFilter } from '../context/FilterContext';
import { useToast } from '../components/ui/Toast';
import { DerivedOrder, OrderStatus } from '../types/order';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Modal } from '../components/ui/Modal';
import { DatePicker } from '../components/ui/DatePicker';
import { EmptyState } from '../components/ui/EmptyState';
import { formatINR, formatTime12h, formatDatePretty } from '../lib/utils';
import { CategoryIcon } from '../components/ui/CategoryIcon';

export const Orders: React.FC = () => {
  const { orders, today, updateOrderStatus } = useData();
  const {
    ordersStatusFilter,
    setOrdersStatusFilter,
    ordersSearch,
    setOrdersSearch,
    ordersDate,
    setOrdersDate,
  } = useFilter();
  const { showToast } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<DerivedOrder | null>(null);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const pageSize = 10;

  // Filter orders with AND logic (Status + Search + Date)
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // 1. Status Filter
      if (ordersStatusFilter !== 'All') {
        if (ordersStatusFilter === 'Preparing' && (order.status === 'Preparing' || (order.status as any) === 'In Progress')) {
          // match
        } else if (order.status !== ordersStatusFilter) {
          return false;
        }
      }

      // 2. Date Filter
      if (ordersDate && order.order_date !== ordersDate) {
        return false;
      }

      // 3. Search query
      if (ordersSearch.trim()) {
        const q = ordersSearch.toLowerCase().trim();
        const matchesId = order.order_id.toLowerCase().includes(q) || order.order_number.toLowerCase().includes(q);
        const matchesItem = order.item_name.toLowerCase().includes(q);
        const matchesChannel = order.order_type.toLowerCase().includes(q);
        const matchesPayment = order.payment_method.toLowerCase().includes(q);
        const matchesCategory = order.category.toLowerCase().includes(q);
        if (!matchesId && !matchesItem && !matchesChannel && !matchesPayment && !matchesCategory) {
          return false;
        }
      }

      return true;
    });
  }, [orders, ordersStatusFilter, ordersDate, ordersSearch]);

  // Pagination calculation
  const totalFiltered = filteredOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);

  const paginatedOrders = useMemo(() => {
    const start = (validCurrentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, validCurrentPage, pageSize]);

  const startIndex = totalFiltered === 0 ? 0 : (validCurrentPage - 1) * pageSize + 1;
  const endIndex = Math.min(validCurrentPage * pageSize, totalFiltered);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    showToast(`Order #${orderId.split('-')[2] || orderId} marked as ${newStatus}`);
    if (selectedOrder && selectedOrder.order_id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const availableDates = Array.from(new Set(orders.map(o => o.order_date))).sort().reverse();

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Header & New Order Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-customText tracking-tight">
            Orders
          </h1>
          <p className="text-xs sm:text-sm text-customText-secondary mt-1">
            Manage live order flow, statuses, and customer channels for Starbucks Patna
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DatePicker
            value={ordersDate ? { start: ordersDate, end: ordersDate } : null}
            onChange={(d) => {
              setOrdersDate(typeof d === 'string' ? d : (d?.start || ''));
              setCurrentPage(1);
            }}
            availableDates={availableDates}
            label="Date"
          />
          <Button
            variant="primary"
            onClick={() => setShowNewOrderModal(true)}
            className="gap-2 shrink-0"
          >
            <Plus size={16} />
            <span>New Order</span>
          </Button>
        </div>
      </div>

      {/* Filter Tabs Bar + Search */}
      <div className="bg-white rounded-card p-4 border border-black/5 shadow-card space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Segmented Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-surface-muted rounded-btn overflow-x-auto">
            {(['All', 'Completed', 'Preparing', 'Cancelled'] as const).map(tab => {
              const isActive = ordersStatusFilter === tab;
              const count = orders.filter(o => {
                if (ordersDate && o.order_date !== ordersDate) return false;
                if (tab === 'All') return true;
                return o.status === tab;
              }).length;

              return (
                <button
                  key={tab}
                  onClick={() => {
                    setOrdersStatusFilter(tab);
                    setCurrentPage(1);
                  }}
                  className={`px-3.5 py-1.5 rounded-btn text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-customText-secondary hover:text-customText hover:bg-black/5'
                  }`}
                >
                  <span>{tab === 'Preparing' ? 'In Progress' : tab}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-pill font-mono ${
                      isActive ? 'bg-white/20 text-white' : 'bg-black/5 text-customText-secondary'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search within Orders */}
          <div className="relative w-full lg:w-72">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-customText-secondary"
            />
            <input
              type="text"
              value={ordersSearch}
              onChange={e => {
                setOrdersSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search order #, item, channel..."
              className="w-full text-xs sm:text-sm pl-9 pr-3 py-1.5 rounded-btn bg-surface-muted border border-black/5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
            />
            {ordersSearch && (
              <button
                onClick={() => setOrdersSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-customText-muted hover:text-customText text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Orders Table Card */}
      <div className="bg-white rounded-card border border-black/5 shadow-card overflow-hidden">
        {paginatedOrders.length === 0 ? (
          <EmptyState
            title="No Orders Match Your Filters"
            description="Try changing your search query, status tab, or selecting a different date range."
            actionLabel="Reset All Filters"
            onAction={() => {
              setOrdersStatusFilter('All');
              setOrdersSearch('');
              setOrdersDate('');
              setCurrentPage(1);
            }}
            className="border-none"
          />
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-surface-muted/60 border-b border-black/5 text-[11px] font-bold text-customText-secondary uppercase tracking-wider">
                    <th className="py-3.5 px-5"># Order</th>
                    <th className="py-3.5 px-4">Time</th>
                    <th className="py-3.5 px-4">Items & Details</th>
                    <th className="py-3.5 px-4">Channel / Type</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {paginatedOrders.map(order => (
                    <tr
                      key={order.order_id}
                      className="hover:bg-primary-tint/20 transition-colors group cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="py-3.5 px-5 font-mono font-semibold text-customText">
                        {order.order_number}
                      </td>
                      <td className="py-3.5 px-4 text-customText-secondary whitespace-nowrap">
                        <div>{formatTime12h(order.order_time)}</div>
                        <div className="text-[10px] text-customText-muted">
                          {formatDatePretty(order.order_date, false)}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <CategoryIcon category={order.category} size={15} />
                          <span className="font-semibold text-customText">
                            {order.quantity} × {order.item_name}
                          </span>
                        </div>
                        <div className="text-[11px] text-customText-secondary mt-0.5">
                          Size: {order.size} • {order.payment_method}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-btn text-xs font-medium bg-black/5 text-customText">
                          {order.order_type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-customText whitespace-nowrap">
                        {formatINR(order.total_amount)}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="py-3.5 px-5 text-right" onClick={e => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                          className="text-primary hover:text-primary-dark gap-1"
                        >
                          <Eye size={14} />
                          <span>View</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Card Rows (DESIGN.md §7) */}
            <div className="md:hidden divide-y divide-black/5">
              {paginatedOrders.map(order => (
                <div
                  key={order.order_id}
                  onClick={() => setSelectedOrder(order)}
                  className="p-4 space-y-2.5 active:bg-primary-tint/20 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-customText">
                        {order.order_number}
                      </span>
                      <span className="text-xs text-customText-secondary">
                        • {formatTime12h(order.order_time)}
                      </span>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-customText">
                      {order.quantity} × {order.item_name} ({order.size})
                    </span>
                    <span className="font-bold text-primary text-sm">
                      {formatINR(order.total_amount)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-customText-secondary pt-1 border-t border-black/5">
                    <span>{order.order_type} • {order.payment_method}</span>
                    <span className="text-primary font-semibold">View Details →</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 bg-surface-muted/40 border-t border-black/5 text-xs text-customText-secondary">
              <div>
                Showing <span className="font-semibold text-customText">{startIndex}–{endIndex}</span> of{' '}
                <span className="font-semibold text-customText">{totalFiltered}</span> orders
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={validCurrentPage <= 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={14} />
                  <span>Prev</span>
                </Button>

                {/* Numbered Page Buttons */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                    let pageNum = idx + 1;
                    if (totalPages > 5 && validCurrentPage > 3) {
                      pageNum = Math.min(totalPages, validCurrentPage - 2 + idx);
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-7 h-7 rounded-btn text-xs font-semibold flex items-center justify-center transition-colors ${
                          validCurrentPage === pageNum
                            ? 'bg-primary text-white'
                            : 'hover:bg-black/5 text-customText'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  disabled={validCurrentPage >= totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  aria-label="Next page"
                >
                  <span>Next</span>
                  <ChevronRight size={14} />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order ${selectedOrder.order_number}`}
          subtitle={`Placed on ${formatDatePretty(selectedOrder.order_date)} at ${formatTime12h(selectedOrder.order_time)}`}
          maxWidth="md"
        >
          <div className="space-y-5">
            {/* Status & ID Header */}
            <div className="flex items-center justify-between p-3.5 bg-surface-muted rounded-card border border-black/5">
              <div>
                <p className="text-[11px] font-semibold text-customText-secondary uppercase">
                  Order ID
                </p>
                <p className="font-mono font-bold text-sm text-customText">
                  {selectedOrder.order_id}
                </p>
              </div>
              <StatusBadge status={selectedOrder.status} size="md" />
            </div>

            {/* Line Items Breakdown */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-customText-secondary mb-2">
                Order Line Items
              </h4>
              <div className="border border-black/5 rounded-card p-3.5 space-y-3 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-primary-tint rounded-btn">
                      <CategoryIcon category={selectedOrder.category} size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-customText">
                        {selectedOrder.item_name}
                      </p>
                      <p className="text-xs text-customText-secondary">
                        Size: {selectedOrder.size} • Category: {selectedOrder.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-customText">
                      {formatINR(selectedOrder.total_amount)}
                    </p>
                    <p className="text-xs text-customText-secondary">
                      {selectedOrder.quantity} × {formatINR(selectedOrder.unit_price)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Attributes */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-surface-muted/60 rounded-btn border border-black/5">
                <span className="text-customText-secondary block text-[11px]">Channel</span>
                <span className="font-bold text-customText mt-0.5 block">{selectedOrder.order_type}</span>
              </div>
              <div className="p-3 bg-surface-muted/60 rounded-btn border border-black/5">
                <span className="text-customText-secondary block text-[11px]">Payment Method</span>
                <span className="font-bold text-customText mt-0.5 block">{selectedOrder.payment_method}</span>
              </div>
              <div className="p-3 bg-surface-muted/60 rounded-btn border border-black/5">
                <span className="text-customText-secondary block text-[11px]">Outlet</span>
                <span className="font-bold text-customText mt-0.5 block">{selectedOrder.outlet}</span>
              </div>
              <div className="p-3 bg-surface-muted/60 rounded-btn border border-black/5">
                <span className="text-customText-secondary block text-[11px]">Total Paid</span>
                <span className="font-bold text-primary text-sm mt-0.5 block">{formatINR(selectedOrder.total_amount)}</span>
              </div>
            </div>

            {/* Simulated Status Update Action Buttons */}
            <div className="pt-2 border-t border-black/5">
              <p className="text-xs font-semibold text-customText mb-2">
                Update Order Status:
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleStatusChange(selectedOrder.order_id, 'Preparing')}
                  className="text-amber-700 hover:bg-amber-50"
                >
                  <Clock size={13} />
                  <span>Mark Preparing</span>
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleStatusChange(selectedOrder.order_id, 'Completed')}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white"
                >
                  <CheckCircle2 size={13} />
                  <span>Mark Completed</span>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleStatusChange(selectedOrder.order_id, 'Cancelled')}
                >
                  <XCircle size={13} />
                  <span>Cancel Order</span>
                </Button>
              </div>
              {/* Note about backend stub per TRD §6 */}
              <p className="text-[10px] text-customText-muted mt-2 italic">
                * Simulated live status transition. In production, this issues PATCH /api/orders/{selectedOrder.order_id}
              </p>
            </div>
          </div>
        </Modal>
      )}

      {/* New Order Modal Stub */}
      {showNewOrderModal && (
        <Modal
          isOpen={showNewOrderModal}
          onClose={() => setShowNewOrderModal(false)}
          title="Create New POS Order"
          subtitle="Starbucks Patna (P&M Mall) Register"
          maxWidth="md"
        >
          <div className="space-y-4">
            <p className="text-xs text-customText-secondary">
              Create a walk-in or delivery order directly into the Patna store queue.
            </p>
            <div>
              <label className="text-xs font-semibold text-customText block mb-1">
                Select Beverage / Food Item
              </label>
              <select className="w-full text-xs sm:text-sm p-2 rounded-btn border border-black/10 bg-white focus:ring-2 focus:ring-primary/20">
                <option>Caffè Latte (Grande) — ₹255</option>
                <option>Java Chip Frappuccino (Venti) — ₹345</option>
                <option>Butter Croissant — ₹175</option>
                <option>Americano (Tall) — ₹195</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-customText block mb-1">Order Channel</label>
                <select className="w-full text-xs sm:text-sm p-2 rounded-btn border border-black/10 bg-white">
                  <option>Dine-in</option>
                  <option>Takeaway</option>
                  <option>Delivery</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-customText block mb-1">Payment Method</label>
                <select className="w-full text-xs sm:text-sm p-2 rounded-btn border border-black/10 bg-white">
                  <option>UPI</option>
                  <option>Starbucks App Wallet</option>
                  <option>Credit/Debit Card</option>
                  <option>Cash</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-black/5">
              <Button variant="ghost" size="sm" onClick={() => setShowNewOrderModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setShowNewOrderModal(false);
                  showToast('New order created successfully and added to queue!');
                }}
              >
                Place Order
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
