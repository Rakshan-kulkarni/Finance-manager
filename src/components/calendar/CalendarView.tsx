import { useFinance } from "@/context/FinanceContext";
import { Calendar } from "@/components/ui/calendar";
import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { parseISO, format, startOfMonth, endOfMonth } from "date-fns";
import { Transaction, TransactionType, Reminder } from "@/types";
import { formatCurrency, getTransactionTypeColor, expandRecurringTransactions } from "@/lib/utils";

export function CalendarView() {
  const { state } = useFinance();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [displayMonth, setDisplayMonth] = useState(new Date());

  const expandedTransactions = useMemo(() => {
    return expandRecurringTransactions(state.transactions);
  }, [state.transactions]);

  const dataMap = useMemo(() => {
    const map = new Map<string, Transaction[]>();
    
    expandedTransactions.forEach(transaction => {
      const dateKey = transaction.date;
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(transaction);
    });
    
    return map;
  }, [expandedTransactions]);
  
  const getItemsForDate = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return dataMap.get(dateKey) || [];
  };
  
  const selectedDateItems = selectedDate ? getItemsForDate(selectedDate) : [];
  
  return (
    <div className="grid gap-6 md:grid-cols-[1fr_300px]">
      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
          <CardDescription>
            View your financial activities by date
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            month={displayMonth}
            onMonthChange={setDisplayMonth}
            className="mx-auto rounded-md border"
            classNames={{
              day_today: "bg-muted text-muted-foreground font-normal",
              day_selected: "bg-primary text-primary-foreground font-medium"
            }}
            modifiers={{
              income: (date) => {
                const transactions = getItemsForDate(date);
                if (!transactions.length) return false;
                const hasIncome = transactions.some(t => t.type === TransactionType.INCOME);
                const hasExpense = transactions.some(t => t.type === TransactionType.EXPENSE);
                return hasIncome && !hasExpense;
              },
              expense: (date) => {
                const transactions = getItemsForDate(date);
                if (!transactions.length) return false;
                const hasIncome = transactions.some(t => t.type === TransactionType.INCOME);
                const hasExpense = transactions.some(t => t.type === TransactionType.EXPENSE);
                return hasExpense && !hasIncome;
              },
              both: (date) => {
                const transactions = getItemsForDate(date);
                if (!transactions.length) return false;
                const hasIncome = transactions.some(t => t.type === TransactionType.INCOME);
                const hasExpense = transactions.some(t => t.type === TransactionType.EXPENSE);
                return hasIncome && hasExpense;
              },
              reminder: (date) => {
                const transactions = getItemsForDate(date);
                return transactions.length === 0;
              }
            }}
            modifiersClassNames={{
              income: "bg-green-50 dark:bg-green-900/20",
              expense: "bg-red-50 dark:bg-red-900/20",
              both: "bg-amber-50 dark:bg-amber-900/20",
              reminder: "bg-blue-50 dark:bg-blue-900/20"
            }}
          />
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="text-sm">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <span className="text-sm">Expense</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-amber-500" />
              <span className="text-sm">Both</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <span className="text-sm">Reminder</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
          </CardTitle>
          <CardDescription>
            {selectedDateItems.length > 0 ? "Activities for this date" : "No activities for this date"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedDateItems.length > 0 && (
            <div>
              <h3 className="mb-2 font-medium">Transactions</h3>
              <ul className="space-y-2">
                {selectedDateItems.map((transaction: Transaction) => (
                  <li key={transaction.id} className="flex items-center justify-between rounded-md bg-muted p-2">
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">{transaction.category}</p>
                    </div>
                    <span className={`font-medium ${getTransactionTypeColor(transaction.type)}`}>
                      {transaction.type === TransactionType.EXPENSE ? "-" : "+"}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {selectedDateItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-muted-foreground">No financial activities for this date.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}