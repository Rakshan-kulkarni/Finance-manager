import { Card } from "@/components/ui/card";
import { useFinance } from "@/context/FinanceContext";
import { formatCurrency, formatDate, getTransactionTypeColor } from "@/lib/utils";
import { Transaction, TransactionType } from "@/types";
import { parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
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
import { useState } from "react";

interface TransactionListProps {
  onEditTransaction: (transaction: Transaction) => void;
  searchTerm: string;
  categoryFilter: string;
  typeFilter: string;
}

export function TransactionList({ onEditTransaction, searchTerm, categoryFilter, typeFilter }: TransactionListProps) {
  const { state, deleteTransaction } = useFinance();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  
  // Filter and sort transactions
  const filteredTransactions = state.transactions
    .filter((transaction) => {
      // Apply search filter
      const searchMatch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (transaction.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ?? false);
      // Apply category filter
      const categoryMatch = categoryFilter === "all" || transaction.category === categoryFilter;
      // Apply type filter
      const typeMatch = typeFilter === "all" || transaction.type === typeFilter;
      return searchMatch && categoryMatch && typeMatch;
    })
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
  
  const handleDeleteClick = (id: string) => {
    setTransactionToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (transactionToDelete) {
      deleteTransaction(transactionToDelete);
      setTransactionToDelete(null);
      setDeleteDialogOpen(false);
    }
  };
  
  return (
    <>
      {filteredTransactions.length > 0 ? (
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <Card key={transaction.id} className="overflow-hidden">
              <div className="flex items-center justify-between p-4">
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <h3 className="font-medium">{transaction.description}</h3>
                    {transaction.tags && transaction.tags.length > 0 && (
                      <div className="ml-2 flex gap-1">
                        {transaction.tags.map((tag) => (
                          <span 
                            key={tag} 
                            className="rounded-full bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{transaction.category}</span>
                    <span>•</span>
                    <span>{formatDate(transaction.date)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`font-medium ${getTransactionTypeColor(transaction.type)}`}>
                    {transaction.type === TransactionType.EXPENSE ? "-" : "+"}
                    {formatCurrency(transaction.amount)}
                  </span>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditTransaction(transaction)}
                      className="bg-gray-800 hover:bg-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 text-blue-500 dark:text-blue-400 px-3"
                    >
                      EDIT
                    </Button>
                    <Button 
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(transaction.id)}
                      className="bg-gray-800 hover:bg-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 text-blue-500 dark:text-blue-400 px-3"
                    >
                      DELETE
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed py-12">
          <p className="mb-4 text-lg font-medium">No transactions found</p>
          <p className="text-muted-foreground">
            {searchTerm || categoryFilter !== "all" || typeFilter !== "all"
              ? "Try adjusting your filters"
              : "Add your first transaction to get started"}
          </p>
        </div>
      )}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              transaction from your records.
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
    </>
  );
}