import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/App.css';


const LoadingSpinner = lazy(() => import('./components/LoadingSpinner')); 


const SigninPage = lazy(() => import('./components/LoginPage'));
const SearchPage = lazy(() => import('./components/SearchPage'));
const ForgotPasswordPage = lazy(() => import('./components/ForgotPasswordPage'));
const CompanyDataPage = lazy(() => import('./components/CompanyDataPage'));
const CompanyDetailsPage = lazy(() => import('./components/CompanyDetailsPage'));
const RegisterVisitPage = lazy(() => import('./components/RegisterVisitPage'));


function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/login" element={<SigninPage />} />
          <Route path="/menu" element={<SearchPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/company-details/:companyId" element={<CompanyDetailsPage />} />
          <Route path="/company-data/:companyId" element={<CompanyDataPage />} />
          <Route path="/register-visit/:companyId" element={<RegisterVisitPage />} />
          <Route path="/register-visit" element={<RegisterVisitPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;