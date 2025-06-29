import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinance } from "@/context/FinanceContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { formatCurrency } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function BudgetProgress() {
  const { state, getCategoryTotals } = useFinance();
  const { budgets } = state;
  
  // Get actual spending by category
  const categorySpending = getCategoryTotals();
  
  // Prepare data for the chart
  const budgetData = budgets.map(budget => {
    const actual = categorySpending[budget.category] || 0;
    const percentage = budget.amount > 0 ? (actual / budget.amount) * 100 : 0;
    
    return {
      category: budget.category,
      budget: budget.amount,
      actual,
      percentage: Math.min(percentage, 100), // Cap at 100% for the progress bar
      overBudget: actual > budget.amount,
    };
  });
  
  // Sort by percentage (highest first)
  budgetData.sort((a, b) => b.percentage - a.percentage);
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-md border bg-background p-2 shadow-sm">
          <p className="font-medium">{label}</p>
          <p className="text-sm">Budget: {formatCurrency(payload[0].value)}</p>
          <p className="text-sm">Actual: {formatCurrency(payload[1].value)}</p>
          <p className="text-sm">
            {payload[1].value > payload[0].value
              ? `Over budget by ${formatCurrency(payload[1].value - payload[0].value)}`
              : `Under budget by ${formatCurrency(payload[0].value - payload[1].value)}`}
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs. Actual</CardTitle>
        <CardDescription>Track your spending against budget targets</CardDescription>
      </CardHeader>
      <CardContent>
        {budgetData.length > 0 ? (
          <>
            <div className="mb-6 h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={budgetData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 70, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tickFormatter={(value) => formatCurrency(value).split('.')[0]} />
                  <YAxis type="category" dataKey="category" width={60} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="budget" name="Budget" fill="#4CAF50" barSize={20} />
                  <Bar dataKey="actual" name="Actual" fill="#FF5722" barSize={20} />
                  <ReferenceLine x={0} stroke="#666" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-4">
              {budgetData.map((item) => (
                <div key={item.category} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{item.category}</p>
                    <p className={item.overBudget ? "text-red-500" : "text-green-500"}>
                      {formatCurrency(item.actual)} / {formatCurrency(item.budget)}
                    </p>
                  </div>
                  <Progress 
                    value={item.percentage} 
                    className={cn("h-2", item.overBudget ? "bg-red-200" : "bg-green-200")} 
                    indicatorClassName={item.overBudget ? "bg-red-500" : "bg-green-500"} 
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {item.percentage.toFixed(0)}% used
                    {item.overBudget && ` (Over by ${formatCurrency(item.actual - item.budget)})`}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex h-[300px] flex-col items-center justify-center text-center">
            <p className="text-lg font-medium">No budget data yet</p>
            <p className="text-sm text-muted-foreground">
              Set up budgets to track your spending against targets
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}