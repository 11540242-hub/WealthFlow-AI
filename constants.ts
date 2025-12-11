import { Account, Stock, Transaction } from './types';
import { v4 as uuidv4 } from 'uuid'; // Since we don't have uuid lib, we use a simple generator

// Simple UUID generator for the environment
export const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Housing',
  'Utilities',
  'Health',
  'Entertainment',
  'Shopping',
  'Salary',
  'Investment',
  'Transfer',
  'Other'
];

export const MOCK_ACCOUNTS: Account[] = [
  { id: '1', name: 'CTBC Primary', type: 'Bank', balance: 150000, currency: 'TWD' },
  { id: '2', name: 'E.Sun Savings', type: 'Bank', balance: 500000, currency: 'TWD' },
  { id: '3', name: 'Wallet Cash', type: 'Cash', balance: 3500, currency: 'TWD' },
];

export const MOCK_STOCKS: Stock[] = [
  { id: 's1', symbol: '2330.TW', name: 'TSMC', market: 'TW', quantity: 1000, avgCost: 550, currentPrice: 980, lastUpdated: new Date().toISOString() },
  { id: 's2', symbol: 'AAPL', name: 'Apple Inc.', market: 'US', quantity: 10, avgCost: 150, currentPrice: 180, lastUpdated: new Date().toISOString() },
  { id: 's3', symbol: '0050.TW', name: 'Yuanta Taiwan 50', market: 'TW', quantity: 2000, avgCost: 120, currentPrice: 175, lastUpdated: new Date().toISOString() },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', accountId: '1', date: '2023-10-01', amount: 50000, type: 'Income', category: 'Salary', description: 'October Salary' },
  { id: 't2', accountId: '3', date: '2023-10-02', amount: 200, type: 'Expense', category: 'Food & Dining', description: 'Lunch at 7-11' },
  { id: 't3', accountId: '1', date: '2023-10-03', amount: 1200, type: 'Expense', category: 'Utilities', description: 'Electricity Bill' },
  { id: 't4', accountId: '1', date: '2023-10-05', amount: 20000, type: 'Expense', category: 'Housing', description: 'Rent' },
  { id: 't5', accountId: '3', date: '2023-10-06', amount: 500, type: 'Expense', category: 'Transportation', description: 'EasyCard Topup' },
];
