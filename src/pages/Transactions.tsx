import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { TransactionList } from "@/components/transactions/TransactionList";
import { Transaction } from "@/types";
import { PlusIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { useFinance } from "@/context/FinanceContext";

export function Transactions() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const { state } = useFinance();
  
  // Compute filtered transactions for the preview card
  const filteredTransactions = state.transactions
    .filter((transaction) => {
      const searchMatch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (transaction.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ?? false);
      const categoryMatch = categoryFilter === "all" || transaction.category === categoryFilter;
      const typeMatch = typeFilter === "all" || transaction.type === typeFilter;
      return searchMatch && categoryMatch && typeMatch;
    });

  const handleAddClick = () => {
    setShowAddDialog(true);
  };
  
  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowEditDialog(true);
  };
  
  const handleCloseAddDialog = () => {
    setShowAddDialog(false);
  };
  
  const handleCloseEditDialog = () => {
    setShowEditDialog(false);
    setSelectedTransaction(null);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            Manage your income and expenses
          </p>
        </div>
        <Button onClick={handleAddClick}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionList
              onEditTransaction={handleEditTransaction}
              searchTerm={""}
              categoryFilter={"all"}
              typeFilter={"all"}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
            />
            {/* Filtered Results inside Filters card */}
            {(categoryFilter !== "all" || typeFilter !== "all" || searchTerm) && (
              <div className="mt-6">
                <div className="font-semibold mb-2">
                  Filtered Results
                  {categoryFilter !== "all" && `: ${categoryFilter}`}
                  {typeFilter !== "all" && ` (${typeFilter})`}
                </div>
                {filteredTransactions.length > 0 ? (
                  <TransactionList
                    onEditTransaction={handleEditTransaction}
                    searchTerm={searchTerm}
                    categoryFilter={categoryFilter}
                    typeFilter={typeFilter}
                  />
                ) : (
                  <div className="text-muted-foreground">No transactions match your filter.</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
          </DialogHeader>
          <TransactionForm 
            onSubmit={handleCloseAddDialog} 
            onCancel={handleCloseAddDialog}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px}">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <TransactionForm 
              transaction={selectedTransaction}
              onSubmit={handleCloseEditDialog} 
              onCancel={handleCloseEditDialog}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}