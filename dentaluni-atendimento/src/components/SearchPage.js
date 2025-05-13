import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SearchPage.css"; // Certifique-se que o caminho e nome do CSS estão corretos
import Logo from "../img/logo.png"; // Certifique-se que o caminho está correto
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

// const mockCompanies = [ /* ... SEU ARRAY MOCK COMENTADO OU REMOVIDO ... */ ];

const SearchPage = () => {
  // Ou MenuPage
  const [codEmpresa, setCodEmpresa] = useState("");
  const [isSearched, setIsSearched] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const formatCNPJ = (digitsOnly) => {
    if (digitsOnly.length <= 7) {
      return digitsOnly;
    }
    const limitedDigits = digitsOnly.slice(0, 14);
    if (limitedDigits.length <= 2) return limitedDigits;
    let formatted = `${limitedDigits.slice(0, 2)}`;
    if (limitedDigits.length > 2) formatted += `.${limitedDigits.slice(2, 5)}`;
    if (limitedDigits.length > 5) formatted += `.${limitedDigits.slice(5, 8)}`;
    if (limitedDigits.length > 8) formatted += `/${limitedDigits.slice(8, 12)}`;
    if (limitedDigits.length > 12)
      formatted += `-${limitedDigits.slice(12, 14)}`;
    return formatted;
  };

  const handleChangeCodEmpresa = (event) => {
    const rawValue = event.target.value;
    const digitsOnly = rawValue.replace(/\D/g, "");
    if (digitsOnly.length <= 7) {
      setCodEmpresa(digitsOnly);
    } else {
      const limitedDigitsForState = digitsOnly.slice(0, 14);
      setCodEmpresa(formatCNPJ(limitedDigitsForState));
    }
  };

  const performSearch = async () => {
    // Renomeado de handleSearch
    const valorInput = codEmpresa;
    const valorBuscaApenasDigitos = valorInput.replace(/\D/g, "");

    if (!valorBuscaApenasDigitos) {
      toast.warn("Por favor, informe o Código ou CNPJ da Empresa.");
      return;
    }

    setIsLoading(true);
    setIsSearched(false);
    setSearchResults([]);

    let apiUrl = "";
    if (valorBuscaApenasDigitos.length === 14) {
      apiUrl = `https://api.dentaluni.com.br/sae/empresa?cnpj=${valorBuscaApenasDigitos}`;
    } else {
      apiUrl = `https://api.dentaluni.com.br/sae/empresa?codigo=${valorBuscaApenasDigitos}`;
    }

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (
        response.ok &&
        data.error === false &&
        data.empresas &&
        data.empresas.length > 0
      ) {
        const formattedResults = data.empresas.map((company) => ({
          id: company.codigo,
          nome: company.razao_social,
          cnpj: company.cnpj,
        }));
        setSearchResults(formattedResults);
      } else if (
        data.error === false &&
        (!data.empresas || data.empresas.length === 0)
      ) {
        toast.info(
          data.msg || "Nenhuma empresa encontrada com esses critérios."
        );
        setSearchResults([
          {
            id: "notfound",
            nome: data.msg || "Nenhuma empresa encontrada.",
            cnpj: "",
          },
        ]);
      } else {
        const errorMessage =
          data.msg || `Erro ao buscar empresa: ${response.status}`;
        toast.error(errorMessage);
        setSearchResults([{ id: "notfound", nome: errorMessage, cnpj: "" }]);
      }
    } catch (error) {
      console.error("Erro de rede ou ao processar a busca:", error);
      toast.error("Falha na comunicação com o servidor.");
      setSearchResults([
        {
          id: "notfound",
          nome: "Falha na busca. Verifique sua conexão.",
          cnpj: "",
        },
      ]);
    }

    setIsLoading(false);
    setIsSearched(true);
  };

  const handleSubmitSearch = (event) => {
    event.preventDefault();
    performSearch();
  };

  const handleSelectCompany = (company) => {
    if (company.id === "notfound") return;
    navigate(`/company-details/${company.id}`, {
      state: { companyData: company },
    });
  };

  const resultsCardVariants = {
    hidden: { opacity: 0, y: "100%" },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: "100%",
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };

  const animationOffset = -30;
  const baseDuration = 0.5;
  const baseDelay = 0.1;

  return (
    <div
      className={`menu-page-fullscreen-gradient ${
        isSearched ? "results-active" : ""
      }`}
    >
      <div className="menu-search-area-wrapper">
        <motion.img
          src={Logo}
          alt="Logo DentalUni"
          className="menu-logo"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
        />
        <motion.h2
          className="menu-prompt-text"
          initial={{ opacity: 0, x: animationOffset }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: baseDuration,
            delay: baseDelay + 0.15,
            ease: "easeOut",
          }}
        >
          Qual é o código da empresa?
        </motion.h2>
        <form onSubmit={handleSubmitSearch} className="menu-search-form">
          <motion.input
            type="text"
            className="menu-search-input"
            value={codEmpresa}
            onChange={handleChangeCodEmpresa}
            placeholder="Código ou CNPJ"
            maxLength={18}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            disabled={isLoading}
          />
          <motion.button
            type="submit"
            className="menu-search-button"
            onClick={performSearch} // Mantido para clique explícito também
            disabled={isLoading}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          >
            {isLoading ? (
              <div className="button-spinner-menu"></div>
            ) : (
              "Pesquisar"
            )}
          </motion.button>
        </form>
      </div>

      <AnimatePresence>
        {isSearched && (
          <motion.div
            className="search-results-card-bottom"
            key="resultsCardBottom"
            variants={resultsCardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h3>Empresas Encontradas:</h3>
            {searchResults.length > 0 ? (
              <ul className="company-list">
                {searchResults.map((company) => (
                  <li
                    key={company.id || company.cnpj}
                    className={`company-list-item ${
                      company.id === "notfound" ? "not-found" : ""
                    }`}
                    onClick={() =>
                      company.id !== "notfound" && handleSelectCompany(company)
                    }
                  >
                    <strong>{company.nome}</strong>
                    {company.id !== "notfound" && (
                      <small>
                        {" "}
                        (CNPJ: {formatCNPJ(company.cnpj.replace(/\D/g, ""))} /
                        Cód: {company.id}){" "}
                      </small>
                    )}
                  </li>
                ))}
              </ul>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchPage; // Ou MenuPage, conforme o nome do seu arquivo
