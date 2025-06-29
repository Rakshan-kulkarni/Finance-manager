import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinance } from "@/context/FinanceContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/utils";

export function SavingsOverTime() {
  const { getMonthlyData } = useFinance();
  const monthlyData = getMonthlyData();
  
  // Calculate cumulative savings for each month
  const savingsData = monthlyData.map((item, index) => {
    const savings = item.income - item.expenses;
    const previousSavings = index > 0 ? savingsData[index - 1]?.cumulativeSavings || 0 : 0;
    const cumulativeSavings = previousSavings + savings;
    
    return {
      month: new Date(item.month + "-01").toLocaleString('default', { month: 'short' }),
      savings,
      cumulativeSavings,
    };
  });
  
  // Show last 12 months if we have that many
  const displayData = savingsData.slice(-12);
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-md border bg-background p-2 shadow-sm">
          <p className="font-medium">{label}</p>
          <p className="text-sm">
            Monthly Savings: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-sm">
            Total Savings: {formatCurrency(payload[1].value)}
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Savings Over Time</CardTitle>
        <CardDescription>Track your monthly and cumulative savings</CardDescription>
      </CardHeader>
      <CardContent className="px-2">
        {displayData.length > 0 ? (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={displayData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis 
                  tickFormatter={(value) => formatCurrency(value).split('.')[0]} 
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="savings" 
                  name="Monthly Savings" 
                  stroke="#4CAF50" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="cumulativeSavings" 
                  name="Total Savings" 
                  stroke="#2196F3" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-[400px] flex-col items-center justify-center text-center">
            <p className="text-lg font-medium">No savings data yet</p>
            <p className="text-sm text-muted-foreground">
              Add income and expenses to track your savings over time
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}