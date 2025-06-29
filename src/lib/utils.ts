import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { RecurrenceType, Transaction, TransactionType } from '@/types';
import {
  format,
  parseISO,
  isAfter,
  isBefore,
  addDays,
  addWeeks,
  addMonths,
  addYears,
  startOfMonth,
  endOfMonth,
  subMonths,
  isThisMonth,
} from 'date-fns';

// ✅ Correct placement of the helper function
function isLastMonth(date: Date): boolean {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return (
    date.getMonth() === lastMonth.getMonth() &&
    date.getFullYear() === lastMonth.getFullYear()
  );
}

// ✅ Time range detector
function detectTimeRange(question: string): 'thisMonth' | 'lastMonth' | 'all' {
  const lower = question.toLowerCase();
  if (lower.includes('last month')) return 'lastMonth';
  if (lower.includes('this month')) return 'thisMonth';
  return 'all';
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency
export function formatCurrency(amount: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

// Format date
export function formatDate(dateString: string, formatStr = 'MMM d, yyyy'): string {
  try {
    return format(parseISO(dateString), formatStr);
  } catch {
    return dateString;
  }
}

// Generate a random color
export function getRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Generate a color palette for charts
export function generateColorPalette(count: number): string[] {
  const baseColors = [
    '#4CAF50', '#2196F3', '#FFC107', '#9C27B0',
    '#FF5722', '#009688', '#673AB7', '#E91E63',
    '#3F51B5', '#F44336',
  ];
  const colors = [...baseColors];
  while (colors.length < count) {
    colors.push(getRandomColor());
  }
  return colors.slice(0, count);
}

// Filter transactions by date range
export function filterTransactionsByDate(
  transactions: Transaction[],
  startDate: Date,
  endDate: Date
): Transaction[] {
  return transactions.filter((transaction) => {
    const transactionDate = parseISO(transaction.date);
    return !isBefore(transactionDate, startDate) && !isAfter(transactionDate, endDate);
  });
}

// Get transactions for a specific month and year
export function getTransactionsForMonth(
  transactions: Transaction[],
  month: number,
  year: number
): Transaction[] {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  return filterTransactionsByDate(transactions, startDate, endDate);
}

// Get recurring transaction instances within a date range
export function expandRecurringTransactions(transactions: Transaction[]): Transaction[] {
  const expandedTransactions: Transaction[] = [];

  transactions.forEach(transaction => {
    // Add the original transaction
    expandedTransactions.push(transaction);

    // If it's a recurring transaction, expand it
    if (transaction.recurrence && transaction.recurrence !== 'none') {
      const startDate = new Date(transaction.date);
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1); // Expand for 1 year

      let currentDate = new Date(startDate);
      let count = 0;
      const maxExpansions = 100; // Prevent infinite loops

      while (currentDate <= endDate && count < maxExpansions) {
        // Calculate next occurrence
        switch (transaction.recurrence) {
          case 'daily':
            currentDate.setDate(currentDate.getDate() + 1);
            break;
          case 'weekly':
            currentDate.setDate(currentDate.getDate() + 7);
            break;
          case 'monthly':
            currentDate.setMonth(currentDate.getMonth() + 1);
            break;
          case 'yearly':
            currentDate.setFullYear(currentDate.getFullYear() + 1);
            break;
        }

        // Only add if it's in the future
        if (currentDate > new Date()) {
          const newTransaction: Transaction = {
            ...transaction,
            id: `${transaction.id}_${count}`,
            date: currentDate.toISOString().split('T')[0],
          };
          expandedTransactions.push(newTransaction);
        }

        count++;
      }

      if (count >= maxExpansions) {
        // Remove sensitive logging
      }
    }
  });

  // Remove sensitive logging
  return expandedTransactions;
}

// Download object as JSON file
export function downloadJSON(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Download object as CSV file
export function downloadCSV(data: Record<string, any>[], filename: string) {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csv = [headers.join(','), ...data.map(row =>
    headers.map(h => `"${(row[h] ?? '').toString().replace(/"/g, '""')}"`).join(',')
)].join('\n');


  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Recurrence label and icons
export function getRecurrenceLabel(recurrence: RecurrenceType): string {
  return {
    [RecurrenceType.NONE]: 'One-time',
    [RecurrenceType.DAILY]: 'Daily',
    [RecurrenceType.WEEKLY]: 'Weekly',
    [RecurrenceType.MONTHLY]: 'Monthly',
    [RecurrenceType.YEARLY]: 'Yearly',
  }[recurrence];
}

export function getTransactionTypeColor(type: TransactionType): string {
  return type === TransactionType.INCOME ? 'text-green-500' : 'text-red-500';
}

export function getTransactionTypeSymbol(type: TransactionType): string {
  return type === TransactionType.INCOME ? '+' : '-';
}

// AI Response Logic
export function generateAIResponse(question: string, state: any): string {
  const { transactions, budgets, reminders } = state;
  question = question.toLowerCase();

  // FOOD & FUZZY CATEGORY MATCH
  const foodKeywords = ['food', 'groceries', 'grocery', 'restaurant', 'dining', 'meal'];
  if (question.includes('spend') && foodKeywords.some(word => question.includes(word))) {
    const range = detectTimeRange(question);
    let filteredTx = transactions.filter(
      (t) =>
        t.type === TransactionType.EXPENSE &&
        foodKeywords.some((k) => t.category.toLowerCase().includes(k))
    );

    if (range === 'thisMonth') {
      filteredTx = filteredTx.filter((t) => isThisMonth(parseISO(t.date)));
    } else if (range === 'lastMonth') {
      filteredTx = filteredTx.filter((t) => isLastMonth(parseISO(t.date)));
    }

    if (!filteredTx.length) {
      return `You haven't recorded any food expenses ${range === 'all' ? 'yet' : `for ${range}`}.`;
    }

    const total = filteredTx.reduce((sum, t) => sum + t.amount, 0);
    return `You spent ${formatCurrency(total)} on food ${range === 'all' ? 'in total' : `in ${range}`}.`;
  }

  // SAVINGS RATE
  if (question.includes('savings rate') || (question.includes('save') && question.includes('saving'))) {
    const range = detectTimeRange(question);
    let filteredTx = transactions;

    if (range === 'thisMonth') {
      filteredTx = filteredTx.filter((t) => isThisMonth(parseISO(t.date)));
    } else if (range === 'lastMonth') {
      filteredTx = filteredTx.filter((t) => isLastMonth(parseISO(t.date)));
    }

    const income = filteredTx
      .filter((t) => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = filteredTx
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    if (income === 0) {
      return `I don't see any income recorded ${range === 'all' ? '' : `for ${range}`} to calculate your savings rate.`;
    }

    const rate = ((income - expenses) / income) * 100;
    return `Your savings rate ${range === 'all' ? 'in total' : `for ${range}`} is ${rate.toFixed(1)}%.`;
  }

  // BUDGET STATUS
  if (question.includes('budget') || question.includes('over budget')) {
    const currentMonth = new Date();
    const currentTx = getTransactionsForMonth(
      transactions,
      currentMonth.getMonth(),
      currentMonth.getFullYear()
    );

    if (!budgets?.length) {
      return "You haven't set any budgets yet. Go to the Budgets section to create one.";
    }

    if (!currentTx.length) {
      return "No transactions recorded for this month yet, so I can't determine if you're over budget.";
    }

    const totalSpent = currentTx
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
    const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);

    if (totalSpent > totalBudget) {
      return `Yes, you're over budget this month by ${formatCurrency(totalSpent - totalBudget)}.`;
    } else {
      return `You're within budget. You still have ${formatCurrency(totalBudget - totalSpent)} remaining this month.`;
    }
  }

  // NEXT BILL DUE
  if (question.includes('bill') || question.includes('due')) {
    const upcoming = reminders
      ?.filter((r) => !r.isPaid && isAfter(parseISO(r.dueDate), new Date()))
      .sort((a, b) => parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime());

    if (!upcoming?.length) {
      return "You don't have any upcoming unpaid bills right now.";
    }

    const next = upcoming[0];
    const dueDate = format(parseISO(next.dueDate), 'MMMM d');
    return `Your next bill is ${next.title}${next.amount ? ` (${formatCurrency(next.amount)})` : ''}, due on ${dueDate}.`;
  }

  // FINANCE IMPROVEMENT
  if (question.includes('improve') || question.includes('better')) {
    const recentTx = transactions.filter((t) => isLastMonth(parseISO(t.date)));

    if (!recentTx.length) {
      return "I need at least one month of transaction history to give tailored suggestions.";
    }

    const expensesByCategory = recentTx
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    const sorted = Object.entries(expensesByCategory).sort(([, a], [, b]) => b - a);
    const [category, amount] = sorted[0] || [];

    if (!category) {
      return "Try categorizing your expenses so I can give you more actionable insights.";
    }

    return `Your top expense category last month was ${category} at ${formatCurrency(amount)}. Consider setting a budget limit for this category to control your spending.`;
  }

  return "I'm not sure how to answer that question. Try asking about your food spending, savings rate, budget, bills, or ways to improve.";
}

// Request notification permission
export function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return Promise.resolve(false);
  if (Notification.permission === 'granted') return Promise.resolve(true);
  if (Notification.permission !== 'denied') {
    return Notification.requestPermission().then(p => p === 'granted');
  }
  return Promise.resolve(false);
}

// Show notification
export function showNotification(title: string, body: string) {
  if (Notification.permission === 'granted') {
    new Notification(title, { body });
  }
}
