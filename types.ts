export type AccountType = 'Bank' | 'Cash' | 'Credit' | 'Investment';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
}

export type TransactionType = 'Income' | 'Expense' | 'Transfer';

export interface Transaction {
  id: string;
  accountId: string;
  date: string;
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
}

export interface Stock {
  id: string;
  symbol: string; // e.g., 2330.TW or AAPL
  name: string;
  market: 'TW' | 'US' | 'Other';
  quantity: number;
  avgCost: number;
  currentPrice: number; // Updated via AI or manual
  lastUpdated?: string;
}

export interface FinancialSummary {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  monthlyIncome: number;
  monthlyExpense: number;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  ACCOUNTS = 'ACCOUNTS',
  TRANSACTIONS = 'TRANSACTIONS',
  STOCKS = 'STOCKS',
  REPORTS = 'REPORTS',
  SETTINGS = 'SETTINGS'
}

// For Gemini
export interface StockUpdateResult {
  symbol: string;
  price: number;
  currency: string;
}
