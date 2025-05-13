import React from "react";

import { useParams, useNavigate } from "react-router-dom";
import {
  FaListAlt,
  FaUsers,
  FaChartLine,
  FaUserTie,
  FaAddressBook,
  FaFileContract,
  FaBuilding,
  FaShieldAlt,
  FaFileInvoice,
  FaReceipt,
  FaClipboardList,
  FaUserCircle,
  FaHome,
  FaSearch,
  FaSignOutAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";
import "../styles/CompanyDataPage.css";

const COMPANY_ID = "99999";

export const useAppNavigation = () => {
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate("/company-details/101");
  };

  const navigateToSearch = () => {
    navigate("/menu");
  };

  const navigateToLogin = () => {
    navigate("/login");
  };

  return {
    navigateToHome,
    navigateToSearch,
    navigateToLogin,
  };
};

const CompanyDataPage = () => {
  const { navigateToHome, navigateToSearch, navigateToLogin } =
    useAppNavigation();

  const handleOptionClick = (optionLabel, action) => {
    console.log(
      `Option clicked: ${optionLabel} (Action: ${action}) for Company ${COMPANY_ID}`
    );
    alert(`Opção: ${optionLabel}`);
  };

  const options = [
    { label: "Planos", icon: FaListAlt, action: "plans" },
    { label: "Consultar Benefícios", icon: FaUsers, action: "beneficiaries" },
    { label: "Reajustes", icon: FaChartLine, action: "readjustments" },
    { label: "Vendedores", icon: FaUserTie, action: "sellers" },
    { label: "Contatos", icon: FaAddressBook, action: "contacts" },
    { label: "Contrato", icon: FaFileContract, action: "contract" },
    { label: "Empresa", icon: FaBuilding, action: "company_info" },
    { label: "Cobertura", icon: FaShieldAlt, action: "coverage" },
    { label: "Guias", icon: FaFileInvoice, action: "guides" },
    { label: "Faturamento", icon: FaReceipt, action: "billing" },
    { label: "Protocolos", icon: FaClipboardList, action: "protocols" },
  ];

  options.sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));

  return (
    <div className="details-page-layout-v2">
      <div className="container">
        <header className="details-header-curved">
          <div className="user-info-container">
            <FaUserCircle className="user-avatar-icon-v2" />
            <div className="user-text-info">
              {/* Usar motion.p para animação */}
              <motion.p
                className="user-welcome-text-v2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
              >
                Olá, Bem-vindo! 👋
              </motion.p>
              {/* Usar motion.h1 para animação */}
              <motion.h1
                className="user-name-text-v2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
              >
                Gabriel Gonzales
              </motion.h1>
            </div>
          </div>
        </header>
      </div>

      <main className="content-area">
        <div className="options-grid">
          {options.map((option) => (
            <button
              key={option.action}
              type="button"
              className="option-button"
              onClick={() => handleOptionClick(option.label, option.action)}
            >
              <option.icon className="option-icon" />
              <span className="option-label">{option.label}</span>
            </button>
          ))}
          {options.length % 2 !== 0 && (
            <div className="option-placeholder"></div>
          )}
        </div>
      </main>

      {/* Usar motion.footer para animação */}
      <motion.footer
        className="new-bottom-menu"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="container">
          <button
            className="menu-item"
            onClick={navigateToHome}
            aria-label="Início"
          >
            <FaHome />
          </button>
          <button
            className="menu-item-principal"
            onClick={navigateToSearch}
            aria-label="Pesquisar Empresa"
          >
            <FaSearch />
          </button>
          <button
            className="menu-item"
            onClick={navigateToLogin}
            aria-label="Sair"
          >
            <FaSignOutAlt />
          </button>
        </div>
      </motion.footer>
    </div>
  );
};

export default CompanyDataPage;
