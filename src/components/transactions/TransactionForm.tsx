import { useFinance } from "@/context/FinanceContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RecurrenceType, Transaction, TransactionType } from "@/types";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, PlusIcon, XIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface TransactionFormProps {
  transaction?: Transaction;
  onSubmit: () => void;
  onCancel: () => void;
}

export function TransactionForm({ transaction, onSubmit, onCancel }: TransactionFormProps) {
  const { state, addTransaction, updateTransaction } = useFinance();
  const { categories } = state.settings;
  
  const [amount, setAmount] = useState(transaction?.amount.toString() || "");
  const [description, setDescription] = useState(transaction?.description || "");
  const [category, setCategory] = useState(transaction?.category || categories[0]);
  const [transactionType, setTransactionType] = useState<TransactionType>(
    transaction?.type || TransactionType.EXPENSE
  );
  const [date, setDate] = useState<Date>(
    transaction?.date ? new Date(transaction.date) : new Date()
  );
  const [tags, setTags] = useState<string[]>(transaction?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [recurrence, setRecurrence] = useState<RecurrenceType>(
    transaction?.recurrence || RecurrenceType.NONE
  );
  const [recurrenceEndDate, setRecurrenceEndDate] = useState<Date | undefined>(
    transaction?.recurrenceEndDate ? new Date(transaction.recurrenceEndDate) : undefined
  );
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const transactionData = {
      amount: parseFloat(amount),
      description,
      category,
      date: date.toISOString(),
      type: transactionType,
      tags,
      recurrence,
      recurrenceEndDate: recurrenceEndDate?.toISOString(),
    };
    
    if (transaction) {
      updateTransaction({ ...transactionData, id: transaction.id });
    } else {
      addTransaction(transactionData);
    }
    
    onSubmit();
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="amount">Amount</Label>
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
          <Label htmlFor="transaction-type">Transaction Type</Label>
          <Select
            value={transactionType}
            onValueChange={(value) => setTransactionType(value as TransactionType)}
          >
            <SelectTrigger id="transaction-type" className="mt-1">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TransactionType.EXPENSE}>Expense</SelectItem>
              <SelectItem value={TransactionType.INCOME}>Income</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1"
          placeholder="What was this transaction for?"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          <Label htmlFor="date">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "mt-1 w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
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
      
      {recurrence !== RecurrenceType.NONE && (
        <div>
          <Label htmlFor="recurrence-end-date">End Date (Optional)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "mt-1 w-full justify-start text-left font-normal",
                  !recurrenceEndDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {recurrenceEndDate ? (
                  format(recurrenceEndDate, "PPP")
                ) : (
                  <span>No end date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={recurrenceEndDate}
                onSelect={setRecurrenceEndDate}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
      
      <div>
        <Label htmlFor="tags">Tags</Label>
        <div className="mt-1 flex items-center gap-2">
          <Input
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
            placeholder="Add tags (press Enter to add)"
          />
          <Button
            type="button"
            variant="outline"
            className="bg-transparent border border-input rounded-md h-9 flex items-center justify-center shadow-sm"
            onClick={handleAddTag}
          >
            <PlusIcon className="h-5 w-5 text-white" />
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 rounded-full p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <XIcon className="h-3 w-3" />
                  <span className="sr-only">Remove {tag}</span>
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {transaction ? "Update" : "Add"} Transaction
        </Button>
      </div>
    </form>
  );
}