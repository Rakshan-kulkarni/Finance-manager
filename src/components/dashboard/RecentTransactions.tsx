import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinance } from "@/context/FinanceContext";
import { formatCurrency, formatDate, getTransactionTypeColor, getTransactionTypeSymbol } from "@/lib/utils";
import { TransactionType } from "@/types";
import { parseISO } from "date-fns";
import { BarChart4Icon } from "lucide-react";
import { Link } from "react-router-dom";
import { PlusIcon } from "lucide-react";

export function RecentTransactions() {
  const { state } = useFinance();
  
  // Sort transactions by date (newest first) and get the 5 most recent
  const recentTransactions = [...state.transactions]
    .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime())
    .slice(0, 5);
  
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest financial activity</CardDescription>
        </div>
        <Link to="/transactions" className="text-sm text-blue-500 hover:underline">
          View All
        </Link>
      </CardHeader>
      <CardContent>
        {recentTransactions.length > 0 ? (
          <div className="space-y-4">
            {recentTransactions.map(transaction => (
              <div key={transaction.id} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 ${
                    transaction.type === TransactionType.INCOME ? "text-green-500" : "text-red-500"
                  }`}>
                    <span className="text-lg font-bold">
                      {getTransactionTypeSymbol(transaction.type)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.category} • {formatDate(transaction.date, 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className={`text-right ${getTransactionTypeColor(transaction.type)}`}>
                  <p className="font-medium">
                    {transaction.type === TransactionType.EXPENSE ? "-" : "+"}{formatCurrency(transaction.amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <BarChart4Icon className="mb-2 h-10 w-10 text-muted-foreground" />
            <h3 className="mb-1 text-lg font-medium">No transactions yet</h3>
            <p className="text-sm text-muted-foreground">
              Start tracking your finances by adding transactions.
            </p>
            <Link
              to="/transactions"
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <PlusIcon className="h-4 w-4" />
              Add Transaction
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}