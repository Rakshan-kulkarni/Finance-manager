import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinance } from "@/context/FinanceContext";
import { BrainCircuitIcon, LineChartIcon, PieChartIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";

export function SmartInsights() {
  const { state, getTotalIncome, getTotalExpenses, getSavingsRate } = useFinance();
  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const savingsRate = getSavingsRate();
  
  // These are simulated insights since we don't have real historical data
  // In a real app, we'd calculate these based on actual trends
  const generateInsights = () => {
    const insights = [];
    
    // This is a demo placeholder - in a real app, we'd use actual data
    const hasTransactions = state.transactions.length > 0;
    
    if (hasTransactions) {
      if (savingsRate < 10) {
        insights.push({
          icon: <TrendingDownIcon className="h-5 w-5 text-red-500" />,
          text: "Your savings rate is below 10%. Consider reducing discretionary spending.",
        });
      } else if (savingsRate > 20) {
        insights.push({
          icon: <TrendingUpIcon className="h-5 w-5 text-green-500" />,
          text: "Great job! Your savings rate is above 20%, which is excellent.",
        });
      }
      
      if (totalExpenses > totalIncome * 0.9) {
        insights.push({
          icon: <PieChartIcon className="h-5 w-5 text-amber-500" />,
          text: "Your expenses are over 90% of your income. Review your budget to find savings opportunities.",
        });
      }
      
      // Add some generic insights for demo purposes
      insights.push({
        icon: <LineChartIcon className="h-5 w-5 text-blue-500" />,
        text: "Based on your current spending patterns, you could save an additional 15% by optimizing your food budget.",
      });
    }
    
    // If we don't have enough real insights, add some placeholder ones
    if (insights.length < 3) {
      insights.push({
        icon: <BrainCircuitIcon className="h-5 w-5 text-purple-500" />,
        text: "Add more transactions to get personalized financial insights and recommendations.",
      });
    }
    
    return insights;
  };
  
  const insights = generateInsights();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuitIcon className="h-5 w-5" />
          <span>Smart Insights</span>
        </CardTitle>
        <CardDescription>AI-powered financial recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {insights.map((insight, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="mt-0.5">{insight.icon}</div>
              <p className="text-sm">{insight.text}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}