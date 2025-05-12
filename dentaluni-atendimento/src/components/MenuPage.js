import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MenuPage.css";
import Logo from "../img/logo.png";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const mockCompanies = [
  { id: "101", nome: "Dental Uni Matriz", cnpj: "01.234.567/0001-01" },
  { id: "102", nome: "Clínica Sorriso Perfeito", cnpj: "02.345.678/0001-02" },
  // ...
];

const MenuPage = () => {
  const [codEmpresa, setCodEmpresa] = useState(""); // Armazena apenas os dígitos
  const [displayValue, setDisplayValue] = useState(""); // Para o valor que vai no input
  const [isSearched, setIsSearched] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  // Função formatCNPJ (será usada para lógica interna, não para o display do input type="number")
  const formatCNPJForLogic = (digitsOnly) => {
    if (digitsOnly.length <= 7) return digitsOnly;
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
    // Para input type="number", o navegador já tenta manter apenas números.
    // Mas para garantir e limpar (caso algo não numérico passe), podemos fazer:
    const digitsOnly = rawValue.replace(/\D/g, "");

    // Limitar o número de dígitos (código até 7, CNPJ 14)
    let valueToSet = digitsOnly;
    if (digitsOnly.length > 7 && digitsOnly.length <= 14) {
      // Não aplicamos formatação visual para type="number"
      valueToSet = digitsOnly.slice(0, 14);
    } else if (digitsOnly.length > 14) {
      valueToSet = digitsOnly.slice(0, 14);
    } else if (digitsOnly.length > 7) {
      // Se for maior que 7 mas não CNPJ completo
      valueToSet = digitsOnly.slice(0, 7); // Ou alguma outra lógica
    }

    setCodEmpresa(valueToSet); // Salva apenas os dígitos (ou o código simples)
    setDisplayValue(valueToSet); // O que o input type="number" vai mostrar (só números)
  };

  const handleSearch = () => {
    if (!codEmpresa) {
      // codEmpresa agora contém apenas dígitos
      toast.warn("Por favor, informe o Código ou CNPJ da Empresa.");
      return;
    }

    // A busca pode usar codEmpresa diretamente, pois já são só dígitos
    const results = mockCompanies.filter(
      (company) =>
        company.id.includes(codEmpresa) ||
        company.cnpj.replace(/\D/g, "").includes(codEmpresa) ||
        company.nome.toLowerCase().includes(codEmpresa.toLowerCase())
    );
    setSearchResults(
      results.length > 0
        ? results
        : [{ id: "notfound", nome: "Nenhuma empresa encontrada.", cnpj: "" }]
    );
    setIsSearched(true);
  };

  const handleSelectCompany = (companyId) => {
    if (companyId === "notfound") return;
    const url = `/company-details/${companyId}`;
    navigate(url);
  };

  const resultsCardVariants = {
    /* ... (como antes) ... */
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
          /* ... */ src={Logo}
          alt="Logo DentalUni"
          className="menu-logo"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
        />
        <motion.h2
          /* ... */ className="menu-prompt-text"
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
        <motion.input
          type="number" // MUDADO PARA NUMBER
          className="menu-search-input"
          value={displayValue} // Mostra apenas os dígitos no campo
          onChange={handleChangeCodEmpresa}
          placeholder="Código ou CNPJ (só números)" // Placeholder ajustado
          // maxLength não funciona bem com type="number" para controlar dígitos visuais
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        />
        <motion.button
          /* ... */ type="button"
          className="menu-search-button"
          onClick={handleSearch}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
        >
          Pesquisar
        </motion.button>
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
            {/* ... (lista de resultados como antes) ... */}
            {searchResults.length > 0 ? (
              <ul className="company-list">
                {" "}
                {searchResults.map((company) => (
                  <li
                    key={company.id}
                    className={`company-list-item ${
                      company.id === "notfound" ? "not-found" : ""
                    }`}
                    onClick={() =>
                      company.id !== "notfound" &&
                      handleSelectCompany(company.id)
                    }
                  >
                    {" "}
                    <strong>{company.nome}</strong>{" "}
                    {company.id !== "notfound" && (
                      <small>
                        {" "}
                        (CNPJ: {company.cnpj} / Cód: {company.id}){" "}
                      </small>
                    )}{" "}
                  </li>
                ))}{" "}
              </ul>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuPage;
