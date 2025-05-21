import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SearchPage.css";
import Logo from "../img/logo.png";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const SearchPage = () => {
  const [codEmpresa, setCodEmpresa] = useState("");
  const [isSearched, setIsSearched] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const formatCNPJ = (digitsOnly) => {
    if (!digitsOnly) return "";
    const limitedDigits = String(digitsOnly).replace(/\D/g, "").slice(0, 14);

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
    if (digitsOnly.length > 7 && digitsOnly.length <= 14) {
      setCodEmpresa(formatCNPJ(digitsOnly));
    } else if (digitsOnly.length <= 7) {
      setCodEmpresa(digitsOnly);
    } else if (digitsOnly.length > 14) {
      setCodEmpresa(formatCNPJ(digitsOnly.slice(0, 14)));
    }
  };

  const performSearch = async () => {
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

    const requestHeaders = {
      "client-id": "26",
      "client-token": "cb93f445a9426532143cd0f3c7866421",
      Accept: "application/json",
    };

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: requestHeaders,
      });
      const data = await response.json();

      if (
        response.ok &&
        data.error === false &&
        data.empresas &&
        data.empresas.length > 0
      ) {
        const mappedResults = data.empresas.map((company) => ({
          id: company.codigo,
          nome: company.razao_social,
          cnpj: company.cnpj,
          logradouro: company.logradouro,
          numero: company.numero,
          bairro: company.bairro,
          cidade: company.cidade,
          uf: company.uf,
          cep: company.cep,
          email_fat: company.email_fat,
          email: company.email,
        }));

        const uniqueResults = mappedResults.filter(
          (company, index, self) =>
            index === self.findIndex((c) => c.id === company.id)
        );

        try {
          localStorage.setItem(
            "allSearchResults",
            JSON.stringify(uniqueResults)
          );
        } catch (error) {
          console.error(
            "Erro ao salvar todos os resultados da busca no localStorage:",
            error
          );
        }

        if (uniqueResults.length === 1) {
          const companyToSelect = uniqueResults[0];
          if (companyToSelect.id !== "notfound") {
            handleSelectCompany(companyToSelect);
            setIsLoading(false);
            return;
          } else {
            setSearchResults(uniqueResults);
            setIsSearched(true);
          }
        } else {
          setSearchResults(uniqueResults);
          setIsSearched(true);
        }
      } else if (
        data.error === false &&
        (!data.empresas || data.empresas.length === 0)
      ) {
        toast.info(
          data.msg || "Nenhuma empresa encontrada com esses critérios."
        );
        const noResults = [
          {
            id: "notfound",
            nome: data.msg || "Nenhuma empresa encontrada.",
            cnpj: "",
          },
        ];
        setSearchResults(noResults);
        try {
          localStorage.setItem("allSearchResults", JSON.stringify(noResults));
        } catch (error) {
          console.error(
            "Erro ao salvar 'nenhuma empresa encontrada' no localStorage:",
            error
          );
        }
        setIsSearched(true);
      } else {
        const errorMessage =
          data.msg ||
          `Erro ao buscar empresa: ${response.status} - ${
            response.statusText || "Erro desconhecido"
          }`;
        toast.error(errorMessage);
        const errorResult = [{ id: "notfound", nome: errorMessage, cnpj: "" }];
        setSearchResults(errorResult);
        try {
          localStorage.setItem("allSearchResults", JSON.stringify(errorResult));
        } catch (error) {
          console.error(
            "Erro ao salvar estado de erro da API no localStorage:",
            error
          );
        }
        setIsSearched(true);
      }
    } catch (error) {
      console.error("Erro de rede ou ao processar a busca:", error);
      if (error.name === "AbortError") {
        toast.warn("Busca cancelada.");
      } else {
        toast.error("Falha na comunicação com o servidor.");
      }
      const networkErrorResult = [
        {
          id: "notfound",
          nome: "Falha na busca. Verifique sua conexão.",
          cnpj: "",
        },
      ];
      setSearchResults(networkErrorResult);
      try {
        localStorage.setItem(
          "allSearchResults",
          JSON.stringify(networkErrorResult)
        );
      } catch (error) {
        console.error(
          "Erro ao salvar estado de erro de rede no localStorage:",
          error
        );
      }
      setIsSearched(true);
    }
    setIsLoading(false);
  };

  const handleSubmitSearch = (event) => {
    event.preventDefault();
    performSearch();
  };


  const handleSelectCompany = (company) => {
    if (company.id === "notfound") return;

    try {
      if (company.id) {
        localStorage.setItem("selectedCompanyId", company.id);
      } else {
        localStorage.removeItem("selectedCompanyId");
      }
      if (company.cnpj) {
        localStorage.setItem("selectedCompanyCnpj", company.cnpj);
      } else {
        localStorage.removeItem("selectedCompanyCnpj");
      }
      if (company.nome) {
        localStorage.setItem("selectedCompanyName", company.nome);
      } else {
        localStorage.removeItem("selectedCompanyName");
      }
      if (company.cep) {
        localStorage.setItem("selectedCompanyCep", company.cep);
      } else {
        localStorage.removeItem("selectedCompanyCep");
      }
      if (company.logradouro) {
        localStorage.setItem("selectedCompanyLogradouro", company.logradouro);
      } else {
        localStorage.removeItem("selectedCompanyLogradouro");
      }
      if (company.numero) {
        localStorage.setItem("selectedCompanyNumero", company.numero);
      } else {
        localStorage.removeItem("selectedCompanyNumero");
      }
      if (company.bairro) {
        localStorage.setItem("selectedCompanyBairro", company.bairro);
      } else {
        localStorage.removeItem("selectedCompanyBairro");
      }
      if (company.cidade) {
        localStorage.setItem("selectedCompanyCidade", company.cidade);
      } else {
        localStorage.removeItem("selectedCompanyCidade");
      }
      if (company.uf) {
        localStorage.setItem("selectedCompanyUf", company.uf);
      } else {
        localStorage.removeItem("selectedCompanyUf");
      }

    } catch (error) {
      console.error(
        "Erro ao salvar dados da empresa selecionada no localStorage:",
        error
      );
      toast.error(
        "Houve um problema ao salvar os dados da empresa. Tente novamente."
      );
    }

    navigate(`/menu/${company.id}`, {
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
                    key={company.id || company.cnpj || Math.random()}
                    className={`company-list-item ${
                      company.id === "notfound" ? "not-found" : ""
                    }`}
                    onClick={() =>
                      company.id !== "notfound" && handleSelectCompany(company)
                    }
                    role="button"
                    tabIndex={company.id !== "notfound" ? 0 : -1}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      company.id !== "notfound" &&
                      handleSelectCompany(company)
                    }
                  >
                    <strong>{company.nome}</strong>
                    {company.id !== "notfound" && (
                      <small>
                        {" "}
                        (CNPJ: {company.cnpj
                          ? formatCNPJ(company.cnpj)
                          : "N/A"}{" "}
                        / Cód: {company.id}){" "}
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

export default SearchPage;
