import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/CompanyDetailsPage.css";
import { FaUserCircle, FaHome, FaSearch, FaSignOutAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import ImagemAgendarVisita from "../img/visita.png";
import ImagemDadosEmpresa from "../img/dados.png";

const mockCompanies = [
  { id: "101", nome: "Dental Uni Matriz" },
  { id: "102", nome: "Clínica Sorriso Perfeito" },
];

const CompanyDetailsPage = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [userName, setUserName] = useState("Gabriel Gonzales");

  useEffect(() => {
    const company = mockCompanies.find((c) => c.id === companyId);
    if (company) {
      setCompanyName(company.nome);
    } else {
      setCompanyName("Empresa não encontrada");
    }
  }, [companyId]);

  const handleNavigateToRegisterVisit = () => {
    navigate(`/visit`);
  };

  const handleNavigateToCompanyDataGrid = () => {
    navigate(`/company-data/${companyId}`);
  };

  const handleHomeClick = () => {
    navigate("/company-details");
  };
  const handleSearchClick = () => {
    navigate("/menu");
  };
  const handleLogoutClick = () => {
    navigate("/login");
  };

  return (
    <div className="details-page-layout-v2">
      {" "}
      {/* Fundo da página é cinza claro aqui */}
      <header className="details-header-curved">
        {" "}
        {/* Header vermelho com curva */}
        <div className="user-info-container">
          <FaUserCircle className="user-avatar-icon-v2" />
          <div className="user-text-info">
            <motion.p
              className="user-welcome-text-v2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
            >
              Olá, Bem-vindo! 👋
            </motion.p>
            <motion.h1
              className="user-name-text-v2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            >
              {userName}
            </motion.h1>
          </div>
        </div>
        <div className="company-name-banner-v2">
          <h2>{companyName}</h2>
        </div>
      </header>
      <motion.main
        className="details-content-cards"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3, ease: "easeOut" }}
      >
        {" "}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3, ease: "easeOut" }}
          className="action-card-with-image"
          onClick={handleNavigateToRegisterVisit}
          role="button"
          tabIndex={0}
          onKeyPress={(e) =>
            e.key === "Enter" && handleNavigateToRegisterVisit()
          }
        >
          <img
            src={ImagemAgendarVisita}
            alt="Agendar Visita"
            className="card-image"
          />
          <span className="card-text">Agendar Visita</span>
        </motion.div>
        {/* Card "Dados da Empresa" com Imagem */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3, ease: "easeOut" }}
          className="action-card-with-image"
          onClick={handleNavigateToCompanyDataGrid}
          role="button"
          tabIndex={0}
          onKeyPress={(e) =>
            e.key === "Enter" && handleNavigateToCompanyDataGrid()
          }
        >
          <img
            src={ImagemDadosEmpresa}
            alt="Dados da Empresa"
            className="card-image"
          />
          <span className="card-text">Dados da Empresa</span>
        </motion.div>
      </motion.main>
      <motion.footer
        className="new-bottom-menu"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
      >
        <button
          className="menu-item"
          onClick={handleHomeClick}
          aria-label="Início"
        >
          <FaHome />
        </button>
        <button
          className="menu-item-principal"
          onClick={handleSearchClick}
          aria-label="Pesquisar Empresa"
        >
          <FaSearch />
        </button>
        <button
          className="menu-item"
          onClick={handleLogoutClick}
          aria-label="Sair"
        >
          <FaSignOutAlt />
        </button>
      </motion.footer>
    </div>
  );
};

export default CompanyDetailsPage;
