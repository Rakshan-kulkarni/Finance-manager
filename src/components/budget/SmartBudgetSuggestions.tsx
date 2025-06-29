import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFinance } from "@/context/FinanceContext";
import { BrainCircuitIcon, TrendingDownIcon, TrendingUpIcon, LineChartIcon, DollarSignIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SmartBudgetSuggestions() {
  const { state } = useFinance();
  
  // These are simulated insights since we don't have real historical data
  // In a real app, we'd calculate these based on actual spending patterns
  const generateSuggestions = () => {
    const suggestions = [];
    
    // This is a placeholder - in a real app, we'd use actual data
    const hasTransactions = state.transactions.length > 0;
    
    if (hasTransactions) {
      // Add some generic suggestions for demo purposes
      suggestions.push({
        icon: <TrendingDownIcon className="h-5 w-5 text-red-500" />,
        category: "Food",
        text: "Your food expenses are 23% higher than last month. Consider meal planning to reduce costs.",
        savingPotential: "₹120/month",
      });
      
      suggestions.push({
        icon: <TrendingUpIcon className="h-5 w-5 text-green-500" />,
        category: "Transportation",
        text: "You've reduced your transportation costs by 15%. Keep up the good work!",
        savingPotential: null,
      });
      
      suggestions.push({
        icon: <LineChartIcon className="h-5 w-5 text-blue-500" />,
        category: "Entertainment",
        text: "Entertainment expenses have been consistent at 12% of your budget. This is within recommended guidelines.",
        savingPotential: null,
      });
      
      suggestions.push({
        icon: <DollarSignIcon className="h-5 w-5 text-amber-500" />,
        category: "Shopping",
        text: "Your shopping expenses spike at the end of each month. Try spreading purchases throughout the month.",
        savingPotential: "₹75/month",
      });
    }
    
    // If we don't have enough real suggestions, add a placeholder
    if (suggestions.length === 0) {
      suggestions.push({
        icon: <BrainCircuitIcon className="h-5 w-5 text-purple-500" />,
        category: null,
        text: "Add more transactions to get personalized budget suggestions.",
        savingPotential: null,
      });
    }
    
    return suggestions;
  };
  
  const suggestions = generateSuggestions();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuitIcon className="h-5 w-5" />
          <span>Smart Budget Suggestions</span>
        </CardTitle>
        <CardDescription>AI-powered budget recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="mt-0.5">{suggestion.icon}</div>
              <div className="flex-grow">
                {suggestion.category && (
                  <div className="mb-1">
                    <Badge variant="outline">{suggestion.category}</Badge>
                  </div>
                )}
                <p className="text-sm">{suggestion.text}</p>
                {suggestion.savingPotential && (
                  <p className="mt-1 text-sm font-medium text-green-500">
                    Potential savings: {suggestion.savingPotential}
                  </p>
                )}
              </div>
              <div className="flex gap-1 ml-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-gray-800 hover:bg-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 text-blue-500 dark:text-blue-400 px-3"
                >
                  EDIT
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { /* Add delete logic here if needed */ }}
                  className="bg-gray-800 hover:bg-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 text-blue-500 dark:text-blue-400 px-3"
                >
                  DELETE
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}