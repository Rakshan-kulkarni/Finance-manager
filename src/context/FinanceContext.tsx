import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { 
  Transaction, 
  Budget, 
  Reminder, 
  UserSettings, 
  ChatMessage,
  TransactionType
} from '@/types';

// Default categories
const DEFAULT_CATEGORIES = [
  "Housing", "Transportation", "Food", "Utilities", 
  "Insurance", "Healthcare", "Savings", "Debt", 
  "Entertainment", "Personal", "Education", "Gifts",
  "Income", "Investments", "Other"
];

// Initial user settings
const DEFAULT_SETTINGS: UserSettings = {
  currency: "USD",
  startDayOfMonth: 1,
  theme: "system",
  categories: DEFAULT_CATEGORIES,
  showNotifications: true,
  defaultView: "dashboard",
};

// Interface for our finance state
interface FinanceState {
  transactions: Transaction[];
  budgets: Budget[];
  reminders: Reminder[];
  settings: UserSettings;
  chatHistory: ChatMessage[];
}

// Initial state
const initialState: FinanceState = {
  transactions: [],
  budgets: [],
  reminders: [],
  settings: DEFAULT_SETTINGS,
  chatHistory: [],
};

// Action types
type FinanceAction =
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'ADD_BUDGET'; payload: Budget }
  | { type: 'UPDATE_BUDGET'; payload: Budget }
  | { type: 'DELETE_BUDGET'; payload: string }
  | { type: 'ADD_REMINDER'; payload: Reminder }
  | { type: 'UPDATE_REMINDER'; payload: Reminder }
  | { type: 'DELETE_REMINDER'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<UserSettings> }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'CLEAR_CHAT_HISTORY' }
  | { type: 'IMPORT_DATA'; payload: Partial<FinanceState> }
  | { type: 'RESET_APP' };

// Reducer function
const financeReducer = (state: FinanceState, action: FinanceAction): FinanceState => {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [...state.transactions, action.payload]
      };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(transaction =>
          transaction.id === action.payload.id ? action.payload : transaction
        )
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(transaction => transaction.id !== action.payload)
      };
    case 'ADD_BUDGET':
      return {
        ...state,
        budgets: [...state.budgets, action.payload]
      };
    case 'UPDATE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.map(budget =>
          budget.id === action.payload.id ? action.payload : budget
        )
      };
    case 'DELETE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.filter(budget => budget.id !== action.payload)
      };
    case 'ADD_REMINDER':
      return {
        ...state,
        reminders: [...state.reminders, action.payload]
      };
    case 'UPDATE_REMINDER':
      return {
        ...state,
        reminders: state.reminders.map(reminder =>
          reminder.id === action.payload.id ? action.payload : reminder
        )
      };
    case 'DELETE_REMINDER':
      return {
        ...state,
        reminders: state.reminders.filter(reminder => reminder.id !== action.payload)
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    case 'ADD_CHAT_MESSAGE':
      return {
        ...state,
        chatHistory: [...state.chatHistory, action.payload]
      };
    case 'CLEAR_CHAT_HISTORY':
      return {
        ...state,
        chatHistory: []
      };
    case 'IMPORT_DATA':
      return {
        ...state,
        ...action.payload
      };
    case 'RESET_APP':
      return initialState;
    default:
      return state;
  }
};

// Create the context
const FinanceContext = createContext<{
  state: FinanceState;
  dispatch: React.Dispatch<FinanceAction>;
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getSavingsRate: () => number;
  getCategoryTotals: () => Record<string, number>;
  getMonthlyData: () => { month: string; income: number; expenses: number }[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (budget: Budget) => void;
  deleteBudget: (id: string) => void;
  addReminder: (reminder: Omit<Reminder, 'id'>) => void;
  updateReminder: (reminder: Reminder) => void;
  deleteReminder: (id: string) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  exportData: () => string;
  importData: (jsonData: string) => void;
  resetApp: () => void;
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  fetchData: () => void;
  resetAllUserData: () => void;
}>({
  state: initialState,
  dispatch: () => null,
  getTotalIncome: () => 0,
  getTotalExpenses: () => 0,
  getSavingsRate: () => 0,
  getCategoryTotals: () => ({}),
  getMonthlyData: () => [],
  addTransaction: () => {},
  updateTransaction: () => {},
  deleteTransaction: () => {},
  addBudget: () => {},
  updateBudget: () => {},
  deleteBudget: () => {},
  addReminder: () => {},
  updateReminder: () => {},
  deleteReminder: () => {},
  updateSettings: () => {},
  exportData: () => '',
  importData: () => {},
  resetApp: () => {},
  addChatMessage: () => {},
  fetchData: () => {},
  resetAllUserData: () => {},
});

// Provider component
export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(financeReducer, initialState);

  // Helper to map _id to id for budgets
  const mapBudget = (budget: any): Budget => ({ ...budget, id: budget._id });

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Load user data from backend on mount
  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const [transactionsRes, budgetsRes, remindersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/transactions`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/api/budgets`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/api/reminders`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const [transactions, budgets, reminders] = await Promise.all([
        transactionsRes.json(),
        budgetsRes.json(),
        remindersRes.json(),
      ]);
      dispatch({ type: 'IMPORT_DATA', payload: { transactions, budgets: budgets.map(mapBudget), reminders } });
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('moneyMapData', JSON.stringify(state));
  }, [state]);

  // Helper functions
  const getTotalIncome = (): number => {
    return state.transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalExpenses = (): number => {
    return state.transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getSavingsRate = (): number => {
    const income = getTotalIncome();
    return income > 0 ? ((income - getTotalExpenses()) / income) * 100 : 0;
  };

  const getCategoryTotals = (): Record<string, number> => {
    const totals: Record<string, number> = {};
    
    state.transactions.forEach(transaction => {
      if (transaction.type === TransactionType.EXPENSE) {
        if (!totals[transaction.category]) {
          totals[transaction.category] = 0;
        }
        totals[transaction.category] += transaction.amount;
      }
    });
    
    return totals;
  };

  const getMonthlyData = () => {
    const monthlyData: Record<string, { month: string; income: number; expenses: number }> = {};
    
    state.transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {
          month: monthYear,
          income: 0,
          expenses: 0
        };
      }
      
      if (transaction.type === TransactionType.INCOME) {
        monthlyData[monthYear].income += transaction.amount;
      } else {
        monthlyData[monthYear].expenses += transaction.amount;
      }
    });
    
    return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
  };

  // CRUD operations
  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transaction),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add transaction');
      }

      const newTransaction = await response.json();
      dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
    } catch (error) {
      // Remove sensitive error logging
      throw error;
    }
  };

  const updateTransaction = async (transaction: Transaction) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/transactions/${transaction.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transaction),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update transaction');
      }

      const updatedTransaction = await response.json();
      dispatch({ type: 'UPDATE_TRANSACTION', payload: updatedTransaction });
    } catch (error) {
      // Remove sensitive error logging
      throw error;
    }
  };

  const deleteTransaction = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/transactions/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete transaction');
      }

      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    } catch (error) {
      // Remove sensitive error logging
      throw error;
    }
  };

  const addBudget = async (budget: Omit<Budget, 'id'>) => {
    const token = localStorage.getItem('token');
    if (!token) { return; }

    try {
      const response = await fetch(`${API_BASE_URL}/api/budgets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(budget),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add budget');
      }

      const newBudget = await response.json();
      dispatch({ type: 'ADD_BUDGET', payload: mapBudget(newBudget) });
    } catch (error) {
      // Remove sensitive error logging
      throw error;
    }
  };

  const updateBudget = async (budget: Budget) => {
    const token = localStorage.getItem('token');
    if (!token) { return; }

    try {
      const response = await fetch(`${API_BASE_URL}/api/budgets/${budget.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(budget),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update budget');
      }

      const updatedBudget = await response.json();
      dispatch({ type: 'UPDATE_BUDGET', payload: mapBudget(updatedBudget) });
    } catch (error) {
      // Remove sensitive error logging
      throw error;
    }
  };

  const deleteBudget = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) { return; }

    try {
      const response = await fetch(`${API_BASE_URL}/api/budgets/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete budget');
      }

      dispatch({ type: 'DELETE_BUDGET', payload: id });
    } catch (error) {
      // Remove sensitive error logging
      throw error;
    }
  };

  const addReminder = async (reminder: Omit<Reminder, 'id'>) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/reminders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reminder),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add reminder');
      }

      const newReminder = await response.json();
      dispatch({ type: 'ADD_REMINDER', payload: newReminder });
    } catch (error) {
      // Remove sensitive error logging
      throw error;
    }
  };

  const updateReminder = async (reminder: Reminder) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/reminders/${reminder.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reminder),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update reminder');
      }

      const updatedReminder = await response.json();
      dispatch({ type: 'UPDATE_REMINDER', payload: updatedReminder });
    } catch (error) {
      // Remove sensitive error logging
      throw error;
    }
  };

  const deleteReminder = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/reminders/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete reminder');
      }

      dispatch({ type: 'DELETE_REMINDER', payload: id });
    } catch (error) {
      // Remove sensitive error logging
      throw error;
    }
  };

  const updateSettings = (settings: Partial<UserSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  };

  const exportData = (): string => {
    return JSON.stringify(state, null, 2);
  };

  const importData = (jsonData: string) => {
    try {
      const parsedData = JSON.parse(jsonData);
      dispatch({ type: 'IMPORT_DATA', payload: parsedData });
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Invalid JSON data');
    }
  };

  // Only clear frontend state
  const resetApp = () => {
    dispatch({ type: 'RESET_APP' });
  };

  // For settings: clear backend and frontend data
  const resetAllUserData = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/api/reset`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Failed to reset backend data:', error);
      }
    }
    dispatch({ type: 'RESET_APP' });
  };

  const addChatMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: newMessage });
  };

  return (
    <FinanceContext.Provider
      value={{
        state,
        dispatch,
        getTotalIncome,
        getTotalExpenses,
        getSavingsRate,
        getCategoryTotals,
        getMonthlyData,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addBudget,
        updateBudget,
        deleteBudget,
        addReminder,
        updateReminder,
        deleteReminder,
        updateSettings,
        exportData,
        importData,
        resetApp,
        addChatMessage,
        fetchData,
        resetAllUserData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

// Custom hook for using the finance context
export const useFinance = () => useContext(FinanceContext);