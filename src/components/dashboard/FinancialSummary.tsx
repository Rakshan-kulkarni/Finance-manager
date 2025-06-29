import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useFinance } from "@/context/FinanceContext";
import { formatCurrency } from "@/lib/utils";

export function FinancialSummary() {
  const { getTotalIncome, getTotalExpenses, getSavingsRate } = useFinance();
  
  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const balance = totalIncome - totalExpenses;
  const savingsRate = getSavingsRate();
  
  const getBalanceColor = () => {
    if (balance > 0) return "text-green-500";
    if (balance < 0) return "text-red-500";
    return "text-yellow-500";
  };
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Income</CardDescription>
          <CardTitle className="text-2xl text-green-500">
            {formatCurrency(totalIncome)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            All incoming funds
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Expenses</CardDescription>
          <CardTitle className="text-2xl text-red-500">
            {formatCurrency(totalExpenses)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            All outgoing funds
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Current Balance</CardDescription>
          <CardTitle className={`text-2xl ${getBalanceColor()}`}>
            {formatCurrency(balance)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            Income minus expenses
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Savings Rate</CardDescription>
          <CardTitle className="text-2xl">
            {savingsRate.toFixed(1)}%
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={savingsRate} className="h-2" />
          <div className="mt-1 text-xs text-muted-foreground">
            Percentage of income saved
          </div>
        </CardContent>
      </Card>
    </div>
  );
}