import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFinance } from "@/context/FinanceContext";
import { formatCurrency, formatDate } from "@/lib/utils";
import { differenceInDays, parseISO } from "date-fns";
import { BellIcon, CheckIcon, PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";

export function UpcomingBills() {
  const { state } = useFinance();
  const today = new Date();
  
  // Get unpaid reminders due within the next 30 days
  const upcomingBills = state.reminders
    .filter(reminder => !reminder.isPaid)
    .filter(reminder => {
      const dueDate = parseISO(reminder.dueDate);
      const daysDifference = differenceInDays(dueDate, today);
      return daysDifference >= 0 && daysDifference <= 30;
    })
    .sort((a, b) => parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime())
    .slice(0, 5);
  
  // Function to get badge color based on due date
  const getDueDateBadge = (dueDate: string) => {
    const days = differenceInDays(parseISO(dueDate), today);
    
    if (days <= 3) return <Badge variant="destructive">Due soon</Badge>;
    if (days <= 7) return <Badge variant="default">This week</Badge>;
    return <Badge variant="secondary">Upcoming</Badge>;
  };
  
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Upcoming Bills</CardTitle>
          <CardDescription>Bills due in the next 30 days</CardDescription>
        </div>
        <Link to="/reminders" className="text-sm text-blue-500 hover:underline">
          View All
        </Link>
      </CardHeader>
      <CardContent>
        {upcomingBills.length > 0 ? (
          <div className="space-y-4">
            {upcomingBills.map(bill => (
              <div key={bill.id} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-primary">
                    <BellIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{bill.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Due: {formatDate(bill.dueDate, 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {bill.amount && (
                    <p className="font-medium">{formatCurrency(bill.amount)}</p>
                  )}
                  {getDueDateBadge(bill.dueDate)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <CheckIcon className="mb-2 h-10 w-10 text-green-500" />
            <h3 className="mb-1 text-lg font-medium">No upcoming bills</h3>
            <p className="text-sm text-muted-foreground">
              You're all caught up! No bills due in the next 30 days.
            </p>
            <Link
              to="/reminders"
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <PlusIcon className="h-4 w-4" />
              Add Reminder
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}