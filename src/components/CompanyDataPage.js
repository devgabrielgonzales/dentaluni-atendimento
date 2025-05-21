import React from "react";
import { useNavigate, useParams } from "react-router-dom"; 
import { FaHome, FaSearch, FaSignOutAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import "../styles/CompanyDataPage.css"; 
import AppHeader from "./AppHeader"; 

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
  LuLockKeyholeOpen,
} from "react-icons/lu";

export const useCompanyDataNavigation = () => {
  const navigate = useNavigate();
  const { companyId } = useParams(); 

  const navigateToSection = (sectionAction) => {
    if (companyId && sectionAction) {
      navigate(`/dados/${companyId}/${sectionAction}`);
    } else {
      console.error(
        "Company ID ou Section Action não fornecidos para navegação."
      );
      navigate("/pesquisa"); 
    }
  };

  const navigateToHomeMenu = () => {
    if (companyId) {
      navigate(`/menu/${companyId}`);
    } else {
      navigate("/pesquisa");
    }
  };

  const navigateToSearch = () => {
    navigate("/pesquisa");
  };

  const navigateToLogin = () => {
    localStorage.clear();
    navigate("/login");
  };

  return {
    navigateToSection,
    navigateToHomeMenu,
    navigateToSearch,
    navigateToLogin,
  };
};

const CompanyDataPage = () => {
  const { companyId } = useParams();
  const {
    navigateToSection,
    navigateToHomeMenu,
    navigateToSearch,
    navigateToLogin,
  } = useCompanyDataNavigation();

  const handleOptionClick = (optionLabel, action) => {
    navigateToSection(action)
    console.log(optionLabel); 
    console.log(action)
  };

  const options = [
    { label: "Planos", icon: LuListCheck, action: "planos" },
    {
      label: "Consultar Beneficiários",
      icon: LuUserRoundSearch,
      action: "consultar",
    },
    { label: "Reajustes", icon: LuFileSliders, action: "reajustes" },
    { label: "Contatos", icon: LuContactRound, action: "contatos" },
    { label: "Contrato", icon: LuFilePenLine, action: "contrato" },
    { label: "Empresa", icon: LuBuilding2, action: "empresa" },
    { label: "Cobertura", icon: LuClipboardCheck, action: "cobertura" },
    { label: "Guias", icon: LuFileHeart, action: "guias" },
    { label: "Faturamento", icon: LuReceipt, action: "faturamento" },
    { label: "Protocolos", icon: LuFileSearch, action: "protocolos" },
    { label: "Boletos", icon: LuBarcode, action: "boletos" },
    { label: "Nova senha", icon: LuLockKeyholeOpen, action: "senha" },
  ];

  options.sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));

  return (
    <div className="details-page-layout-v2">
      {" "}
      <AppHeader />
      <main className="content-area menu-container">
        {" "}
        <div className="options-grid">
          {" "}
          {options.map((option) => (
            <button
              key={option.action}
              type="button"
              className="option-button" 
              onClick={() => handleOptionClick(option.label, option.action)}
            >
              <option.icon className="option-icon" />{" "}
              <span className="option-label">{option.label}</span>{" "}
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
          onClick={navigateToHomeMenu}
          aria-label="Menu Empresa"
        >
          <FaHome />{" "}
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
