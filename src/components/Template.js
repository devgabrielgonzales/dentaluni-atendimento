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
import AppHeader from "./AppHeader"; 

const PlansSection = ({ companyId, companyData }) => (
  <div>
    <p>Conteúdo de Planos para {companyData?.nome || companyId}.</p>
  </div>
);

const formatUserNameDisplay = (fullName) => {
  return fullName || "Usuário";
};
const toTitleCase = (str) => {
  return str || "";
};
const formatCNPJ = (digitsOnly) => {
  return digitsOnly || "N/A";
};

const sectionTitles = {
  ticket: "Boletos em aberto",
  plans: "Planos da Empresa",
  beneficiaries: "Consultar Beneficiários",
  readjustments: "Reajustes",
  contacts: "Contatos",
  contract: "Contrato",
  company_info: "Dados da Empresa",
  coverage: "Cobertura",
  guides: "Guias",
  billing: "Faturamento",
  protocols: "Protocolos",
  password: "Nova Senha",
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

    const fetchCompanyData = async () => {
      if (!companyId) {
        if (isMounted) {
          setIsLoadingCompany(false);
          setErrorLoadingCompany("ID da empresa não fornecido.");
        }
        return;
      }
      if (location.state && location.state.companyData) {
        if (isMounted) {
          setCompanyData({
            ...location.state.companyData,
            nome: toTitleCase(
              location.state.companyData.nome || `Empresa ${companyId}`
            ),
          });
          setIsLoadingCompany(false);
          return;
        }
      }
      try {
        const response = await fetch(
          `https://api.dentaluni.com.br/sae/empresa?codigo=${companyId}`
        );
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(
            errorData?.msg || `HTTP error! status: ${response.status}`
          );
        }
        const data = await response.json();
        if (isMounted) {
          if (!data.error && data.empresas && data.empresas.length > 0) {
            const rawCompany = data.empresas[0];
            setCompanyData({
              id: rawCompany.codigo,
              nome: toTitleCase(
                rawCompany.razao_social || `Empresa ${companyId}`
              ),
              cnpj: rawCompany.cnpj,
            });
          } else {
            setErrorLoadingCompany(
              data.msg || "Dados da empresa não encontrados."
            );
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados da empresa:", error);
        if (isMounted) setErrorLoadingCompany(error.message);
      } finally {
        if (isMounted) setIsLoadingCompany(false);
      }
    };
    fetchCompanyData();
    return () => {
      isMounted = false;
    };
  }, [companyId, location.state]);

  const handleNavigateToCompanyOptionsMenu = () =>
    navigate(`/documentos/${companyId}`);
  const handleSearchClick = () => navigate("/pesquisa");
  const handleLogoutClick = () => {
    localStorage.clear();
    navigate("/login");
  };
  const handleGoBack = () => navigate(`/documentos/${companyId}`);

  const pageTitle =
    sectionTitles[section?.toLowerCase()] || "Detalhes da Empresa";

  const renderSectionComponent = () => {
    if (isLoadingCompany && !companyData) return <LoadingSpinner />;
    if (!isLoadingCompany && errorLoadingCompany && !companyData)
      return <p>Erro ao carregar informações da empresa.</p>;
    if (!isLoadingCompany && !companyData && companyId)
      return <p>Empresa não encontrada.</p>;

    const sectionProps = { companyId, companyData };
    switch (section?.toLowerCase()) {
      case "ticket":
        return <Ticket {...sectionProps} />;
      case "plans":
        return <PlansSection {...sectionProps} />;
      default:
        return (
          <div>
            <p>Conteúdo para "{pageTitle}" ainda não implementado.</p>
            <Link to={`/documentos/${companyId}`}>Escolher outra opção</Link>
          </div>
        );
    }
  };

  if (isLoadingCompany && !location.state?.companyData)
    return <LoadingSpinner />;
  if (errorLoadingCompany && !companyData) {
  }
  if (companyId && !companyData && !isLoadingCompany) {
  }

  return (
    <div className="details-page-layout-v2">
      <AppHeader />

      <motion.main
        className="new-menu-content-area menu-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="template-content-card">
          {" "}
          <h2 className="template-section-title">{pageTitle}</h2>
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

      <motion.footer className="new-bottom-menu">
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
