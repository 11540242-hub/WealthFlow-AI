import React, { useEffect, useState } from 'react';
import { FinancialSummary, Account, Transaction } from '../types';
import { generateFinancialAdvice } from '../services/geminiService';
import { ArrowUpRight, ArrowDownRight, DollarSign, Sparkles } from 'lucide-react';

interface DashboardProps {
  accounts: Account[];
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ accounts, transactions }) => {
  const [advice, setAdvice] = useState<string>("Analyzing your finances...");

  // Calculate Summary
  const totalAssets = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  // Simplified calculation
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const monthlyIncome = transactions
    .filter(t => t.type === 'Income' && t.date.startsWith(currentMonth))
    .reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpense = transactions
    .filter(t => t.type === 'Expense' && t.date.startsWith(currentMonth))
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Find top expense category
  const expensesByCategory: {[key: string]: number} = {};
  transactions
    .filter(t => t.type === 'Expense')
    .forEach(t => {
      expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
    });
  const topCategory = Object.entries(expensesByCategory).sort((a,b) => b[1] - a[1])[0]?.[0] || "None";

  useEffect(() => {
    // Debounce or single call logic in real app
    const fetchAdvice = async () => {
        const result = await generateFinancialAdvice(totalAssets, totalAssets, topCategory);
        setAdvice(result);
    };
    fetchAdvice();
  }, [totalAssets, topCategory]);

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Financial Overview</h2>
        <p className="text-slate-500">Welcome back. Here is your financial health status.</p>
      </header>

      {/* AI Insight Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex items-start gap-4">
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                <Sparkles className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
                <h3 className="font-semibold text-lg mb-1">AI Financial Insight</h3>
                <p className="text-blue-100 leading-relaxed">{advice}</p>
            </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
                <span className="text-slate-500 text-sm font-medium">Total Assets</span>
                <div className="p-2 bg-emerald-100 rounded-full text-emerald-600">
                    <DollarSign size={18} />
                </div>
            </div>
            <div className="text-3xl font-bold text-slate-800">
                ${totalAssets.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 mt-2">Across all accounts</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
                <span className="text-slate-500 text-sm font-medium">Monthly Income</span>
                <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                    <ArrowUpRight size={18} />
                </div>
            </div>
            <div className="text-3xl font-bold text-slate-800">
                ${monthlyIncome.toLocaleString()}
            </div>
            <div className="text-xs text-green-500 mt-2 font-medium flex items-center">
                Income this month
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
                <span className="text-slate-500 text-sm font-medium">Monthly Expenses</span>
                <div className="p-2 bg-rose-100 rounded-full text-rose-600">
                    <ArrowDownRight size={18} />
                </div>
            </div>
            <div className="text-3xl font-bold text-slate-800">
                ${monthlyExpense.toLocaleString()}
            </div>
            <div className="text-xs text-rose-500 mt-2 font-medium flex items-center">
                Top: {topCategory}
            </div>
        </div>
      </div>

      {/* Recent Transactions Preview */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800">Recent Transactions</h3>
        </div>
        <div className="divide-y divide-slate-100">
            {transactions.slice(0, 5).map(t => (
                <div key={t.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                            ${t.type === 'Income' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'}
                        `}>
                            {t.category.charAt(0)}
                        </div>
                        <div>
                            <p className="font-medium text-slate-800">{t.description}</p>
                            <p className="text-xs text-slate-500">{t.date} • {t.category}</p>
                        </div>
                    </div>
                    <span className={`font-semibold ${t.type === 'Expense' ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {t.type === 'Expense' ? '-' : '+'}${t.amount.toLocaleString()}
                    </span>
                </div>
            ))}
            {transactions.length === 0 && (
                <div className="p-8 text-center text-slate-500">No recent transactions found.</div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
