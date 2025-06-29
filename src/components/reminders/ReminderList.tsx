import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFinance } from "@/context/FinanceContext";
import { formatCurrency, formatDate, getRecurrenceLabel } from "@/lib/utils";
import { Reminder } from "@/types";
import { differenceInDays, parseISO } from "date-fns";
import { BellIcon, CheckIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
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

interface ReminderListProps {
  onEditReminder: (reminder: Reminder) => void;
}

export function ReminderList({ onEditReminder }: ReminderListProps) {
  const { state, updateReminder, deleteReminder } = useFinance();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reminderToDelete, setReminderToDelete] = useState<string | null>(null);
  
  const today = new Date();
  
  // Sort reminders by due date (earliest first)
  const sortedReminders = [...state.reminders].sort((a, b) => {
    // Sort by paid status first (unpaid first)
    if (a.isPaid !== b.isPaid) {
      return a.isPaid ? 1 : -1;
    }
    // Then sort by due date
    return parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime();
  });
  
  const handleTogglePaid = (reminder: Reminder) => {
    updateReminder({
      ...reminder,
      isPaid: !reminder.isPaid,
    });
  };
  
  const handleDeleteClick = (id: string) => {
    setReminderToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (reminderToDelete) {
      deleteReminder(reminderToDelete);
      setReminderToDelete(null);
      setDeleteDialogOpen(false);
    }
  };
  
  // Function to get badge for due date
  const getDueDateBadge = (dueDate: string, isPaid: boolean) => {
    if (isPaid) return <Badge variant="outline">Paid</Badge>;
    
    const days = differenceInDays(parseISO(dueDate), today);
    
    if (days < 0) return <Badge variant="destructive">Overdue</Badge>;
    if (days === 0) return <Badge variant="destructive">Due today</Badge>;
    if (days <= 3) return <Badge variant="default">Due soon</Badge>;
    return <Badge variant="secondary">Upcoming</Badge>;
  };
  
  return (
    <>
      {sortedReminders.length > 0 ? (
        <div className="space-y-4">
          {sortedReminders.map((reminder) => (
            <Card key={reminder.id} className="overflow-hidden">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    reminder.isPaid ? "bg-green-100 text-green-500" : "bg-gray-100 text-primary"
                  } dark:bg-gray-800`}>
                    {reminder.isPaid ? <CheckIcon className="h-5 w-5" /> : <BellIcon className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className={`font-medium ${reminder.isPaid ? "line-through text-muted-foreground" : ""}`}>
                      {reminder.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                      <span>Due: {formatDate(reminder.dueDate)}</span>
                      {reminder.recurrence !== "none" && (
                        <>
                          <span>•</span>
                          <span>{getRecurrenceLabel(reminder.recurrence)}</span>
                        </>
                      )}
                      {reminder.category && (
                        <>
                          <span>•</span>
                          <span>{reminder.category}</span>
                        </>
                      )}
                    </div>
                    {reminder.notes && (
                      <p className="mt-1 text-sm text-muted-foreground">{reminder.notes}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end gap-2">
                    {reminder.amount && (
                      <span className="font-medium">
                        {formatCurrency(reminder.amount)}
                      </span>
                    )}
                    {getDueDateBadge(reminder.dueDate, reminder.isPaid)}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Switch
                      checked={reminder.isPaid}
                      onCheckedChange={() => handleTogglePaid(reminder)}
                      aria-label="Toggle paid status"
                    />
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onEditReminder(reminder)}
                        className="bg-gray-800 hover:bg-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 text-blue-500 dark:text-blue-400 px-3"
                      >
                        EDIT
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteClick(reminder.id)}
                        className="bg-gray-800 hover:bg-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 text-blue-500 dark:text-blue-400 px-3"
                      >
                        DELETE
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed py-12">
          <BellIcon className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="mb-2 text-lg font-medium">No reminders found</p>
          <p className="text-muted-foreground">
            Add your first reminder to track upcoming bills and payments
          </p>
        </div>
      )}
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              reminder from your records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}