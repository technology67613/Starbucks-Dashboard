import React, { useState, useMemo } from 'react';
import {
  Boxes,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  ArrowUpDown,
  Edit2,
  Minus,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useToast } from '../components/ui/Toast';
import { InventoryItem, StockStatus } from '../types/inventory';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';

export const Inventory: React.FC = () => {
  const { inventory, updateInventoryStock, addInventoryItem } = useData();
  const { showToast } = useToast();

  const [statusFilter, setStatusFilter] = useState<'All' | StockStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItemForEdit, setSelectedItemForEdit] = useState<InventoryItem | null>(null);

  // New stock item form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<InventoryItem['category']>('Raw Material');
  const [newItemStock, setNewItemStock] = useState('');
  const [newItemMinThreshold, setNewItemMinThreshold] = useState('');
  const [newItemUnit, setNewItemUnit] = useState<InventoryItem['unit']>('kg');

  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      if (statusFilter !== 'All' && item.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          item.item.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [inventory, statusFilter, searchQuery]);

  const handleStockAdjust = (item: InventoryItem, delta: number) => {
    const newStock = Math.max(0, item.current_stock + delta);
    updateInventoryStock(item.id, newStock);
    showToast(`Updated ${item.item} stock to ${newStock} ${item.unit}`);
  };

  const handleAddStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const stock = parseFloat(newItemStock) || 0;
    const threshold = parseFloat(newItemMinThreshold) || 5;

    let status: StockStatus = 'In Stock';
    if (stock <= 0) status = 'Out of Stock';
    else if (stock <= threshold) status = 'Low Stock';

    addInventoryItem({
      item: newItemName.trim(),
      category: newItemCategory,
      current_stock: stock,
      min_threshold: threshold,
      unit: newItemUnit,
      status,
    });

    showToast(`Added "${newItemName}" to store inventory!`);
    setShowAddModal(false);
    setNewItemName('');
    setNewItemStock('');
    setNewItemMinThreshold('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-customText tracking-tight">
            Inventory & Raw Materials
          </h1>
          <p className="text-xs sm:text-sm text-customText-secondary mt-1">
            Track espresso beans, dairy, cups, syrups, and fresh food levels for Starbucks Patna
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setShowAddModal(true)}
          className="gap-2 shrink-0 self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add Stock Item</span>
        </Button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white rounded-card p-4 border border-black/5 shadow-card space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Segmented Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-surface-muted rounded-btn overflow-x-auto">
            {(['All', 'In Stock', 'Low Stock', 'Out of Stock'] as const).map(tab => {
              const isActive = statusFilter === tab;
              const count = tab === 'All'
                ? inventory.length
                : inventory.filter(i => i.status === tab).length;

              return (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3.5 py-1.5 rounded-btn text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-customText-secondary hover:text-customText hover:bg-black/5'
                  }`}
                >
                  <span>{tab === 'All' ? 'All Items' : tab}</span>
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

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-customText-secondary"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search raw material, cups, syrup..."
              className="w-full text-xs sm:text-sm pl-9 pr-3 py-1.5 rounded-btn bg-surface-muted border border-black/5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-customText-muted hover:text-customText text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-card border border-black/5 shadow-card overflow-hidden">
        {filteredInventory.length === 0 ? (
          <EmptyState
            title="No Inventory Items Match This Filter"
            description="Try switching tabs or resetting your search term to see all warehouse materials."
            actionLabel="View All Stock Items"
            onAction={() => {
              setStatusFilter('All');
              setSearchQuery('');
            }}
            className="border-none"
          />
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-surface-muted/60 border-b border-black/5 text-[11px] font-bold text-customText-secondary uppercase tracking-wider">
                    <th className="py-3.5 px-5">Item Name</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Current Stock</th>
                    <th className="py-3.5 px-4">Min. Threshold</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Last Updated</th>
                    <th className="py-3.5 px-5 text-right">Quick Stock Adjust</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {filteredInventory.map(item => (
                    <tr key={item.id} className="hover:bg-primary-tint/20 transition-colors">
                      <td className="py-3.5 px-5">
                        <span className="font-bold text-customText block">{item.item}</span>
                        <span className="text-[10px] text-customText-muted font-mono">{item.id}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-btn text-xs font-medium bg-black/5 text-customText">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-customText">
                        <span className="text-sm">{item.current_stock}</span>{' '}
                        <span className="text-xs text-customText-secondary font-normal">{item.unit}</span>
                      </td>
                      <td className="py-3.5 px-4 text-customText-secondary">
                        {item.min_threshold} {item.unit}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="py-3.5 px-4 text-xs text-customText-secondary">
                        {item.last_updated}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="inline-flex items-center gap-1">
                          <Button
                            variant="secondary"
                            size="icon"
                            className="h-7 w-7 p-0"
                            onClick={() => handleStockAdjust(item, -1)}
                            disabled={item.current_stock <= 0}
                            title="Decrease stock by 1"
                          >
                            <Minus size={12} />
                          </Button>
                          <Button
                            variant="secondary"
                            size="icon"
                            className="h-7 w-7 p-0"
                            onClick={() => handleStockAdjust(item, 1)}
                            title="Increase stock by 1"
                          >
                            <Plus size={12} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Cards (DESIGN.md §7) */}
            <div className="md:hidden divide-y divide-black/5">
              {filteredInventory.map(item => (
                <div key={item.id} className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-customText text-sm">{item.item}</h4>
                      <p className="text-[11px] text-customText-secondary font-mono">{item.id} • {item.category}</p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <div>
                      <span className="text-customText-secondary block text-[10px]">Stock Level:</span>
                      <span className="font-bold text-customText text-sm">
                        {item.current_stock} {item.unit}
                      </span>
                      <span className="text-[10px] text-customText-muted ml-1">
                        (min {item.min_threshold})
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleStockAdjust(item, -1)}
                        disabled={item.current_stock <= 0}
                      >
                        <Minus size={12} />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleStockAdjust(item, 1)}
                      >
                        <Plus size={12} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Add Stock Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add Warehouse Stock Item"
          subtitle="Starbucks Patna (P&M Mall) Inventory"
          maxWidth="md"
        >
          <form onSubmit={handleAddStockSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-customText-secondary block mb-1">
                Item / Material Name
              </label>
              <input
                type="text"
                required
                value={newItemName}
                onChange={e => setNewItemName(e.target.value)}
                placeholder="e.g. Caramel Drizzle Squeeze Bottle"
                className="w-full text-xs sm:text-sm p-2.5 rounded-btn border border-black/10 bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-customText-secondary block mb-1">
                  Category
                </label>
                <select
                  value={newItemCategory}
                  onChange={e => setNewItemCategory(e.target.value as any)}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-btn border border-black/10 bg-white"
                >
                  <option value="Raw Material">Raw Material</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Packaging">Packaging</option>
                  <option value="Syrup">Syrup</option>
                  <option value="Ingredient">Ingredient</option>
                  <option value="Food">Food</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-customText-secondary block mb-1">
                  Unit of Measure
                </label>
                <select
                  value={newItemUnit}
                  onChange={e => setNewItemUnit(e.target.value as any)}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-btn border border-black/10 bg-white"
                >
                  <option value="kg">kg (Kilograms)</option>
                  <option value="L">L (Liters)</option>
                  <option value="pcs">pcs (Pieces)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-customText-secondary block mb-1">
                  Initial Stock
                </label>
                <input
                  type="number"
                  required
                  value={newItemStock}
                  onChange={e => setNewItemStock(e.target.value)}
                  placeholder="e.g. 10"
                  className="w-full text-xs sm:text-sm p-2.5 rounded-btn border border-black/10 bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-customText-secondary block mb-1">
                  Low Stock Threshold
                </label>
                <input
                  type="number"
                  required
                  value={newItemMinThreshold}
                  onChange={e => setNewItemMinThreshold(e.target.value)}
                  placeholder="e.g. 3"
                  className="w-full text-xs sm:text-sm p-2.5 rounded-btn border border-black/10 bg-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-black/5">
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Stock Item
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
