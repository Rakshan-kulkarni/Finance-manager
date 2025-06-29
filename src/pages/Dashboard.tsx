import { FinancialSummary } from "@/components/dashboard/FinancialSummary";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { SpendingOverview } from "@/components/dashboard/SpendingOverview";
import { MonthlySummary } from "@/components/dashboard/MonthlySummary";
import { UpcomingBills } from "@/components/dashboard/UpcomingBills";
import { SmartInsights } from "@/components/dashboard/SmartInsights";

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to MoneyMap. Your financial overview at a glance.
        </p>
      </div>
      
      <FinancialSummary />
      
      <div className="grid gap-6 md:grid-cols-2">
        <RecentTransactions />
        <UpcomingBills />
        <SpendingOverview />
        <MonthlySummary />
        <SmartInsights />
      </div>
    </div>
  );
}