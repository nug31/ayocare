import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ReportForm from './pages/ReportForm';
import ReportHistory from './pages/ReportHistory';
import AdminPanel from './pages/AdminPanel';
import EscalationPage from './pages/EscalationPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { ReportProvider } from './context/ReportContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <ReportProvider>
        <Router>
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/report" element={<ReportForm />} />
                <Route path="/history" element={<ReportHistory />} />
                <Route path="/admin" element={
                  <AdminRoute>
                    <AdminPanel />
                  </AdminRoute>
                } />
                <Route path="/escalation" element={
                  <AdminRoute>
                    <EscalationPage />
                  </AdminRoute>
                } />
              </Routes>
            </Layout>
          </ProtectedRoute>
        </Router>
      </ReportProvider>
    </AuthProvider>
  );
}

export default App;
