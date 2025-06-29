import { useFinance } from "@/context/FinanceContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RecurrenceType, Reminder } from "@/types";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

interface ReminderFormProps {
  reminder?: Reminder;
  onSubmit: () => void;
  onCancel: () => void;
}

export function ReminderForm({ reminder, onSubmit, onCancel }: ReminderFormProps) {
  const { state, addReminder, updateReminder } = useFinance();
  const { categories } = state.settings;
  
  const [title, setTitle] = useState(reminder?.title || "");
  const [amount, setAmount] = useState(reminder?.amount?.toString() || "");
  const [dueDate, setDueDate] = useState<Date>(
    reminder?.dueDate ? new Date(reminder.dueDate) : new Date()
  );
  const [category, setCategory] = useState(reminder?.category || categories[0]);
  const [isPaid, setIsPaid] = useState(reminder?.isPaid || false);
  const [recurrence, setRecurrence] = useState<RecurrenceType>(
    reminder?.recurrence || RecurrenceType.NONE
  );
  const [notes, setNotes] = useState(reminder?.notes || "");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const reminderData = {
      title,
      amount: amount ? parseFloat(amount) : undefined,
      dueDate: dueDate.toISOString(),
      category,
      isPaid,
      recurrence,
      notes: notes || undefined,
    };
    
    if (reminder) {
      updateReminder({ ...reminderData, id: reminder.id });
    } else {
      addReminder(reminderData);
    }
    
    onSubmit();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1"
          placeholder="e.g., Rent, Phone Bill, etc."
          required
        />
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="amount">Amount (Optional)</Label>
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
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="category">Category (Optional)</Label>
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
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="due-date">Due Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "mt-1 w-full justify-start text-left font-normal",
                  !dueDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={(newDate) => newDate && setDueDate(newDate)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <Label htmlFor="recurrence">Recurrence</Label>
          <Select value={recurrence} onValueChange={(value) => setRecurrence(value as RecurrenceType)}>
            <SelectTrigger id="recurrence" className="mt-1">
              <SelectValue placeholder="Select recurrence" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={RecurrenceType.NONE}>One-time</SelectItem>
              <SelectItem value={RecurrenceType.DAILY}>Daily</SelectItem>
              <SelectItem value={RecurrenceType.WEEKLY}>Weekly</SelectItem>
              <SelectItem value={RecurrenceType.MONTHLY}>Monthly</SelectItem>
              <SelectItem value={RecurrenceType.YEARLY}>Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is-paid"
            checked={isPaid}
            onChange={(e) => setIsPaid(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <Label htmlFor="is-paid">Mark as paid</Label>
        </div>
      </div>
      
      <div>
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-1"
          placeholder="Add any additional details..."
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {reminder ? "Update" : "Add"} Reminder
        </Button>
      </div>
    </form>
  );
}