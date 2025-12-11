import React, { useState } from 'react';
import { Account, AccountType } from '../types';
import { generateId } from '../constants';
import { Plus, Trash2, Wallet, CreditCard } from 'lucide-react';

interface AccountsViewProps {
  accounts: Account[];
  onUpdateAccounts: (accounts: Account[]) => void;
}

const AccountsView: React.FC<AccountsViewProps> = ({ accounts, onUpdateAccounts }) => {
  const [showForm, setShowForm] = useState(false);
  const [newAccount, setNewAccount] = useState<Partial<Account>>({
      type: 'Bank',
      currency: 'TWD'
  });

  const handleAdd = () => {
      if (!newAccount.name || !newAccount.balance) return;
      const acc: Account = {
          id: generateId(),
          name: newAccount.name,
          type: newAccount.type as AccountType,
          balance: Number(newAccount.balance),
          currency: 'TWD'
      };
      onUpdateAccounts([...accounts, acc]);
      setShowForm(false);
      setNewAccount({ type: 'Bank', currency: 'TWD' });
  };

  const handleDelete = (id: string) => {
      if(confirm("Are you sure? Transactions linked to this account might break.")) {
          onUpdateAccounts(accounts.filter(a => a.id !== id));
      }
  };

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Accounts</h2>
                <p className="text-slate-500">Manage your bank accounts and cash wallets.</p>
            </div>
            <button 
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
                <Plus size={18} /> Add Account
            </button>
        </div>

        {/* Add Form */}
        {showForm && (
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 animate-fade-in">
                <h3 className="font-semibold mb-4">Add New Account</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input 
                        type="text" 
                        placeholder="Account Name" 
                        className="p-2 border rounded-lg"
                        value={newAccount.name || ''}
                        onChange={e => setNewAccount({...newAccount, name: e.target.value})}
                    />
                    <select 
                        className="p-2 border rounded-lg"
                        value={newAccount.type}
                        onChange={e => setNewAccount({...newAccount, type: e.target.value as AccountType})}
                    >
                        <option value="Bank">Bank</option>
                        <option value="Cash">Cash</option>
                        <option value="Credit">Credit Card</option>
                        <option value="Investment">Investment</option>
                    </select>
                    <input 
                        type="number" 
                        placeholder="Initial Balance" 
                        className="p-2 border rounded-lg"
                        value={newAccount.balance || ''}
                        onChange={e => setNewAccount({...newAccount, balance: Number(e.target.value)})}
                    />
                     <button onClick={handleAdd} className="bg-blue-600 text-white rounded-lg py-2">Save</button>
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map(acc => (
                <div key={acc.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative group hover:border-blue-300 transition-colors">
                    <button 
                        onClick={() => handleDelete(acc.id)}
                        className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Trash2 size={18} />
                    </button>
                    
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`p-3 rounded-lg ${acc.type === 'Bank' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                           {acc.type === 'Bank' ? <CreditCard size={24} /> : <Wallet size={24} />}
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800">{acc.name}</h3>
                            <p className="text-xs text-slate-500 uppercase tracking-wider">{acc.type}</p>
                        </div>
                    </div>
                    
                    <div className="mt-4">
                        <p className="text-sm text-slate-400">Current Balance</p>
                        <p className="text-2xl font-bold text-slate-800">${acc.balance.toLocaleString()}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default AccountsView;
