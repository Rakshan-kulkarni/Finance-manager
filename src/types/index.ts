// Transaction Types
export enum TransactionType {
  INCOME = "income",
  EXPENSE = "expense",
}

export enum RecurrenceType {
  NONE = "none",
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  YEARLY = "yearly",
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: TransactionType;
  tags?: string[];
  recurrence: RecurrenceType;
  recurrenceEndDate?: string;
}

// Budget Types
export interface Budget {
  id: string;
  category: string;
  amount: number;
  period: "monthly" | "yearly";
}

// Reminder Types
export interface Reminder {
  id: string;
  title: string;
  amount?: number;
  dueDate: string;
  isPaid: boolean;
  category?: string;
  recurrence: RecurrenceType;
  notes?: string;
}

// Chart Data Types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}

// User Settings
export interface UserSettings {
  currency: string;
  startDayOfMonth: number;
  theme: "light" | "dark" | "system";
  categories: string[];
  showNotifications: boolean;
  defaultView: string;
}

// AI Chat Message
export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: string;
}