import React, { useState } from 'react';
import { Transaction, Account, TransactionType } from '../types';
import { generateId, CATEGORIES } from '../constants';
import { Plus, Filter } from 'lucide-react';

interface TransactionsViewProps {
  transactions: Transaction[];
  accounts: Account[];
  onUpdateTransactions: (transactions: Transaction[]) => void;
  onUpdateAccounts: (accounts: Account[]) => void;
}

const TransactionsView: React.FC<TransactionsViewProps> = ({ transactions, accounts, onUpdateTransactions, onUpdateAccounts }) => {
  const [showForm, setShowForm] = useState(false);
  const [newTrans, setNewTrans] = useState<Partial<Transaction>>({
      type: 'Expense',
      date: new Date().toISOString().split('T')[0],
      category: CATEGORIES[0]
  });

  const handleAdd = () => {
      if (!newTrans.amount || !newTrans.accountId || !newTrans.description) return;

      const trans: Transaction = {
          id: generateId(),
          accountId: newTrans.accountId,
          date: newTrans.date || '',
          amount: Number(newTrans.amount),
          type: newTrans.type as TransactionType,
          category: newTrans.category || 'Other',
          description: newTrans.description
      };

      // Update Account Balance
      const updatedAccounts = accounts.map(acc => {
          if (acc.id === trans.accountId) {
              const change = trans.type === 'Income' ? trans.amount : -trans.amount;
              return { ...acc, balance: acc.balance + change };
          }
          return acc;
      });

      onUpdateAccounts(updatedAccounts);
      onUpdateTransactions([trans, ...transactions]);
      setShowForm(false);
      setNewTrans({ type: 'Expense', date: new Date().toISOString().split('T')[0], category: CATEGORIES[0] });
  };

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Transactions</h2>
                <p className="text-slate-500">Record your income and expenses.</p>
            </div>
            <button 
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
                <Plus size={18} /> Record
            </button>
        </div>

        {/* Add Form */}
        {showForm && (
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 animate-fade-in">
                <h3 className="font-semibold mb-4">Record Transaction</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                     <select 
                        className="p-2 border rounded-lg"
                        value={newTrans.type}
                        onChange={e => setNewTrans({...newTrans, type: e.target.value as TransactionType})}
                    >
                        <option value="Expense">Expense</option>
                        <option value="Income">Income</option>
                    </select>
                    <input 
                        type="date" 
                        className="p-2 border rounded-lg"
                        value={newTrans.date}
                        onChange={e => setNewTrans({...newTrans, date: e.target.value})}
                    />
                    <select 
                        className="p-2 border rounded-lg"
                        value={newTrans.accountId}
                        onChange={e => setNewTrans({...newTrans, accountId: e.target.value})}
                    >
                        <option value="">Select Account</option>
                        {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                    <select 
                        className="p-2 border rounded-lg"
                        value={newTrans.category}
                        onChange={e => setNewTrans({...newTrans, category: e.target.value})}
                    >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input 
                        type="text" 
                        placeholder="Description"
                        className="p-2 border rounded-lg"
                        value={newTrans.description || ''}
                        onChange={e => setNewTrans({...newTrans, description: e.target.value})}
                    />
                    <input 
                        type="number" 
                        placeholder="Amount"
                        className="p-2 border rounded-lg"
                        value={newTrans.amount || ''}
                        onChange={e => setNewTrans({...newTrans, amount: Number(e.target.value)})}
                    />
                </div>
                <div className="mt-4 flex justify-end">
                    <button onClick={handleAdd} className="bg-blue-600 text-white px-6 py-2 rounded-lg">Save</button>
                </div>
            </div>
        )}

        {/* List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                        <tr>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Description</th>
                            <th className="px-6 py-3">Category</th>
                            <th className="px-6 py-3">Account</th>
                            <th className="px-6 py-3 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {transactions.map(t => {
                            const accName = accounts.find(a => a.id === t.accountId)?.name || 'Unknown';
                            return (
                                <tr key={t.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 text-slate-500 text-sm">{t.date}</td>
                                    <td className="px-6 py-4 font-medium text-slate-800">{t.description}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">{t.category}</span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-sm">{accName}</td>
                                    <td className={`px-6 py-4 text-right font-semibold ${t.type === 'Income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {t.type === 'Income' ? '+' : '-'}${t.amount.toLocaleString()}
                                    </td>
                                </tr>
                            );
                        })}
                         {transactions.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-slate-500">No transactions recorded yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default TransactionsView;
