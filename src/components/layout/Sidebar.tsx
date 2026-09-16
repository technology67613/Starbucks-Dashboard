import React from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  Coffee,
  Boxes,
  BarChart3,
  Settings as SettingsIcon,
} from 'lucide-react';
import { StarbucksLogo } from '../ui/StarbucksLogo';
import { ITEM_IMAGE_MAP } from '../../lib/itemImages';
import { cn } from '../../lib/utils';

export type PageId = 'dashboard' | 'orders' | 'menu' | 'inventory' | 'reports' | 'settings';

interface SidebarProps {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  setActivePage,
  isMobileOpen = false,
  setIsMobileOpen,
}) => {
  const navItems = [
    { id: 'dashboard' as PageId, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders' as PageId, label: 'Orders', icon: ClipboardList },
    { id: 'menu' as PageId, label: 'Menu', icon: Coffee },
    { id: 'inventory' as PageId, label: 'Inventory', icon: Boxes },
    { id: 'reports' as PageId, label: 'Reports', icon: BarChart3 },
    { id: 'settings' as PageId, label: 'Settings', icon: SettingsIcon },
  ];

  const handleNavClick = (pageId: PageId) => {
    setActivePage(pageId);
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsMobileOpen?.(false)}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 bottom-0 z-40 w-60 glass-sidebar flex flex-col justify-between py-6 px-4 transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-sm',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div>
          {/* Logo Block */}
          <div className="flex items-center gap-3 px-2 py-2 mb-6">
            <StarbucksLogo size={56} className="shadow-sm rounded-full" />
            <div>
              <h1 className="font-extrabold text-base text-customText tracking-tight leading-none uppercase">
                STARBUCKS
              </h1>
              <p className="text-xs text-primary font-bold tracking-wider mt-1">
                Patna • P&M Mall
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5" aria-label="Main Navigation">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activePage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-btn text-sm font-medium transition-all duration-150 text-left group',
                    isActive
                      ? 'bg-primary-tint text-primary font-semibold shadow-xs'
                      : 'text-customText-secondary hover:text-customText hover:bg-black/[0.03]'
                  )}
                >
                  <Icon
                    size={19}
                    className={cn(
                      'shrink-0 transition-colors',
                      isActive ? 'text-primary' : 'text-customText-secondary group-hover:text-customText'
                    )}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Decorative Brand Card per DESIGN.md §2 */}
        <div className="mt-auto pt-4">
          <div className="relative overflow-hidden rounded-card bg-gradient-to-b from-[#F2F7F4] to-[#E9F3EC] p-4 border border-black/5 shadow-sm min-h-[140px]">
            <div className="relative z-10 text-primary mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Store Vision</span>
            </div>
            <p className="relative z-10 text-xs font-semibold text-customText leading-snug w-[55%]">
              Good Coffee Drives Good Days
            </p>
            <p className="relative z-10 text-[11px] text-customText-secondary mt-1 w-2/3">
              Patna
            </p>
            <div className="absolute -right-10 -bottom-6 w-36 h-36 opacity-75 pointer-events-none transform -rotate-6">
              <img src={ITEM_IMAGE_MAP['CaffA" Latte'] || "https://images.unsplash.com/photo-1551030173-122aabc4489c?auto=format&fit=crop&q=80"} alt="Coffee cup" className="w-full h-full object-cover mix-blend-multiply rounded-full" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
