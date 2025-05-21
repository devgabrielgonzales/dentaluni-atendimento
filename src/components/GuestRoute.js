import React from "react";
import { Navigate } from "react-router-dom";

const GuestRoute = ({ children }) => {
  const userToken = localStorage.getItem("userToken");
  const lastCompanyId = localStorage.getItem("lastCompanyId");

  if (userToken) {
    if (lastCompanyId) {
      return <Navigate to={`/menu/${lastCompanyId}`} replace />;
    } else {
      return <Navigate to="/pesquisa" replace />;
    }
  }

  return children;
};

export default GuestRoute;
