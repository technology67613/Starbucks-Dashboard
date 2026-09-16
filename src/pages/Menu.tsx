import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Coffee,
  Check,
  ToggleLeft,
  ToggleRight,
  MoreVertical,
  SlidersHorizontal,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useToast } from '../components/ui/Toast';
import { Category, MenuItem } from '../types/order';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { ProductImage, CategoryIcon } from '../components/ui/CategoryIcon';
import { formatINR } from '../lib/utils';

export const Menu: React.FC = () => {
  const { menuItems, toggleItemAvailability, addMenuItem } = useData();
  const { showToast } = useToast();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New item form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<Category>('Hot Beverages');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [formError, setFormError] = useState('');

  const categories: (Category | 'All')[] = [
    'All',
    'Hot Beverages',
    'Cold Beverages',
    'Bakery',
    'Food',
    'Merchandise',
  ];

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
      }
      return true;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  const handleToggle = (item: MenuItem) => {
    toggleItemAvailability(item.name);
    showToast(
      `${item.name} is now ${!item.isAvailable ? 'In Stock' : 'Marked Out of Stock'}`,
      !item.isAvailable ? 'success' : 'info'
    );
  };

  const handleAddItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) {
      setFormError('Please enter an item name');
      return;
    }
    const price = parseInt(newItemPrice, 10);
    if (isNaN(price) || price <= 0) {
      setFormError('Please enter a valid price in ₹');
      return;
    }

    addMenuItem({
      name: newItemName.trim(),
      category: newItemCategory,
      basePrice: price,
      sizes: [{ size: 'Regular', price }],
      isAvailable: true,
    });

    showToast(`"${newItemName}" added to Patna store menu!`, 'success');
    setShowAddModal(false);
    setNewItemName('');
    setNewItemPrice('');
    setFormError('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-customText tracking-tight">
            Menu Catalog
          </h1>
          <p className="text-xs sm:text-sm text-customText-secondary mt-1">
            Manage 19 authentic Starbucks Patna items, sizes, prices, and daily availability
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setShowAddModal(true)}
          className="gap-2 shrink-0 self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add Menu Item</span>
        </Button>
      </div>

      {/* Categories Pill Bar & Search */}
      <div className="bg-white rounded-card p-4 border border-black/5 shadow-card space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap pb-1 md:pb-0">
            {categories.map(cat => {
              const isActive = selectedCategory === cat;
              const count = cat === 'All'
                ? menuItems.length
                : menuItems.filter(i => i.category === cat).length;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-btn text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-surface-muted text-customText-secondary hover:text-customText hover:bg-black/5'
                  }`}
                >
                  {cat !== 'All' && <CategoryIcon category={cat} size={13} className={isActive ? 'text-white' : ''} />}
                  <span>{cat}</span>
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
              placeholder="Search beverages, bakery, food..."
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

      {/* Menu Cards Grid (4-up desktop, 2-up tablet, 1-up mobile) */}
      {filteredItems.length === 0 ? (
        <EmptyState
          title="No Items Found in This Category"
          description="Try selecting another category or clearing your search keywords."
          actionLabel="View All Menu Items"
          onAction={() => {
            setSelectedCategory('All');
            setSearchQuery('');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredItems.map(item => (
            <Card
              key={item.name}
              className={`flex flex-col justify-between p-4 transition-all duration-200 relative ${
                !item.isAvailable ? 'opacity-70 bg-gray-50/80' : 'hover:shadow-hover'
              }`}
            >
              <div>
                {/* Authentic Product Photography with Fallback */}
                <ProductImage name={item.name} category={item.category} />

                {/* Details */}
                <div className="mt-3.5 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold text-customText leading-snug">
                      {item.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 pt-0.5">
                    <Badge variant="neutral" className="text-[10px] py-0 px-2">
                      {item.category}
                    </Badge>
                    <span className="text-[11px] text-customText-muted">
                      {item.orderCount} orders in CSV
                    </span>
                  </div>

                  {/* Available Sizes Pills */}
                  {item.sizes && item.sizes.length > 1 && (
                    <div className="flex flex-wrap gap-1 pt-1.5">
                      {item.sizes.map(s => (
                        <span
                          key={s.size}
                          className="text-[10px] font-medium bg-black/5 px-1.5 py-0.5 rounded text-customText-secondary"
                        >
                          {s.size}: {formatINR(s.price)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Price & Availability Toggle Footer */}
              <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-customText-secondary block uppercase font-medium">
                    Base Price
                  </span>
                  <span className="text-lg font-bold text-customText">
                    {formatINR(item.basePrice)}
                  </span>
                </div>

                <button
                  onClick={() => handleToggle(item)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-pill text-xs font-semibold transition-all ${
                    item.isAvailable
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-100'
                      : 'bg-rose-50 text-rose-700 border border-rose-200/80 hover:bg-rose-100'
                  }`}
                  aria-label={`Toggle availability for ${item.name}`}
                >
                  <span className={`w-2 h-2 rounded-full ${item.isAvailable ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                  <span>{item.isAvailable ? 'In Stock' : 'Out of Stock'}</span>
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Item Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setFormError('');
          }}
          title="Add New Menu Item"
          subtitle="Starbucks Patna (P&M Mall) Catalog"
          maxWidth="md"
        >
          <form onSubmit={handleAddItemSubmit} className="space-y-4">
            {formError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-btn text-xs">
                {formError}
              </div>
            )}

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-customText-secondary block mb-1">
                Item Name
              </label>
              <input
                type="text"
                value={newItemName}
                onChange={e => setNewItemName(e.target.value)}
                placeholder="e.g. Hazelnut Mocha Latte"
                className="w-full text-xs sm:text-sm p-2.5 rounded-btn border border-black/10 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-customText-secondary block mb-1">
                  Category
                </label>
                <select
                  value={newItemCategory}
                  onChange={e => setNewItemCategory(e.target.value as Category)}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-btn border border-black/10 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Hot Beverages">Hot Beverages</option>
                  <option value="Cold Beverages">Cold Beverages</option>
                  <option value="Bakery">Bakery</option>
                  <option value="Food">Food</option>
                  <option value="Merchandise">Merchandise</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-customText-secondary block mb-1">
                  Base Price (₹)
                </label>
                <input
                  type="number"
                  value={newItemPrice}
                  onChange={e => setNewItemPrice(e.target.value)}
                  placeholder="e.g. 295"
                  className="w-full text-xs sm:text-sm p-2.5 rounded-btn border border-black/10 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-black/5">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowAddModal(false);
                  setFormError('');
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Item
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
