import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  HomeIcon, 
  ArrowUpDownIcon, 
  BarChart2Icon, 
  BellIcon, 
  CalendarIcon, 
  BrainCircuitIcon, 
  MessageSquareIcon, 
  SettingsIcon, 
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import { useFinance } from '@/context/FinanceContext';

const sidebarItems = [
  { name: "Dashboard", path: "/", icon: HomeIcon },
  { name: "Transactions", path: "/transactions", icon: ArrowUpDownIcon },
  { name: "Insights", path: "/insights", icon: BarChart2Icon },
  { name: "Reminders", path: "/reminders", icon: BellIcon },
  { name: "Calendar", path: "/calendar", icon: CalendarIcon },
  { name: "Smart Budget", path: "/smart-budget", icon: BrainCircuitIcon },
  { name: "Ask MoneyMap", path: "/ask", icon: MessageSquareIcon },
  { name: "Settings", path: "/settings", icon: SettingsIcon },
];

interface SidebarLinkProps {
  icon: React.ElementType;
  path: string;
  name: string;
  isActive: boolean;
  onClick?: () => void;
}

const SidebarLink = ({ icon: Icon, path, name, isActive, onClick }: SidebarLinkProps) => (
  <Link
    to={path}
    className={cn(
      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
      isActive 
        ? "bg-accent text-accent-foreground" 
        : "hover:bg-accent hover:text-accent-foreground"
    )}
    onClick={onClick}
  >
    <Icon className="h-4 w-4" />
    <span>{name}</span>
  </Link>
);

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { resetApp } = useFinance();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    resetApp();
    navigate('/login');
  };
  
  return (
    <div className="flex h-full w-full flex-col border-r bg-background">
      <div className="flex h-16 items-center border-b">
        <Link to="/" className="flex items-center gap-2 font-semibold" onClick={onClose}>
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <HomeIcon className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold">MoneyMap</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1">
          {sidebarItems.map((item) => (
            <SidebarLink
              key={item.path}
              icon={item.icon}
              path={item.path}
              name={item.name}
              isActive={location.pathname === item.path}
              onClick={onClose}
            />
          ))}
        </nav>
      </div>
      <div className="border-t pt-4 pb-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} MoneyMap
          </p>
          <ThemeToggle />
        </div>
        <button
          onClick={handleLogout}
          className="mt-4 w-full rounded bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}