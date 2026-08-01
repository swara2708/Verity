import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import LandingPage from './pages/landing/index.tsx';
import HRLoginPage from './pages/login-hr/index.tsx';
import EmployeeLoginPage from './pages/login-employee/index.tsx';
import OnboardingPage from './pages/onboarding/index.tsx';
import JoinTokenPage from './pages/join-token/index.tsx';
import HRDashboardPage from './pages/hr-dashboard/index.tsx';
import HRRequestsPage from './pages/hr-requests/index.tsx';
import HRReviewPage from './pages/hr-review-employee/index.tsx';
import EmployeePanelPage from './pages/panel/index.tsx';
import PanelDailyPage from './pages/panel-daily/index.tsx';

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
