import { useState, useEffect } from 'react';
import { Account, Stock, Transaction } from '../types';
import { MOCK_ACCOUNTS, MOCK_STOCKS, MOCK_TRANSACTIONS } from '../constants';

// NOTE: In a real deployment, you would uncomment the Firebase logic here 
// and import initialized 'db' from firebase.ts

const STORAGE_KEY_ACCOUNTS = 'wealthflow_accounts';
const STORAGE_KEY_TRANSACTIONS = 'wealthflow_transactions';
const STORAGE_KEY_STOCKS = 'wealthflow_stocks';

export const useFinanceData = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize Data (Load from LocalStorage or Fallback to Mock)
  useEffect(() => {
    const loadData = () => {
      try {
        const storedAccounts = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
        const storedTransactions = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
        const storedStocks = localStorage.getItem(STORAGE_KEY_STOCKS);

        if (storedAccounts) setAccounts(JSON.parse(storedAccounts));
        else {
            setAccounts(MOCK_ACCOUNTS);
            localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(MOCK_ACCOUNTS));
        }

        if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
        else {
            setTransactions(MOCK_TRANSACTIONS);
            localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(MOCK_TRANSACTIONS));
        }

        if (storedStocks) setStocks(JSON.parse(storedStocks));
        else {
            setStocks(MOCK_STOCKS);
            localStorage.setItem(STORAGE_KEY_STOCKS, JSON.stringify(MOCK_STOCKS));
        }
      } catch (e) {
        console.error("Failed to load data", e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Persist Helpers
  const saveAccounts = (newAccounts: Account[]) => {
    setAccounts(newAccounts);
    localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(newAccounts));
  };

  const saveTransactions = (newTransactions: Transaction[]) => {
    setTransactions(newTransactions);
    localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(newTransactions));
  };

  const saveStocks = (newStocks: Stock[]) => {
    setStocks(newStocks);
    localStorage.setItem(STORAGE_KEY_STOCKS, JSON.stringify(newStocks));
  };

  return {
    accounts,
    transactions,
    stocks,
    loading,
    saveAccounts,
    saveTransactions,
    saveStocks
  };
};
