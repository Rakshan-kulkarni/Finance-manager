import { CategoryBreakdown } from "@/components/insights/CategoryBreakdown";
import { SavingsOverTime } from "@/components/insights/SavingsOverTime";
import { BudgetProgress } from "@/components/insights/BudgetProgress";

export function Insights() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Insights</h1>
        <p className="text-muted-foreground">
          Visualize your financial data for better understanding
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <CategoryBreakdown />
        <SavingsOverTime />
        <BudgetProgress />
      </div>
    </div>
  );
}