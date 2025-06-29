import { useFinance } from "@/context/FinanceContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Budget } from "@/types";

interface BudgetFormProps {
  budget?: Budget;
  onSubmit: () => void;
  onCancel: () => void;
}

export function BudgetForm({ budget, onSubmit, onCancel }: BudgetFormProps) {
  const { state, addBudget, updateBudget } = useFinance();
  const { categories } = state.settings;
  
  const [category, setCategory] = useState(budget?.category || categories[0]);
  const [amount, setAmount] = useState(budget?.amount.toString() || "");
  const [period, setPeriod] = useState<"monthly" | "yearly">(budget?.period || "monthly");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const budgetData = {
      category,
      amount: parseFloat(amount),
      period,
    };
    
    if (budget) {
      updateBudget({ ...budgetData, id: budget.id });
    } else {
      addBudget(budgetData);
    }
    
    onSubmit();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger id="category" className="mt-1">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="amount">Budget Amount</Label>
        <div className="relative mt-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">₹</span>
          </div>
          <Input
            id="amount"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="pl-7"
            step="0.01"
            min="0"
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="period">Period</Label>
        <Select value={period} onValueChange={(value) => setPeriod(value as "monthly" | "yearly")}>
          <SelectTrigger id="period" className="mt-1">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {budget ? "Update" : "Add"} Budget
        </Button>
      </div>
    </form>
  );
}