import React, { useState } from 'react';
import { Stock, StockUpdateResult } from '../types';
import { fetchStockUpdates } from '../services/geminiService';
import { generateId } from '../constants';
import { RefreshCw, Plus, Trash2, TrendingUp, Search } from 'lucide-react';

interface StocksViewProps {
  stocks: Stock[];
  onUpdateStocks: (stocks: Stock[]) => void;
}

const StocksView: React.FC<StocksViewProps> = ({ stocks, onUpdateStocks }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStock, setNewStock] = useState<Partial<Stock>>({
    market: 'TW'
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const handleRefreshPrices = async () => {
    setIsUpdating(true);
    try {
      const updates = await fetchStockUpdates(stocks);
      
      const updatedStocks = stocks.map(stock => {
        const update = updates.find(u => u.symbol.toLowerCase() === stock.symbol.toLowerCase());
        if (update) {
          return {
            ...stock,
            currentPrice: update.price,
            lastUpdated: new Date().toISOString()
          };
        }
        return stock;
      });
      
      onUpdateStocks(updatedStocks);
    } catch (err) {
      alert("Failed to update prices via AI. Check your API Key.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddStock = () => {
    if (!newStock.symbol || !newStock.quantity || !newStock.avgCost) return;
    
    const stockToAdd: Stock = {
      id: generateId(),
      symbol: newStock.symbol.toUpperCase(),
      name: newStock.name || newStock.symbol.toUpperCase(),
      market: newStock.market as 'TW' | 'US',
      quantity: Number(newStock.quantity),
      avgCost: Number(newStock.avgCost),
      currentPrice: Number(newStock.avgCost), // Initial assumption
      lastUpdated: new Date().toISOString()
    };

    onUpdateStocks([...stocks, stockToAdd]);
    setShowAddForm(false);
    setNewStock({ market: 'TW' });
  };

  const handleDelete = (id: string) => {
    onUpdateStocks(stocks.filter(s => s.id !== id));
  };

  // Calculate Portfolio Value
  const totalValue = stocks.reduce((sum, s) => sum + (s.currentPrice * s.quantity), 0);
  const totalCost = stocks.reduce((sum, s) => sum + (s.avgCost * s.quantity), 0);
  const totalPnL = totalValue - totalCost;
  const pnlPercent = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Investment Portfolio</h2>
            <p className="text-slate-500">Track your Taiwan & International stocks.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={handleRefreshPrices}
                disabled={isUpdating}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition disabled:opacity-50"
            >
                <RefreshCw size={18} className={isUpdating ? 'animate-spin' : ''} />
                {isUpdating ? 'AI Updating...' : 'Update Prices'}
            </button>
            <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
                <Plus size={18} />
                Add Stock
            </button>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <p className="text-sm text-slate-500">Total Market Value</p>
            <p className="text-2xl font-bold text-slate-800">${totalValue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <p className="text-sm text-slate-500">Total Cost</p>
            <p className="text-2xl font-bold text-slate-800">${totalCost.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <p className="text-sm text-slate-500">Unrealized P&L</p>
            <div className={`text-2xl font-bold flex items-center gap-2 ${totalPnL >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {totalPnL >= 0 ? '+' : ''}{totalPnL.toLocaleString()}
                <span className="text-sm font-medium bg-slate-100 px-2 py-1 rounded-full">
                    {pnlPercent.toFixed(2)}%
                </span>
            </div>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 animate-fade-in">
            <h3 className="font-semibold mb-4">Add New Holding</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <input 
                    type="text" 
                    placeholder="Symbol (e.g. 2330.TW)" 
                    className="p-2 border rounded-lg"
                    value={newStock.symbol || ''}
                    onChange={e => setNewStock({...newStock, symbol: e.target.value})}
                />
                <input 
                    type="text" 
                    placeholder="Name" 
                    className="p-2 border rounded-lg"
                    value={newStock.name || ''}
                    onChange={e => setNewStock({...newStock, name: e.target.value})}
                />
                <input 
                    type="number" 
                    placeholder="Quantity" 
                    className="p-2 border rounded-lg"
                    value={newStock.quantity || ''}
                    onChange={e => setNewStock({...newStock, quantity: Number(e.target.value)})}
                />
                <input 
                    type="number" 
                    placeholder="Avg Cost" 
                    className="p-2 border rounded-lg"
                    value={newStock.avgCost || ''}
                    onChange={e => setNewStock({...newStock, avgCost: Number(e.target.value)})}
                />
                <select 
                    className="p-2 border rounded-lg"
                    value={newStock.market}
                    onChange={e => setNewStock({...newStock, market: e.target.value as any})}
                >
                    <option value="TW">Taiwan (TW)</option>
                    <option value="US">USA (US)</option>
                </select>
            </div>
            <div className="mt-4 flex justify-end gap-2">
                <button onClick={() => setShowAddForm(false)} className="px-4 py-2 text-slate-500">Cancel</button>
                <button onClick={handleAddStock} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save</button>
            </div>
        </div>
      )}

      {/* Stock List Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                <tr>
                    <th className="px-6 py-3 font-medium">Symbol</th>
                    <th className="px-6 py-3 font-medium">Market</th>
                    <th className="px-6 py-3 font-medium text-right">Shares</th>
                    <th className="px-6 py-3 font-medium text-right">Avg Cost</th>
                    <th className="px-6 py-3 font-medium text-right">Current Price</th>
                    <th className="px-6 py-3 font-medium text-right">Market Value</th>
                    <th className="px-6 py-3 font-medium text-right">P&L</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {stocks.map(stock => {
                    const mktValue = stock.quantity * stock.currentPrice;
                    const gain = mktValue - (stock.quantity * stock.avgCost);
                    const gainPercent = (gain / (stock.quantity * stock.avgCost)) * 100;

                    return (
                        <tr key={stock.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4">
                                <div className="font-semibold text-slate-800">{stock.symbol}</div>
                                <div className="text-xs text-slate-400">{stock.name}</div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                                    {stock.market}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">{stock.quantity.toLocaleString()}</td>
                            <td className="px-6 py-4 text-right text-slate-500">${stock.avgCost.toLocaleString()}</td>
                            <td className="px-6 py-4 text-right font-medium">${stock.currentPrice.toLocaleString()}</td>
                            <td className="px-6 py-4 text-right font-bold text-slate-800">${mktValue.toLocaleString()}</td>
                            <td className="px-6 py-4 text-right">
                                <div className={`${gain >= 0 ? 'text-emerald-600' : 'text-rose-600'} font-medium`}>
                                    {gain >= 0 ? '+' : ''}{gain.toLocaleString()}
                                </div>
                                <div className={`text-xs ${gain >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {gainPercent.toFixed(2)}%
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button onClick={() => handleDelete(stock.id)} className="text-slate-400 hover:text-rose-500">
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    );
                })}
                {stocks.length === 0 && (
                    <tr>
                        <td colSpan={8} className="text-center py-8 text-slate-500">No stocks in portfolio. Add one to get started.</td>
                    </tr>
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default StocksView;