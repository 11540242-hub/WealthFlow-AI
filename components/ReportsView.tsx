import React from 'react';
import { Transaction } from '../types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

interface ReportsViewProps {
  transactions: Transaction[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];

const ReportsView: React.FC<ReportsViewProps> = ({ transactions }) => {
  // Prepare Data for Pie Chart (Expenses by Category)
  const expenseData = transactions
    .filter(t => t.type === 'Expense')
    .reduce((acc, curr) => {
      const existing = acc.find(item => item.name === curr.category);
      if (existing) {
        existing.value += curr.amount;
      } else {
        acc.push({ name: curr.category, value: curr.amount });
      }
      return acc;
    }, [] as { name: string; value: number }[])
    .sort((a, b) => b.value - a.value);

  // Prepare Data for Bar Chart (Income vs Expense per month) - simplified for demo
  const monthlyData: any[] = [];
  transactions.forEach(t => {
      const month = t.date.substring(0, 7); // YYYY-MM
      let monthEntry = monthlyData.find(m => m.name === month);
      if (!monthEntry) {
          monthEntry = { name: month, Income: 0, Expense: 0 };
          monthlyData.push(monthEntry);
      }
      if (t.type === 'Income') monthEntry.Income += t.amount;
      if (t.type === 'Expense') monthEntry.Expense += t.amount;
  });
  monthlyData.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Financial Reports</h2>
        <p className="text-slate-500">Visualize your income and spending habits.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-96">
            <h3 className="font-semibold text-slate-800 mb-4">Expenses by Category</h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={expenseData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {expenseData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>

        {/* Income vs Expense */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-96">
            <h3 className="font-semibold text-slate-800 mb-4">Income vs. Expenses</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{fontSize: 12}} />
                    <YAxis tick={{fontSize: 12}} />
                    <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                    <Legend />
                    <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
