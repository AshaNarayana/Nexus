
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from './hooks/useUser';
import Layout from './components/Layout';
import UserSelectionPage from './pages/UserSelectionPage';
import DashboardPage from './pages/DashboardPage';
import MyExpensesPage from './pages/MyExpensesPage';
import SharedExpensesPage from './pages/SharedExpensesPage';
import GoalsPage from './pages/GoalsPage';
import MyInvestmentsPage from './pages/MyInvestmentsPage';
import SharedInvestmentsPage from './pages/SharedInvestmentsPage';
import SettingsPage from './pages/SettingsPage';

const App: React.FC = () => {
  const { user } = useUser();

  if (!user) {
    return <UserSelectionPage />;
  }

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/my-expenses" element={<MyExpensesPage />} />
          <Route path="/shared-expenses" element={<SharedExpensesPage />} />
          <Route path="/my-investments" element={<MyInvestmentsPage />} />
          <Route path="/shared-investments" element={<SharedInvestmentsPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
