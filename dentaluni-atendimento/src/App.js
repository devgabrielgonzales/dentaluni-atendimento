import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';
import './styles/App.css';

const LoginPage = lazy(() => import('./components/LoginPage'));
const MenuPage = lazy(() => import('./components/MenuPage'));
const ForgotPasswordPage = lazy(() => import('./components/ForgotPasswordPage'));
const CompanyDataPage = lazy(() => import('./components/CompanyDataPage'));
const RegisterVisitPage = lazy(() => import('./components/RegisterVisitPage'));


function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/company-data/:companyId" element={<CompanyDataPage />} />
          <Route path="/company-data" element={<CompanyDataPage />} />
          <Route path="/visit" element={<RegisterVisitPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;