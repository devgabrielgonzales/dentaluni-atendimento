import React from "react";
import { Navigate } from "react-router-dom";

const GuestRoute = ({ children }) => {
  const userToken = localStorage.getItem("userToken");
  const lastCompanyId = localStorage.getItem("lastCompanyId");

  if (userToken) {
    if (lastCompanyId) {
      console.log(
        `Usuário logado, redirecionando para /menu/${lastCompanyId} a partir da rota de convidado.`
      );
      return <Navigate to={`/menu/${lastCompanyId}`} replace />;
    } else {
      console.log(
        "Usuário logado, mas sem lastCompanyId. Redirecionando para /pesquisa a partir da rota de convidado."
      );
      return <Navigate to="/pesquisa" replace />;
    }
  }

  return children;
};

export default GuestRoute;
