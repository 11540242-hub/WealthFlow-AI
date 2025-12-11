import React from 'react';
import { LayoutDashboard, Wallet, TrendingUp, Receipt, PieChart, Settings, Menu, X } from 'lucide-react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, isOpen, setIsOpen }) => {
  const menuItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: AppView.ACCOUNTS, label: 'Accounts', icon: Wallet },
    { id: AppView.STOCKS, label: 'Stocks & Portfolio', icon: TrendingUp },
    { id: AppView.TRANSACTIONS, label: 'Transactions', icon: Receipt },
    { id: AppView.REPORTS, label: 'Reports', icon: PieChart },
    { id: AppView.SETTINGS, label: 'Settings & Deploy', icon: Settings },
  ];

  const handleNav = (view: AppView) => {
    onChangeView(view);
    setIsOpen(false); // Close mobile menu on select
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed top-0 left-0 h-full bg-slate-900 text-white z-30 transition-transform duration-300 ease-in-out w-64
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static
      `}>
        <div className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="font-bold text-lg">W</span>
                </div>
                <h1 className="text-xl font-bold tracking-tight">WealthFlow</h1>
            </div>
            <button onClick={() => setIsOpen(false)} className="md:hidden text-slate-400 hover:text-white">
                <X size={24} />
            </button>
        </div>

        <nav className="px-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-0 w-full px-6">
            <div className="bg-slate-800 rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-1">Powered by</p>
                <p className="text-sm font-semibold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Gemini 2.5 AI
                </p>
            </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
