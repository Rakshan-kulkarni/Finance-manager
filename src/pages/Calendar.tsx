import { CalendarView } from "@/components/calendar/CalendarView";

export function CalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">
          View your financial activities by date
        </p>
      </div>
      
      <CalendarView />
    </div>
  );
}