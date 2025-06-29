import { useFinance } from "@/context/FinanceContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PlusIcon, TrashIcon, XIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
import { downloadJSON, downloadCSV, requestNotificationPermission } from "@/lib/utils";
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function SettingsForm() {
  const { state, updateSettings, exportData, importData, resetAllUserData } = useFinance();
  const navigate = useNavigate();
  const { currency, startDayOfMonth, categories, showNotifications } = state.settings;
  
  const [newCategory, setNewCategory] = useState("");
  const [importData1, setImportData] = useState("");
  const [importError, setImportError] = useState("");
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  
  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      updateSettings({
        categories: [...categories, newCategory.trim()],
      });
      setNewCategory("");
    }
  };
  
  const handleRemoveCategory = (categoryToRemove: string) => {
    updateSettings({
      categories: categories.filter(category => category !== categoryToRemove),
    });
  };
  
  const handleExportJSON = () => {
    downloadJSON(JSON.parse(exportData()), "moneymap-export.json");
  };
  
  const handleExportCSV = () => {
    // Export transactions as CSV
    downloadCSV(state.transactions, "moneymap-transactions.csv");
  };
  
  const handleImport = () => {
    try {
      importData(importData1);
      setImportData("");
      setImportError("");
    } catch (error) {
      setImportError("Invalid JSON data. Please check the format and try again.");
    }
  };
  
  const handleReset = () => {
    resetAllUserData();
    setResetDialogOpen(false);
  };
  
  const handleToggleNotifications = async () => {
    if (!showNotifications) {
      const permission = await requestNotificationPermission();
      updateSettings({ showNotifications: permission });
    } else {
      updateSettings({ showNotifications: false });
    }
  };
  
  const handleDeleteAccount = async () => {
    setDeleteError("");
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/account`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        setDeleteError(data.message || 'Failed to delete account');
        return;
      }
      // Success: log out and reset state
      localStorage.removeItem('token');
      window.location.href = '/login';
    } catch (err) {
      setDeleteError('Failed to delete account');
    }
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-lg font-medium">General Settings</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select 
                value={currency} 
                onValueChange={(value) => updateSettings({ currency: value })}
              >
                <SelectTrigger id="currency" className="mt-1">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">INR (₹)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="JPY">JPY (¥)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="start-day">Month Start Day</Label>
              <Input
                id="start-day"
                type="number"
                min="1"
                max="31"
                value={startDayOfMonth}
                onChange={(e) => updateSettings({ startDayOfMonth: parseInt(e.target.value) || 1 })}
                className="mt-1"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                The day of the month when your budget cycle starts
              </p>
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="show-notifications"
                checked={showNotifications}
                onChange={handleToggleNotifications}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="show-notifications">Enable Notifications</Label>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Allow browser notifications for bill reminders
            </p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="mb-4 text-lg font-medium">Categories</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Add new category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCategory();
                }
              }}
            />
            <Button type="button" onClick={handleAddCategory}>
              <PlusIcon className="h-4 w-4" />
              <span className="ml-2">Add</span>
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge key={category} variant="secondary" className="flex items-center gap-1">
                {category}
                <button
                  type="button"
                  onClick={() => handleRemoveCategory(category)}
                  className="ml-1 rounded-full p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <XIcon className="h-3 w-3" />
                  <span className="sr-only">Remove {category}</span>
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="mb-4 text-lg font-medium">Data Management</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-medium">Export Data</h4>
              <div className="flex gap-2">
                <Button onClick={handleExportJSON} variant="outline">
                  Export as JSON
                </Button>
                <Button onClick={handleExportCSV} variant="outline">
                  Export as CSV
                </Button>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Download all your data for backup or transfer
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-medium">Import Data</h4>
              <Textarea
                placeholder="Paste your JSON data here"
                value={importData1}
                onChange={(e) => {
                  setImportData(e.target.value);
                  setImportError("");
                }}
                className="mb-2"
              />
              {importError && (
                <p className="mb-2 text-sm text-red-500">{importError}</p>
              )}
              <Button onClick={handleImport} disabled={!importData1}>
                Import
              </Button>
              <p className="mt-1 text-xs text-muted-foreground">
                Import previously exported data
              </p>
            </div>
          </div>
          
          <div>
            <h4 className="mb-2 font-medium">Reset Application</h4>
            <Button 
              variant="destructive" 
              onClick={() => setResetDialogOpen(true)}
            >
              <TrashIcon className="mr-2 h-4 w-4" />
              Reset All Data
            </Button>
            <p className="mt-1 text-xs text-muted-foreground">
              This will permanently delete all your data and reset the application to its default state.
            </p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="mb-4 text-lg font-medium">Delete Account</h3>
        <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
          <TrashIcon className="mr-2 h-4 w-4" />
          Delete Account
        </Button>
        <p className="mt-2 text-sm text-muted-foreground">
          This will permanently delete your account and all associated data. This action cannot be undone.
        </p>
      </div>
      
      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all your
              financial data and reset the application to its default state.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReset} className="bg-red-500 hover:bg-red-600">
              Reset All Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              Please enter your password to confirm account deletion. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            type="password"
            placeholder="Enter your password"
            value={deletePassword}
            onChange={e => setDeletePassword(e.target.value)}
            className="mt-2"
          />
          {deleteError && <div className="text-red-500 text-sm mt-2">{deleteError}</div>}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDeleteAccount}>
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}