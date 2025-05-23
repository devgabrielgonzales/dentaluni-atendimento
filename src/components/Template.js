import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/RegisterVisitPage.css";

import {
  FaUserCircle,
  FaHome,
  FaSearch,
  FaSignOutAlt,
  FaBuilding,
} from "react-icons/fa";

import LoadingSpinner from "./LoadingSpinner";
import Ticket from "./Ticket";
import CompanyDataDisplay from "./CompanyDataDisplay";
import CompanyContacts from "./CompanyContacts";
import ProtocolsList from "./ProtocolsList";
import RequestNewPassword from "./RequestNewPassword";
import ConsultBeneficiary from "./ConsultBeneficiary";
import ConsultCoverage from "./ConsultCoverage";
import InvoicesList from "./ListInvoices";
import ConsultGuides from "./ConsultGuides";
import AppHeader from "./AppHeader";

const formatUserNameDisplay = (fullName) => {
  if (!fullName || typeof fullName !== "string") return "Usuário";
  let mainNamePart = fullName;
  const separatorIndex = fullName.indexOf(" - ");
  if (separatorIndex !== -1) {
    mainNamePart = fullName.substring(0, separatorIndex);
  }
  const nameParts = mainNamePart
    .trim()
    .split(/\s+/)
    .filter((part) => part.length > 0);
  if (nameParts.length === 0) return "Usuário";
  const firstName =
    nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1).toLowerCase();
  if (nameParts.length > 1) {
    const lastName =
      nameParts[nameParts.length - 1].charAt(0).toUpperCase() +
      nameParts[nameParts.length - 1].slice(1).toLowerCase();
    return `${firstName} ${lastName}`;
  }
  return firstName;
};

const toTitleCase = (str) => {
  if (!str || typeof str !== "string") return "";
  const articles = ["de", "do", "da", "dos", "das", "e", "a", "o", "um", "uma"];
  return str
    .toLowerCase()
    .split(" ")
    .map((word, index) => {
      if (word.length > 1 && word === word.toUpperCase()) return word;
      if (index > 0 && articles.includes(word.toLowerCase()))
        return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

const formatCNPJ = (digitsOnly) => {
  if (!digitsOnly || typeof digitsOnly !== "string") return "N/A";
  const cleaned = digitsOnly.replace(/\D/g, "");
  if (cleaned.length !== 14) return digitsOnly;
  return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(
    5,
    8
  )}/${cleaned.slice(8, 12)}-${cleaned.slice(12, 14)}`;
};

// Configuração das seções (sem ícones de título, conforme último ajuste)
const sectionConfig = {
  boletos: { title: "Boletos em aberto" },
  planos: { title: "Planos da Empresa" },
  consultar: { title: "Consultar Beneficiários" },
  reajustes: { title: "Reajustes" },
  contatos: { title: "Contatos" },
  contrato: { title: "Contrato" },
  empresa: { title: "Dados da Empresa" },
  cobertura: { title: "Cobertura" },
  guias: { title: "Guias" },
  faturamento: { title: "Notas Fiscais" },
  protocolos: { title: "Protocolos" },
  senha: { title: "Nova Senha" },
  default: { title: "Detalhes" },
};


const PlansSection = ({ companyId, companyData }) => (
  <div>
    <p>Conteúdo de Planos para {companyData?.razao_social || companyId}.</p>
  </div>
);

const TemplatePage = () => {
  const { companyId, section } = useParams();
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState(null);
  const [userName, setUserName] = useState("Usuário");
  const [userAvatarUrl, setUserAvatarUrl] = useState(null);
  const [isLoadingCompany, setIsLoadingCompany] = useState(true);
  const [errorLoadingCompany, setErrorLoadingCompany] = useState(null);

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    setUserName(formatUserNameDisplay(storedUserName));
    setUserAvatarUrl(localStorage.getItem("userImg"));

    setIsLoadingCompany(true);
    setErrorLoadingCompany(null);
    setCompanyData(null);

    if (!companyId) {
      setErrorLoadingCompany("ID da empresa não fornecido.");
      setIsLoadingCompany(false);
      return;
    }

    try {
      const localStorageKey = "selectedCompanyId";
      const companyDataString = localStorage.getItem(localStorageKey);

      if (companyDataString) {
        const parsedData = JSON.parse(companyDataString);
        setCompanyData(parsedData);
      } else {
        console.warn(
          `Dados para a empresa ${companyId} não encontrados no localStorage com a chave: ${localStorageKey}`
        );
        setErrorLoadingCompany(
          `Dados da empresa ${companyId} não encontrados localmente.`
        );
        setCompanyData(null);
      }
    } catch (e) {
      console.error(
        "Erro ao ler ou parsear dados da empresa do localStorage:",
        e
      );
      setErrorLoadingCompany(
        "Erro ao processar dados locais da empresa. Verifique o formato JSON no localStorage."
      );
      setCompanyData(null);
    } finally {
      setIsLoadingCompany(false);
    }
  }, [companyId]);

  const handleNavigateToCompanyOptionsMenu = () =>
    navigate(`/documentos/${companyId}`);
  const handleSearchClick = () => navigate("/pesquisa");
  const handleLogoutClick = () => {
    localStorage.clear();
    navigate("/login");
  };
  const handleGoBack = () => navigate(`/documentos/${companyId}`);

  const currentSectionKey = section?.toLowerCase();
  const currentConfig =
    sectionConfig[currentSectionKey] || sectionConfig.default;
  const pageTitle = currentConfig.title;

  const renderSectionComponent = () => {
    if (isLoadingCompany) {
      return <LoadingSpinner />;
    }
    if (errorLoadingCompany) {
      return (
        <div
          className="ticket-message ticket-error"
          style={{ marginTop: "20px" }}
        >
          ⚠️ {errorLoadingCompany}
        </div>
      );
    }
    if (!companyData) {
      return (
        <div
          className="ticket-message ticket-no-data"
          style={{ marginTop: "20px" }}
        >
          Não foi possível carregar os dados da empresa localmente.
        </div>
      );
    }

    const sectionProps = { companyId, companyData };

    switch (currentSectionKey) {
      case "boletos":
        return <Ticket {...sectionProps} />;
      case "empresa":
        return <CompanyDataDisplay companyDetails={companyData} />; 
      case "protocolos":
        return <ProtocolsList companyId={companyId} />; 
      case "senha":
        return <RequestNewPassword {...sectionProps} />;
      case "consultar":
        return <ConsultBeneficiary {...sectionProps} />;
      case "cobertura":
        return <ConsultCoverage {...sectionProps} />; 
      case "faturamento":
        return <InvoicesList companyId={companyId} />; 
      case "contatos":
        return <CompanyContacts companyId={companyId} />;
      case "planos":
        return <PlansSection {...sectionProps} />;
        case "guias": 
      return <ConsultGuides companyId={companyId}/>;
      default:
        return (
          <div
            className="ticket-message ticket-no-data"
            style={{ marginTop: "20px" }}
          >
            <p>Conteúdo para "{pageTitle}" ainda não implementado.</p>
            <Link to={`/documentos/${companyId}`}>Escolher outra opção</Link>
          </div>
        );
    }
  };

  if (isLoadingCompany) {
    return (
      <div className="details-page-layout-v2">
        <AppHeader
          userName={userName}
          userAvatarUrl={userAvatarUrl}
          companyData={null}
          formatCNPJ={formatCNPJ}
          toTitleCase={toTitleCase}
        />
        <div
          className="section-spinner-container"
          style={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LoadingSpinner />
        </div>
        <motion.footer
          className="new-bottom-menu"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <button
            className="menu-item"
            onClick={handleNavigateToCompanyOptionsMenu}
            aria-label="Opções da Empresa"
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
  }

  if (errorLoadingCompany || (!companyData && !isLoadingCompany && companyId)) {
    return (
      <div className="details-page-layout-v2">
        <AppHeader
          userName={userName}
          userAvatarUrl={userAvatarUrl}
          companyData={null} 
          formatCNPJ={formatCNPJ}
          toTitleCase={toTitleCase}
        />
        <div className="error-message-fullscreen">
          <p>
            {errorLoadingCompany ||
              `Informações da empresa (${companyId}) não encontradas localmente.`}
          </p>
          <Link to="/pesquisa" className="button-secondary">
            Voltar para a busca
          </Link>
        </div>
        <motion.footer
          className="new-bottom-menu"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <button
            className="menu-item"
            onClick={handleNavigateToCompanyOptionsMenu}
            aria-label="Opções da Empresa"
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
  }

  return (
    <div className="details-page-layout-v2">
      <AppHeader
        userName={userName}
        userAvatarUrl={userAvatarUrl}
        companyData={companyData}
        formatCNPJ={formatCNPJ}
        toTitleCase={toTitleCase}
      />

      <motion.main
        className="new-menu-content-area menu-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="template-content-card">
          <div className="template-dynamic-content">
            {renderSectionComponent()}
          </div>
            <button
              type="button"
              onClick={handleGoBack}
              className="button-secondary template-back-button"
            >
              Voltar
            </button>
        </div>
      </motion.main>

      <motion.footer
        className="new-bottom-menu"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <button
          className="menu-item"
          onClick={handleNavigateToCompanyOptionsMenu}
          aria-label="Opções da Empresa"
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

export default TemplatePage;
