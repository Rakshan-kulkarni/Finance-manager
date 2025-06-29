import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinance } from "@/context/FinanceContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { generateColorPalette, formatCurrency } from "@/lib/utils";
import { useState } from "react";

export function CategoryBreakdown() {
  const { getCategoryTotals } = useFinance();
  const categoryTotals = getCategoryTotals();
  
  // Convert to array and sort by amount (highest first)
  const data = Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  
  const colors = generateColorPalette(data.length);
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-md border bg-background p-2 shadow-sm">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">{formatCurrency(payload[0].value)}</p>
          <p className="text-xs text-muted-foreground">
            {((payload[0].value / totalSpending) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };
  
  const totalSpending = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
        <CardDescription>Breakdown of your expenses</CardDescription>
      </CardHeader>
      <CardContent className="px-2">
        {data.length > 0 ? (
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
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
          <div className="flex h-[400px] flex-col items-center justify-center text-center">
            <p className="text-lg font-medium">No expense data yet</p>
            <p className="text-sm text-muted-foreground">
              Add expenses to see your spending breakdown by category
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}