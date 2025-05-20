import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/App.css";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";

const LoadingSpinner = lazy(() => import("./components/LoadingSpinner")); 
const SigninPage = lazy(() => import("./components/LoginPage"));
const SearchPage = lazy(() => import("./components/SearchPage"));
const ForgotPasswordPage = lazy(() => import("./components/ForgotPasswordPage"));
const CompanyDataPage = lazy(() => import("./components/CompanyDataPage")); 
const CompanyDetailsPage = lazy(() => import("./components/CompanyDetailsPage")); 
const RegisterVisitPage = lazy(() => import("./components/RegisterVisitPage"));
const TemplatePage = lazy(() => import("./components/Template"));

function App() {
  return (
    <Router>
      <ToastContainer/>
      <Suspense fallback={<LoadingSpinner />}>
        {" "}
        <Routes>
          <Route
            path="/login"
            element={
              <GuestRoute>
                <SigninPage />
              </GuestRoute>
            }
          />
          <Route
            path="/lembrar-senha"
            element={
              <GuestRoute>
                <ForgotPasswordPage />
              </GuestRoute>
            }
          />
          <Route
            path="/pesquisa"
            element={
              <ProtectedRoute>
                <SearchPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/menu/:companyId"
            element={
              <ProtectedRoute>
                <CompanyDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/documentos/:companyId"
            element={
              <ProtectedRoute>
                <CompanyDataPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/visita/:companyId"
            element={
              <ProtectedRoute>
                <RegisterVisitPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/visita"
            element={
              <ProtectedRoute>
                <RegisterVisitPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dados/:companyId/:section"
            element={
              <ProtectedRoute>
                <TemplatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              localStorage.getItem("userToken") ? (
                <Navigate to="/pesquisa" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="*"
            element={
              <Navigate
                to={localStorage.getItem("userToken") ? "/pesquisa" : "/login"}
                replace
              />
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
