import React from "react";

import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaSearch,
  FaSignOutAlt,
} from "react-icons/fa";
import {
  LuClipboardCheck,
  LuUserRoundSearch,
  LuContactRound,
  LuFilePenLine,
  LuBuilding2,
  LuReceipt,
  LuFileHeart,
  LuListCheck,
  LuFileSearch,
  LuFileSliders,
  LuBarcode,
  LuLockKeyholeOpen
} from "react-icons/lu";
import { motion } from "framer-motion";
import "../styles/CompanyDataPage.css";
import AppHeader from "./AppHeader";

const companyId = localStorage.getItem("selectedCompanyId")

export const useAppNavigation = () => {
  
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate(`/menu/${companyId}`);
  };


  const navigateToSearch = () => {
    navigate("/pesquisa");
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
      `Option clicked: ${optionLabel} (Action: ${action}) for Company ${companyId}`
    );
    alert(`Opção: ${optionLabel}`);
  };

  const options = [
    { label: "Planos", icon: LuListCheck, action: "plans" },
    {
      label: "Consultar Beneficiários",
      icon: LuUserRoundSearch,
      action: "beneficiaries",
    },
    { label: "Reajustes", icon: LuFileSliders, action: "readjustments" },
    { label: "Contatos", icon: LuContactRound, action: "contacts" },
    { label: "Contrato", icon: LuFilePenLine,  action: "contract" },
    { label: "Empresa", icon: LuBuilding2, action: "company_info" },
    { label: "Cobertura", icon: LuClipboardCheck, action: "coverage" },
    { label: "Guias", icon: LuFileHeart, action: "guides" },
    { label: "Faturamento", icon: LuReceipt, action: "billing" },
    { label: "Protocolos", icon: LuFileSearch, action: "protocols" },
    { label: "Boletos", icon: LuBarcode, action: "ticket" },
    { label: "Nova senha", icon: LuLockKeyholeOpen, action: "password" },
  ];

  options.sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));

  return (
    <div className="details-page-layout-v2">
      <AppHeader />
      <main className="content-area menu-container">
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

      <motion.footer
        className="new-bottom-menu"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
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
      </motion.footer>
    </div>
  );
};

export default CompanyDataPage;
