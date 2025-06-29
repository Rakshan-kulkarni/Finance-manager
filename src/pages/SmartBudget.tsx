import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BudgetForm } from "@/components/budget/BudgetForm";
import { useFinance } from "@/context/FinanceContext";
import { Budget, TransactionType } from "@/types";
import { PlusIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogCancel, 
  AlertDialogAction 
} from "@/components/ui/alert-dialog";

export function SmartBudget() {
  const { state, deleteBudget } = useFinance();
  const { budgets } = state;
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<string | null>(null);
  
  const handleAddClick = () => {
    setShowAddDialog(true);
  };
  
  const handleEditBudget = (budget: Budget) => {
    setSelectedBudget(budget);
    setShowEditDialog(true);
  };
  
  const handleDeleteClick = (id: string) => {
    setBudgetToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (budgetToDelete) {
      deleteBudget(budgetToDelete);
      setBudgetToDelete(null);
      setDeleteDialogOpen(false);
    }
  };
  
  const handleCloseAddDialog = () => {
    setShowAddDialog(false);
  };
  
  const handleCloseEditDialog = () => {
    setShowEditDialog(false);
    setSelectedBudget(null);
  };
  
  const getProgressColor = (value: number) => {
    if (value > 90) return "bg-red-500";
    if (value > 70) return "bg-yellow-500";
    return "bg-green-500";
  };
  
  return (
    <div className="!px-0 md:!px-0">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold tracking-tight">Smart Budget</h1>
            <p className="text-muted-foreground">
              Set budget limits and get intelligent suggestions
            </p>
          </div>
          <Button onClick={handleAddClick}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Budget
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="md:col-span-2">
            <CardHeader>
              <h2 className="text-xl font-semibold">Your Budgets</h2>
            </CardHeader>
            <CardContent>
              {budgets.length > 0 ? (
                <div className="space-y-4">
                  {budgets.map(budget => {
                    const spent = state.transactions
                      .filter(t => t.category === budget.category && t.type === TransactionType.EXPENSE)
                      .reduce((sum, t) => sum + t.amount, 0);
                    const progress = (spent / budget.amount) * 100;

                    return (
                      <div key={budget.id} className="rounded-md border p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{budget.category}</h3>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditBudget(budget)}>EDIT</Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(budget.id)}>DELETE</Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {budget.period === "monthly" ? "Monthly" : "Yearly"} budget
                        </p>
                        <div className="mt-4">
                          <div className="flex justify-between text-sm">
                            <span>{formatCurrency(spent)} spent</span>
                            <span className="text-muted-foreground">
                              {formatCurrency(budget.amount)}
                            </span>
                          </div>
                          <Progress value={progress} className="mt-1 h-2" indicatorClassName={getProgressColor(progress)} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-md border border-dashed py-12 text-center">
                  <p className="mb-4 text-lg font-medium">No budgets yet</p>
                  <p className="mb-4 text-muted-foreground">
                    Set budget limits for different categories to track your spending
                  </p>
                  <Button onClick={handleAddClick}>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add Your First Budget
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Budget</DialogTitle>
            </DialogHeader>
            <BudgetForm 
              onSubmit={handleCloseAddDialog} 
              onCancel={handleCloseAddDialog}
            />
          </DialogContent>
        </Dialog>
        
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Budget</DialogTitle>
            </DialogHeader>
            {selectedBudget && (
              <BudgetForm 
                budget={selectedBudget}
                onSubmit={handleCloseEditDialog} 
                onCancel={handleCloseEditDialog}
              />
            )}
          </DialogContent>
        </Dialog>
        
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                budget from your records.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}