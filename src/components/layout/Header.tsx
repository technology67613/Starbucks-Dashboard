import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Bell,
  MapPin,
  Menu as MenuIcon,
  CheckCircle2,
  ChevronDown,
  User,
  ShieldCheck,
} from 'lucide-react';
import { useFilter } from '../../context/FilterContext';
import { useData } from '../../context/DataContext';
import { PageId } from './Sidebar';

interface HeaderProps {
  activePage: PageId;
  onOpenMobileNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activePage, onOpenMobileNav }) => {
  const { globalSearch, setGlobalSearch, setOrdersSearch } = useFilter();
  const { orders, menuItems, inventory } = useData();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Search logic
  const searchResults = React.useMemo(() => {
    if (!globalSearch.trim()) return null;
    const q = globalSearch.toLowerCase().trim();
    return {
      orders: orders.filter(o => o.order_id.toLowerCase().includes(q) || o.item_name.toLowerCase().includes(q)).slice(0, 3),
      menu: menuItems.filter(m => m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q)).slice(0, 3),
      inventory: inventory.filter(i => i.item.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)).slice(0, 3)
    };
  }, [globalSearch, orders, menuItems, inventory]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getSearchPlaceholder = () => {
    switch (activePage) {
      case 'orders':
        return 'Search orders, items, or amount... (Ctrl + K)';
      case 'menu':
        return 'Search menu beverages, bakery, food...';
      case 'inventory':
        return 'Search inventory raw materials, stock...';
      case 'reports':
        return 'Search reports, categories, metrics...';
      default:
        return 'Search anything across Patna store... (Ctrl + K)';
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setGlobalSearch(val);
    if (activePage === 'orders') {
      setOrdersSearch(val);
    }
  };

  return (
    <header className="h-16 glass-header sticky top-0 z-30 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        {/* Mobile menu button */}
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 rounded-btn text-customText-secondary hover:text-customText hover:bg-black/5 focus:outline-none"
          aria-label="Open navigation sidebar"
        >
          <MenuIcon size={20} />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-customText-secondary"
          />
          <input
            ref={searchInputRef}
            type="text"
            value={globalSearch}
            onChange={handleSearchChange}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            placeholder={getSearchPlaceholder()}
            className="w-full bg-surface-muted/80 text-customText placeholder:text-customText-muted text-xs sm:text-sm pl-10 pr-16 py-2 rounded-btn border border-black/5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all shadow-xs"
          />
          <kbd className="hidden sm:inline-flex absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-customText-secondary bg-white px-1.5 py-0.5 rounded border border-black/10 shadow-2xs">
            Ctrl K
          </kbd>

          {/* Search Dropdown */}
          {isSearchFocused && globalSearch.trim().length > 0 && searchResults && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-card shadow-xl border border-black/10 max-h-[70vh] overflow-y-auto z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-2 space-y-4">
                {searchResults.orders.length === 0 && searchResults.menu.length === 0 && searchResults.inventory.length === 0 && (
                  <div className="p-4 text-center text-sm text-customText-muted">
                    No results found for "{globalSearch}"
                  </div>
                )}

                {searchResults.orders.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-customText-secondary px-2 mb-1">Orders</h4>
                    {searchResults.orders.map(order => (
                      <div key={order.order_id} className="flex flex-col p-2 hover:bg-black/5 rounded cursor-pointer transition-colors">
                        <span className="text-sm font-semibold text-customText">{order.order_id}</span>
                        <span className="text-xs text-customText-secondary">{order.item_name} • ₹{order.total_amount}</span>
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.menu.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-customText-secondary px-2 mb-1">Menu Items</h4>
                    {searchResults.menu.map(item => (
                      <div key={item.name} className="flex flex-col p-2 hover:bg-black/5 rounded cursor-pointer transition-colors">
                        <span className="text-sm font-semibold text-customText">{item.name}</span>
                        <span className="text-xs text-customText-secondary">{item.category} • ₹{item.basePrice}</span>
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.inventory.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-customText-secondary px-2 mb-1">Inventory</h4>
                    {searchResults.inventory.map(item => (
                      <div key={item.id} className="flex flex-col p-2 hover:bg-black/5 rounded cursor-pointer transition-colors">
                        <span className="text-sm font-semibold text-customText">{item.item}</span>
                        <span className="text-xs text-customText-secondary">{item.category} • {item.current_stock} in stock</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Action Icons & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Location Pill */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-primary-tint/60 text-primary text-xs font-semibold rounded-pill border border-primary/10">
          <MapPin size={13} className="text-primary" />
          <span>Patna (P&M Mall)</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-btn text-customText-secondary hover:text-customText hover:bg-black/5 relative transition-colors focus:outline-none"
            aria-label="View notifications"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary ring-2 ring-white animate-pulse" />
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-card shadow-xl border border-black/10 p-4 z-30 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-black/5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-customText">
                    Store Notifications
                  </h4>
                  <span className="text-[11px] text-primary font-semibold">2 New</span>
                </div>
                <div className="space-y-3 mt-3">
                  <div className="flex gap-3 text-xs">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={14} />
                    </div>
                    <div>
                      <p className="font-semibold text-customText">Today's Daily Target Reached</p>
                      <p className="text-customText-secondary text-[11px]">₹15k+ gross sales on 16 Sep</p>
                      <span className="text-[10px] text-customText-muted">10 mins ago</span>
                    </div>
                  </div>
                  <div className="flex gap-3 text-xs">
                    <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                      <Bell size={14} />
                    </div>
                    <div>
                      <p className="font-semibold text-customText">Low Stock Alert</p>
                      <p className="text-customText-secondary text-[11px]">Paper Cups (Grande) below threshold</p>
                      <span className="text-[10px] text-customText-muted">1 hour ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="h-6 w-px bg-black/10 mx-1 hidden sm:block" />

        {/* User Avatar & Admin Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1 rounded-btn hover:bg-black/5 transition-colors focus:outline-none"
            aria-label="User profile options"
          >
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs shadow-sm">
              DP
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold text-customText leading-tight">Devraj Poddar</p>
              <p className="text-[11px] text-customText-secondary leading-tight">Store Admin</p>
            </div>
            <ChevronDown size={14} className="text-customText-secondary hidden sm:block" />
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-card shadow-xl border border-black/10 p-2 z-30 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-black/5">
                  <p className="text-xs font-bold text-customText">Devraj Poddar</p>
                  <p className="text-[11px] text-customText-secondary">patna.store@starbucks.in</p>
                  <div className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 bg-primary-tint text-primary text-[10px] font-semibold rounded">
                    <ShieldCheck size={10} /> Store Admin
                  </div>
                </div>
                <button
                  onClick={() => setShowUserMenu(false)}
                  className="w-full text-left px-3 py-2 text-xs text-customText hover:bg-black/5 rounded-md mt-1 flex items-center gap-2"
                >
                  <User size={13} /> View Profile
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
