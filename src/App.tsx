import React, { useState } from 'react';
import { DataProvider, useData } from './context/DataContext';
import { FilterProvider } from './context/FilterContext';
import { ToastProvider } from './components/ui/Toast';
import { Sidebar, PageId } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './pages/Dashboard';
import { Orders } from './pages/Orders';
import { Menu } from './pages/Menu';
import { Inventory } from './pages/Inventory';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { EmptyState } from './components/ui/EmptyState';
import { AlertCircle } from 'lucide-react';

const AppContent: React.FC = () => {
  const [activePage, setActivePage] = useState<PageId>('dashboard');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const { loading, error, resetData } = useData();

  if (loading) {
    return (
      <div className="min-h-screen bg-appBg flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-primary-tint text-primary flex items-center justify-center mb-4 animate-bounce">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
            <path d="M12 2L14.4 8.5H21.5L15.8 12.7L18 19.3L12 15.2L6 19.3L8.2 12.7L2.5 8.5H9.6L12 2Z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-customText">Loading Starbucks Patna Dashboard...</h2>
        <p className="text-xs text-customText-secondary mt-1">Parsing store dataset & computing KPI models</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-appBg flex items-center justify-center p-6">
        <EmptyState
          title="Data Loading Error"
          description={`Could not parse store dataset: ${error}`}
          icon={<AlertCircle size={28} className="text-rose-600" />}
          actionLabel="Retry Loading Data"
          onAction={resetData}
        />
      </div>
    );
  }

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'orders':
        return <Orders />;
      case 'menu':
        return <Menu />;
      case 'inventory':
        return <Inventory />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-appBg flex">
      {/* Fixed Left Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isMobileOpen={isMobileNavOpen}
        setIsMobileOpen={setIsMobileNavOpen}
      />

      {/* Main Content Area next to Sidebar */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-60 transition-all duration-300">
        <Header
          activePage={activePage}
          onOpenMobileNav={() => setIsMobileNavOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {renderActivePage()}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <DataProvider>
      <FilterProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </FilterProvider>
    </DataProvider>
  );
};

export default App;
