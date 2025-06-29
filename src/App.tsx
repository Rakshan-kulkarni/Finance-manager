import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { FinanceProvider } from '@/context/FinanceContext';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { Transactions } from '@/pages/Transactions';
import { Insights } from '@/pages/Insights';
import { Reminders } from '@/pages/Reminders';
import { CalendarPage } from '@/pages/Calendar';
import { SmartBudget } from '@/pages/SmartBudget';
import { ChatbotPage } from '@/pages/ChatbotPage';
import { Settings } from '@/pages/Settings';
import { Toaster } from '@/components/ui/toaster';
import { useEffect } from 'react';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Profile from '@/pages/Profile';
import './App.css';

function RequireAuth() {
  const token = localStorage.getItem('token');
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

function App() {
  // Update the title
  useEffect(() => {
    document.title = 'MoneyMap - Personal Finance Tracker';
  }, []);
  
  return (
    <FinanceProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<RequireAuth />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="insights" element={<Insights />} />
              <Route path="reminders" element={<Reminders />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="smart-budget" element={<SmartBudget />} />
              <Route path="ask" element={<ChatbotPage />} />
              <Route path="settings" element={<Settings />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </FinanceProvider>
  );
}

export default App;