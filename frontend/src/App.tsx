import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import LandingPage from './pages/landing';
import HRLoginPage from './pages/login-hr';
import EmployeeLoginPage from './pages/login-employee';
import OnboardingPage from './pages/onboarding';
import JoinTokenPage from './pages/join-token/index';
import HRDashboardPage from './pages/hr-dashboard';
import HRRequestsPage from './pages/hr-requests';
import HRReviewPage from './pages/hr-review-employee/index';
import EmployeePanelPage from './pages/panel';
import PanelDailyPage from './pages/panel-daily';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login/hr" element={<HRLoginPage />} />
          <Route path="/login" element={<EmployeeLoginPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/join/:token" element={<JoinTokenPage />} />
          <Route path="/hr/dashboard" element={<HRDashboardPage />} />
          <Route path="/hr/requests" element={<HRRequestsPage />} />
          <Route path="/hr/review/:employeeId" element={<HRReviewPage />} />
          <Route path="/panel" element={<EmployeePanelPage />} />
          <Route path="/panel/daily" element={<PanelDailyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
