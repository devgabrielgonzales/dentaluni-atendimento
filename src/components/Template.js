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
import ProtocolsList from "./ProtocolsList";
import RequestNewPassword from "./RequestNewPassword";
import AppHeader from "./AppHeader";

const PlansSection = ({ companyId, companyData }) => (
  <div>
    <p>Conteúdo de Planos para {companyData?.razao_social || companyId}.</p>
  </div>
);

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
  faturamento: { title: "Faturamento" },
  protocolos: { title: "Protocolos" },
  senha: { title: "Nova Senha" },
  default: { title: "Detalhes" },
};

const TemplatePage = () => {
  const { companyId, section } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [companyData, setCompanyData] = useState(null);
  const [userName, setUserName] = useState("Usuário");
  const [userAvatarUrl, setUserAvatarUrl] = useState(null);
  const [isLoadingCompany, setIsLoadingCompany] = useState(true);
  const [errorLoadingCompany, setErrorLoadingCompany] = useState(null);

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    setUserName(formatUserNameDisplay(storedUserName));
    setUserAvatarUrl(localStorage.getItem("userImg"));
    let isMounted = true;
    setIsLoadingCompany(true);
    setErrorLoadingCompany(null);
    setCompanyData(null);

    const requestHeaders = {
      "client-id": "26",
      "client-token": "cb93f445a9426532143cd0f3c7866421",
      Accept: "application/json",
    };

    const fetchCompanyData = async () => {
      if (!companyId) {
        if (isMounted) {
          setIsLoadingCompany(false);
          setErrorLoadingCompany("ID da empresa não fornecido.");
        }
        return;
      }
      try {
        const response = await fetch(
          `https://api.dentaluni.com.br/sae/empresa?codigo=${companyId}`,
          {
            method: "GET",
            headers: requestHeaders,
          }
        );
        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ msg: "Erro de rede ou formato inválido." }));
          throw new Error(
            errorData?.msg || `HTTP error! status: ${response.status}`
          );
        }
        const data = await response.json();
        if (isMounted) {
          if (!data.error && data.empresas && data.empresas.length > 0) {
            setCompanyData(data.empresas[0]);
          } else {
            setErrorLoadingCompany(
              data.msg || "Dados da empresa não encontrados."
            );
            setCompanyData(null);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados da empresa:", error);
        if (isMounted) setErrorLoadingCompany(error.message);
        if (isMounted) setCompanyData(null);
      } finally {
        if (isMounted) setIsLoadingCompany(false);
      }
    };
    fetchCompanyData();
    return () => {
      isMounted = false;
    };
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
    if (errorLoadingCompany) {
      return (
        <div className="ticket-message ticket-error">
          ⚠️ {errorLoadingCompany}
        </div>
      );
    }
    if (!companyData) {
      return (
        <div className="ticket-message ticket-no-data">
          Detalhes da empresa não disponíveis no momento.
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
        return <ProtocolsList {...sectionProps} />;
      case "senha":
      return <RequestNewPassword {...sectionProps}/>;
      default:
        return (
          <div className="ticket-message ticket-no-data">
            <p>Conteúdo para "{pageTitle}" ainda não implementado.</p>
            <Link to={`/documentos/${companyId}`}>Escolher outra opção</Link>
          </div>
        );
    }
  };

  if (isLoadingCompany) {
    return <LoadingSpinner />;
  }

  if (errorLoadingCompany && !isLoadingCompany) {
    return (
      <div className="details-page-layout-v2">
        <AppHeader
          userName={userName}
          userAvatarUrl={userAvatarUrl}
          companyData={null}
        />
        <div className="error-message-fullscreen">
          <p>Erro ao carregar dados da empresa: {errorLoadingCompany}</p>
          <Link to="/pesquisa" className="button-secondary">
            Voltar para a busca
          </Link>
        </div>
      </div>
    );
  }

  if (!companyData && !isLoadingCompany && companyId) {
    return (
      <div className="details-page-layout-v2">
        <AppHeader
          userName={userName}
          userAvatarUrl={userAvatarUrl}
          companyData={null}
        />
        <div className="error-message-fullscreen">
          <p>
            Informações da empresa ({companyId}) não puderam ser carregadas ou
            não foram encontradas.
          </p>
          <Link to="/pesquisa" className="button-secondary">
            Voltar para a busca
          </Link>
        </div>
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
          <div className="template-title-container">
            <h2 className="template-section-title">{pageTitle}</h2>
          </div>
          <div className="template-dynamic-content">
            {renderSectionComponent()}
          </div>
          {!errorLoadingCompany && companyData && (
            <button
              type="button"
              onClick={handleGoBack}
              className="button-secondary template-back-button"
            >
              Voltar
            </button>
          )}
        </div>

        {errorLoadingCompany && (
          <button
            type="button"
            onClick={() => navigate("/pesquisa")}
            className="button-secondary template-back-button"
          >
            Voltar para Pesquisa
          </button>
        )}
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
