import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinance } from "@/context/FinanceContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/utils";

export function MonthlySummary() {
  const { getMonthlyData } = useFinance();
  const data = getMonthlyData();
  
  // Format the month labels (e.g., 2023-01 -> Jan)
  const formattedData = data.map(item => ({
    ...item,
    month: new Date(item.month + "-01").toLocaleString('default', { month: 'short' })
  }));
  
  // Show last 6 months if we have that many
  const displayData = formattedData.slice(-6);
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-md border bg-background p-2 shadow-sm">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-green-500">Income: {formatCurrency(payload[0].value)}</p>
          <p className="text-sm text-red-500">Expenses: {formatCurrency(payload[1].value)}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Summary</CardTitle>
        <CardDescription>Income vs expenses by month</CardDescription>
      </CardHeader>
      <CardContent className="px-2">
        {displayData.length > 0 ? (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={displayData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis 
                  tickFormatter={(value) => formatCurrency(value, 'INR').split('.')[0]} 
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="income" name="Income" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#F44336" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-[300px] flex-col items-center justify-center text-center">
            <p className="text-lg font-medium">No monthly data yet</p>
            <p className="text-sm text-muted-foreground">
              Add transactions to see your monthly summary
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}