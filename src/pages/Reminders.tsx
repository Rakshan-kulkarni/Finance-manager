import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ReminderForm } from "@/components/reminders/ReminderForm";
import { ReminderList } from "@/components/reminders/ReminderList";
import { Reminder } from "@/types";
import { PlusIcon } from "lucide-react";

export function Reminders() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);
  
  const handleAddClick = () => {
    setShowAddDialog(true);
  };
  
  const handleEditReminder = (reminder: Reminder) => {
    setSelectedReminder(reminder);
    setShowEditDialog(true);
  };
  
  const handleCloseAddDialog = () => {
    setShowAddDialog(false);
  };
  
  const handleCloseEditDialog = () => {
    setShowEditDialog(false);
    setSelectedReminder(null);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight">Reminders</h1>
          <p className="text-muted-foreground">
            Track bills and upcoming payments
          </p>
        </div>
        <Button onClick={handleAddClick}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Reminder
        </Button>
      </div>
      
      <ReminderList onEditReminder={handleEditReminder} />
      
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Reminder</DialogTitle>
          </DialogHeader>
          <ReminderForm 
            onSubmit={handleCloseAddDialog} 
            onCancel={handleCloseAddDialog}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Reminder</DialogTitle>
          </DialogHeader>
          {selectedReminder && (
            <ReminderForm 
              reminder={selectedReminder}
              onSubmit={handleCloseEditDialog} 
              onCancel={handleCloseEditDialog}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}