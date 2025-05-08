import React from "react";
import {
  FaUserCircle,
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
} from "react-icons/fa";
import "../styles/CompanyDataPage.css";

const COMPANY_ID = "99999";

const CompanyDataPage = () => {
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
    { label: "Faturamento", icon: FaReceipt, action: "billing" }, // Ajustado de Faturamento/Duplicatas
    { label: "Protocolos", icon: FaClipboardList, action: "protocols" },
  ];

  options.sort((a, b) => a.label.localeCompare(b.label, 'pt-BR'));

  return (
    <div className="new-menu-page">
      <header className="new-menu-banner-section">
        <div className="avatar-placeholder"></div>
        <div className="greeting-text">Dados da empresa</div>
        <div className="date-text">Empresa</div>
      </header>

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
    </div>
  );
};

export default CompanyDataPage;
