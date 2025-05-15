import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import "../styles/CompanyDetailsPage.css";
import {
  FaUserCircle,
  FaHome,
  FaSearch,
  FaSignOutAlt,
  FaBuilding,
} from "react-icons/fa";
import { motion } from "framer-motion";
import ImagemAgendarVisita from "../img/visita.png";
import ImagemDadosEmpresa from "../img/dados.png";
import LoadingSpinner from "./LoadingSpinner";

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

const CompanyDetailsPage = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [companyData, setCompanyData] = useState(null);
  const [userName, setUserName] = useState("Usuário");
  const [userAvatarUrl, setUserAvatarUrl] = useState(null);
  const [isLoadingCompany, setIsLoadingCompany] = useState(true);

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setUserName(formatUserNameDisplay(storedUserName));
    } else {
      setUserName(formatUserNameDisplay("Gabriel Gonzales"));
    }

    const storedUserImg = localStorage.getItem("userImg");
    if (storedUserImg && storedUserImg.trim() !== "") {
      setUserAvatarUrl(storedUserImg);
    } else {
      setUserAvatarUrl(null);
    }

    let isMounted = true;
    setIsLoadingCompany(true);

    const fetchCompanyData = async () => {
      let rawCompanyData = null;
      let errorFetching = false;

      if (location.state && location.state.companyData) {
        rawCompanyData = location.state.companyData;
      } else if (companyId) {
        console.warn(
          `Dados da empresa ${companyId} não passados via state. Buscando via API...`
        );
        try {
          const response = await fetch(
            `https://api.dentaluni.com.br/sae/empresa?codigo=${companyId}`
          );
          if (!response.ok) {
            errorFetching = true;
            console.error(`HTTP error! status: ${response.status}`);
          } else {
            const data = await response.json();
            if (isMounted) {
              if (
                data.error === false &&
                data.empresas &&
                data.empresas.length > 0
              ) {
                rawCompanyData = {
                  id: data.empresas[0].codigo,
                  nome: data.empresas[0].razao_social,
                  cnpj: data.empresas[0].cnpj,
                };
              } else {
                errorFetching = true;
                console.warn("API não retornou dados válidos:", data.msg);
              }
            }
          }
        } catch (error) {
          errorFetching = true;
          console.error("Erro ao buscar dados da empresa:", error);
        }
      }

      if (isMounted) {
        if (rawCompanyData && !errorFetching) {
          setCompanyData({
            ...rawCompanyData,
            nome: toTitleCase(rawCompanyData.nome || `Empresa ${companyId}`),
          });
        } else if (companyId) {
          setCompanyData({
            nome: toTitleCase(`Empresa ${companyId} (dados indisponíveis)`),
            id: companyId,
            cnpj: "N/A",
          });
        } else {
          setCompanyData({
            nome: "Nenhuma empresa especificada",
            id: null,
            cnpj: "N/A",
          });
        }
        setIsLoadingCompany(false);
      }
    };

    fetchCompanyData();

    return () => {
      isMounted = false;
    };
  }, [companyId, location.state]);

  const handleNavigateToRegisterVisit = () => {
    if (companyId) navigate(`/visita/${companyId}`);
  };

  const handleNavigateToCompanyDataGrid = () => {
    if (companyId) navigate(`/documentos/${companyId}`);
  };

  const handleHomeClick = () => {
    navigate(`/menu/${companyId}`);
  };
  const handleSearchClick = () => {
    navigate("/pesquisa");
  };
  const handleLogoutClick = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userToken");
    localStorage.removeItem("userImg");
    navigate("/login");
  };

  const headerAnimationProps = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: "easeOut" },
  };

  if (isLoadingCompany) {
    return <LoadingSpinner />;
  }

  if (!companyData || (!companyData.id && companyId)) {
    return (
      <div className="loading-details">
        Informações da empresa {companyId ? `(${companyId})` : ""} não puderam
        ser carregadas. <Link to="/pesquisa">Voltar para a busca</Link>
      </div>
    );
  }

  return (
    <div className="details-page-layout-v2">
      <header className="details-header-curved container">
        <div className="header-content-container">
          <div className="user-info-container container">
            {userAvatarUrl ? (
              <div className="circle">
                <img
                  src={userAvatarUrl}
                  alt="Avatar do Usuário"
                  className="circle-img"
                />
              </div>
            ) : (
              <FaUserCircle className="user-avatar-icon-v2" />
            )}
            <div className="user-text-info">
              <motion.p
                className="user-welcome-text-v2"
                {...headerAnimationProps}
                transition={{ ...headerAnimationProps.transition, delay: 0.2 }}
              >
                Olá, Bem-vindo! 👋
              </motion.p>
              <motion.h1
                className="user-name-text-v2"
                {...headerAnimationProps}
                transition={{ ...headerAnimationProps.transition, delay: 0.3 }}
              >
                {userName}
              </motion.h1>
            </div>
          </div>
          <motion.div
            className="company-display-card container"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          >
            <div className="company-text-info">
              <span className="company-label">
                {`Código: ${companyData.id || "N/A"} | CNPJ: ${formatCNPJ(
                  companyData.cnpj
                )}`}
              </span>
              <h2 className="company-name-text">{companyData.nome}</h2>
            </div>
            <FaBuilding className="icon-building" />
          </motion.div>
        </div>
      </header>

      <motion.main
        className="details-content-cards menu-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
      >
        <div
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
            alt="Registrar Visita"
            className="card-image"
          />
          <span className="card-text">Registrar Visita</span>
        </div>
        <div
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
        </div>
      </motion.main>

      <div className="container">
        <motion.footer
          className="new-bottom-menu"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6, ease: "easeOut" }}
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
    </div>
  );
};

export default CompanyDetailsPage;
