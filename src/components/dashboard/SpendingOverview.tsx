import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinance } from "@/context/FinanceContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { generateColorPalette, formatCurrency } from "@/lib/utils";
import { useEffect, useState } from "react";

export function SpendingOverview() {
  const { getCategoryTotals } = useFinance();
  const [data, setData] = useState<{ name: string; value: number }[]>([]);
  
  useEffect(() => {
    const categoryTotals = getCategoryTotals();
    const chartData = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        name: category,
        value: amount,
      }))
      .sort((a, b) => b.value - a.value);
    
    setData(chartData);
  }, [getCategoryTotals]);
  
  const colors = generateColorPalette(data.length);
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-md border bg-background p-2 shadow-sm">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Overview</CardTitle>
        <CardDescription>Breakdown by category</CardDescription>
      </CardHeader>
      <CardContent className="px-2">
        {data.length > 0 ? (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-[300px] flex-col items-center justify-center text-center">
            <p className="text-lg font-medium">No expense data yet</p>
            <p className="text-sm text-muted-foreground">
              Add expenses to see your spending breakdown
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}