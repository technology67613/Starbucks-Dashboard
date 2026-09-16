import React, { useState } from 'react';
import {
  Store,
  MapPin,
  Phone,
  Mail,
  Clock,
  Edit2,
  Shield,
  Bell,
  Globe,
  Lock,
  LogOut,
  CheckCircle2,
  Coffee,
} from 'lucide-react';
import { useToast } from '../components/ui/Toast';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { STOREFRONT_IMAGE } from '../lib/itemImages';

export const Settings: React.FC = () => {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'store' | 'profile' | 'preferences' | 'notifications'>('store');

  // Store information state
  const [storeInfo, setStoreInfo] = useState({
    name: 'Starbucks Patna (P&M Mall)',
    address: 'P&M Mall, Boring Road, Patna, Bihar 800001',
    phone: '+91 612 350 1234',
    email: 'patna.store@starbucks.in',
    hours: '8:00 AM – 11:00 PM (Daily)',
  });
  const [showEditStoreModal, setShowEditStoreModal] = useState(false);
  const [editStoreState, setEditStoreState] = useState(storeInfo);

  // Notifications toggle state
  const [notifications, setNotifications] = useState({
    newOrders: true,
    lowStock: true,
    dailySummary: false,
    staffAlerts: true,
  });

  // Store preferences
  const [receiptFooter, setReceiptFooter] = useState('Thank you for being a part of our coffee story. ☕');
  const [language, setLanguage] = useState('English');

  // Password modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');

  const handleSaveStoreInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setStoreInfo(editStoreState);
    setShowEditStoreModal(false);
    showToast('Store information updated successfully!');
  };

  const handleToggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      showToast(`${key} notifications ${updated[key] ? 'enabled' : 'disabled'}`);
      return updated;
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass || newPass.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    setShowPasswordModal(false);
    setCurrentPass('');
    setNewPass('');
    showToast('Admin password changed successfully!');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-customText tracking-tight">
          Store Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-customText-secondary mt-1">
          Manage Patna store profile, operational preferences, notifications, and security
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-black/10 pb-2 overflow-x-auto">
        {(
          [
            { id: 'store', label: 'Store Settings', icon: Store },
            { id: 'profile', label: 'Profile (Devraj Poddar)', icon: Shield },
            { id: 'preferences', label: 'Preferences & Receipts', icon: Globe },
            { id: 'notifications', label: 'Notifications', icon: Bell },
          ] as const
        ).map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-btn text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-customText-secondary hover:text-customText hover:bg-black/5'
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Settings Content Grid with Right Side Decorative Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Columns: Tab Content */}
        <div className="lg:col-span-8 space-y-6">
          {/* TAB 1: STORE SETTINGS */}
          {activeTab === 'store' && (
            <div className="space-y-6">
              <Card>
                <div className="flex items-center justify-between pb-4 border-b border-black/5">
                  <div>
                    <h2 className="text-base font-bold text-customText">Store Information</h2>
                    <p className="text-xs text-customText-secondary mt-0.5">
                      Public store identity, address, and operating hours
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setEditStoreState(storeInfo);
                      setShowEditStoreModal(true);
                    }}
                    className="gap-1.5"
                  >
                    <Edit2 size={13} />
                    <span>Edit Store Info</span>
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4">
                  {/* Storefront Image with Glassmorphic Badge */}
                  <div className="md:col-span-5 relative rounded-card overflow-hidden h-52 md:h-auto border border-black/5 shadow-sm group">
                    <img
                      src={STOREFRONT_IMAGE}
                      alt="Starbucks Patna Outlet"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-white bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-pill border border-white/20">
                        P&M Mall Patna
                      </span>
                      <span className="text-[10px] text-emerald-300 font-semibold bg-emerald-950/60 backdrop-blur-md px-2 py-0.5 rounded-pill">
                        ● Open Now
                      </span>
                    </div>
                  </div>

                  {/* Store Information Details */}
                  <div className="md:col-span-7 space-y-3.5 text-xs sm:text-sm">
                    <div className="flex items-start gap-3">
                      <Store size={18} className="text-primary mt-0.5 shrink-0" />
                      <div>
                        <span className="text-[11px] text-customText-secondary uppercase font-semibold block">
                          Store Name
                        </span>
                        <span className="font-bold text-customText">{storeInfo.name}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin size={18} className="text-primary mt-0.5 shrink-0" />
                      <div>
                        <span className="text-[11px] text-customText-secondary uppercase font-semibold block">
                          Address
                        </span>
                        <span className="font-medium text-customText">{storeInfo.address}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="flex items-start gap-2.5">
                        <Phone size={16} className="text-primary mt-0.5 shrink-0" />
                        <div>
                          <span className="text-[10px] text-customText-secondary uppercase font-semibold block">
                            Phone Number
                          </span>
                          <span className="font-medium text-customText text-xs">{storeInfo.phone}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <Mail size={16} className="text-primary mt-0.5 shrink-0" />
                        <div>
                          <span className="text-[10px] text-customText-secondary uppercase font-semibold block">
                            Store Email
                          </span>
                          <span className="font-medium text-customText text-xs">{storeInfo.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 pt-1">
                      <Clock size={18} className="text-primary mt-0.5 shrink-0" />
                      <div>
                        <span className="text-[11px] text-customText-secondary uppercase font-semibold block">
                          Operating Hours
                        </span>
                        <span className="font-medium text-customText">{storeInfo.hours}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Account Security Card */}
              <Card>
                <div className="pb-3 border-b border-black/5">
                  <h2 className="text-base font-bold text-customText">Account & Credentials</h2>
                  <p className="text-xs text-customText-secondary mt-0.5">
                    Security actions for store admin account
                  </p>
                </div>
                <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-customText">Devraj Poddar</p>
                    <p className="text-xs text-customText-secondary">Store Admin • Session Active</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setShowPasswordModal(true)}
                      className="gap-1.5"
                    >
                      <Lock size={13} />
                      <span>Change Password</span>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => showToast('Simulated logout. Store Admin session preserved.', 'info')}
                      className="gap-1.5"
                    >
                      <LogOut size={13} />
                      <span>Log Out</span>
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* TAB 2: PROFILE */}
          {activeTab === 'profile' && (
            <Card className="space-y-4">
              <div className="pb-3 border-b border-black/5">
                <h2 className="text-base font-bold text-customText">Admin Profile</h2>
                <p className="text-xs text-customText-secondary mt-0.5">
                  Personal manager profile details
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl shadow-md">
                  DP
                </div>
                <div>
                  <h3 className="text-lg font-bold text-customText">Devraj Poddar</h3>
                  <p className="text-xs text-primary font-semibold">Store General Manager</p>
                  <p className="text-xs text-customText-secondary mt-0.5">Starbucks Coffee Company • Patna Outlet</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
                <div className="p-3 bg-surface-muted rounded-btn">
                  <span className="text-customText-secondary block">Employee ID</span>
                  <span className="font-mono font-bold text-customText">SBX-IN-9082</span>
                </div>
                <div className="p-3 bg-surface-muted rounded-btn">
                  <span className="text-customText-secondary block">Assigned Store</span>
                  <span className="font-bold text-customText">P&M Mall, Boring Road</span>
                </div>
              </div>
            </Card>
          )}

          {/* TAB 3: PREFERENCES & RECEIPTS */}
          {activeTab === 'preferences' && (
            <Card className="space-y-5">
              <div className="pb-3 border-b border-black/5">
                <h2 className="text-base font-bold text-customText">Store Preferences</h2>
                <p className="text-xs text-customText-secondary mt-0.5">
                  Localization, currencies, and printed POS receipts
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="font-bold uppercase tracking-wider text-customText-secondary block text-xs mb-1">
                    Store Currency (Locked)
                  </label>
                  <div className="flex items-center gap-2 p-2.5 bg-surface-muted rounded-btn border border-black/10">
                    <span className="font-bold text-primary">₹</span>
                    <span className="font-medium text-customText">Indian Rupee (INR) — Non-negotiable scope</span>
                  </div>
                </div>

                <div>
                  <label className="font-bold uppercase tracking-wider text-customText-secondary block text-xs mb-1">
                    System Timezone
                  </label>
                  <div className="p-2.5 bg-surface-muted rounded-btn border border-black/10 font-medium text-customText">
                    Asia/Kolkata (IST — UTC+5:30)
                  </div>
                </div>

                <div>
                  <label className="font-bold uppercase tracking-wider text-customText-secondary block text-xs mb-1">
                    Receipt Footer Note
                  </label>
                  <input
                    type="text"
                    value={receiptFooter}
                    onChange={e => setReceiptFooter(e.target.value)}
                    className="w-full p-2.5 rounded-btn border border-black/10 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => showToast('Store preferences updated successfully!')}
                  >
                    Save Preferences
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* TAB 4: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <Card className="space-y-4">
              <div className="pb-3 border-b border-black/5">
                <h2 className="text-base font-bold text-customText">Notification Preferences</h2>
                <p className="text-xs text-customText-secondary mt-0.5">
                  Control in-app alerts and daily operational notifications
                </p>
              </div>

              <div className="divide-y divide-black/5 space-y-3">
                <div className="flex items-center justify-between pt-3">
                  <div>
                    <h4 className="font-bold text-customText text-sm">New POS & Online Order Alerts</h4>
                    <p className="text-xs text-customText-secondary">Receive real-time audio and visual popups for in-flight orders</p>
                  </div>
                  <button
                    onClick={() => handleToggleNotification('newOrders')}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      notifications.newOrders ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                        notifications.newOrders ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3">
                  <div>
                    <h4 className="font-bold text-customText text-sm">Low Stock Warnings</h4>
                    <p className="text-xs text-customText-secondary">Notify when espresso beans, milk, or cups hit minimum inventory threshold</p>
                  </div>
                  <button
                    onClick={() => handleToggleNotification('lowStock')}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      notifications.lowStock ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                        notifications.lowStock ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3">
                  <div>
                    <h4 className="font-bold text-customText text-sm">Daily Sales Summary</h4>
                    <p className="text-xs text-customText-secondary">Automated email report at 11:00 PM store closing</p>
                  </div>
                  <button
                    onClick={() => handleToggleNotification('dailySummary')}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      notifications.dailySummary ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                        notifications.dailySummary ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right 4 Columns: Patna Community Brand Card (DESIGN.md & reference mockups) */}
        <div className="lg:col-span-4">
          <div className="rounded-card bg-gradient-to-b from-primary-dark via-primary to-primary-dark text-white p-6 shadow-card relative overflow-hidden flex flex-col justify-between min-h-[380px]">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-200">
                <span className="text-xs font-bold uppercase tracking-widest">Patna Pride</span>
              </div>

              <h3 className="font-['Playfair_Display'] italic text-2xl font-bold leading-tight text-white">
                “Same Great Coffee, Now in Patna.”
              </h3>

              <p className="text-xs text-emerald-100/80 leading-relaxed">
                Dedicated to providing authentic handcrafted Starbucks beverages, fresh bakery treats, and creating warm third-place experiences at P&M Mall.
              </p>
            </div>

            <div className="pt-8 border-t border-white/10 mt-6">
              <p className="text-xs font-semibold text-emerald-200 uppercase tracking-widest">
                People • Coffee • Community
              </p>
              <p className="text-[11px] text-white/70 mt-0.5">
                Starbucks Patna Outlet Management System
              </p>
            </div>

            {/* Coffee Icon Watermark */}
            <div className="absolute -right-6 -bottom-6 opacity-10 text-white pointer-events-none">
              <Coffee size={160} />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Store Info Modal */}
      {showEditStoreModal && (
        <Modal
          isOpen={showEditStoreModal}
          onClose={() => setShowEditStoreModal(false)}
          title="Edit Store Information"
          subtitle="Starbucks Patna (P&M Mall)"
          maxWidth="md"
        >
          <form onSubmit={handleSaveStoreInfo} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="font-bold text-customText block mb-1">Store Name</label>
              <input
                type="text"
                value={editStoreState.name}
                onChange={e => setEditStoreState({ ...editStoreState, name: e.target.value })}
                className="w-full p-2.5 rounded-btn border border-black/10 bg-white"
                required
              />
            </div>
            <div>
              <label className="font-bold text-customText block mb-1">Store Address</label>
              <input
                type="text"
                value={editStoreState.address}
                onChange={e => setEditStoreState({ ...editStoreState, address: e.target.value })}
                className="w-full p-2.5 rounded-btn border border-black/10 bg-white"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-customText block mb-1">Phone</label>
                <input
                  type="text"
                  value={editStoreState.phone}
                  onChange={e => setEditStoreState({ ...editStoreState, phone: e.target.value })}
                  className="w-full p-2.5 rounded-btn border border-black/10 bg-white"
                  required
                />
              </div>
              <div>
                <label className="font-bold text-customText block mb-1">Email</label>
                <input
                  type="email"
                  value={editStoreState.email}
                  onChange={e => setEditStoreState({ ...editStoreState, email: e.target.value })}
                  className="w-full p-2.5 rounded-btn border border-black/10 bg-white"
                  required
                />
              </div>
            </div>
            <div>
              <label className="font-bold text-customText block mb-1">Operating Hours</label>
              <input
                type="text"
                value={editStoreState.hours}
                onChange={e => setEditStoreState({ ...editStoreState, hours: e.target.value })}
                className="w-full p-2.5 rounded-btn border border-black/10 bg-white"
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-black/5">
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowEditStoreModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Update Store Details
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <Modal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          title="Change Store Admin Password"
          subtitle="Manager Security"
          maxWidth="sm"
        >
          <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="font-bold text-customText block mb-1">Current Password</label>
              <input
                type="password"
                value={currentPass}
                onChange={e => setCurrentPass(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 rounded-btn border border-black/10 bg-white"
                required
              />
            </div>
            <div>
              <label className="font-bold text-customText block mb-1">New Password (Min 6 chars)</label>
              <input
                type="password"
                value={newPass}
                onChange={e => setNewPass(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 rounded-btn border border-black/10 bg-white"
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-black/5">
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowPasswordModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Update Password
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
