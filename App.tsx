import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AccountsView from './components/AccountsView';
import StocksView from './components/StocksView';
import TransactionsView from './components/TransactionsView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import { useFinanceData } from './services/dataService';
import { AppView } from './types';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const { 
    accounts, 
    transactions, 
    stocks, 
    loading,
    saveAccounts,
    saveTransactions,
    saveStocks
  } = useFinanceData();

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard accounts={accounts} transactions={transactions} />;
      case AppView.ACCOUNTS:
        return <AccountsView accounts={accounts} onUpdateAccounts={saveAccounts} />;
      case AppView.STOCKS:
        return <StocksView stocks={stocks} onUpdateStocks={saveStocks} />;
      case AppView.TRANSACTIONS:
        return <TransactionsView 
          transactions={transactions} 
          accounts={accounts} 
          onUpdateTransactions={saveTransactions} 
          onUpdateAccounts={saveAccounts}
        />;
      case AppView.REPORTS:
        return <ReportsView transactions={transactions} />;
      case AppView.SETTINGS:
        return <SettingsView />;
      default:
        return <Dashboard accounts={accounts} transactions={transactions} />;
    }
  };

  if (loading) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className="flex-1 min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden p-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-10">
            <h1 className="font-bold text-lg">WealthFlow</h1>
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600">
                <Menu size={24} />
            </button>
        </div>

        {/* Content Area */}
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
