import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MenuPage.css"; // Certifique-se que o caminho está correto
import Logo from "../img/logo.png"; // Certifique-se que o caminho está correto
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify"; // 1. IMPORTE O TOAST

const mockCompanies = [
  { id: "101", nome: "Dental Uni Matriz", cnpj: "01.234.567/0001-01" },
  { id: "102", nome: "Clínica Sorriso Perfeito", cnpj: "02.345.678/0001-02" },
  { id: "103", nome: "Odonto Bem Estar", cnpj: "03.456.789/0001-03" },
  { id: "104", nome: "Saúde Bucal Completa", cnpj: "04.567.890/0001-04" },
  { id: "105", nome: "Dental Prime Associates", cnpj: "05.678.901/0001-05" },
  { id: "106", nome: "Orto Center Clínica", cnpj: "06.789.012/0001-06" },
  { id: "107", nome: "Implantes & Cia", cnpj: "07.890.123/0001-07" },
  {
    id: "108",
    nome: "Odontologia Integrada Smile",
    cnpj: "08.901.234/0001-08",
  },
  { id: "109", nome: "Clínica Dental Master", cnpj: "09.012.345/0001-09" },
  { id: "110", nome: "Espaço Odonto Feliz", cnpj: "10.123.456/0001-10" },
];

const MenuPage = () => {
  const [codEmpresa, setCodEmpresa] = useState("");
  const [isSearched, setIsSearched] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!codEmpresa) {
      // alert("Por favor, informe o Código ou CNPJ da Empresa."); // Removido
      toast.warn("Por favor, informe o Código ou CNPJ da Empresa."); // 2. ADICIONADO TOAST
      return;
    }
    const results = mockCompanies.filter(
      (company) =>
        company.id.includes(codEmpresa) ||
        company.nome.toLowerCase().includes(codEmpresa.toLowerCase()) ||
        company.cnpj.includes(codEmpresa)
    );
    setSearchResults(
      results.length > 0
        ? results
        : [{ id: "notfound", nome: "Nenhuma empresa encontrada.", cnpj: "" }]
    );
    setIsSearched(true);
    // A navegação ocorre ao clicar no item da lista
  };

  const handleSelectCompany = (companyId) => {
    if (companyId === "notfound") return;
    const url = `/company-details/${companyId}`;
    navigate(url);
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
        <motion.input
          type="text"
          className="menu-search-input"
          value={codEmpresa}
          onChange={(e) => setCodEmpresa(e.target.value)}
          placeholder="Código ou CNPJ"
          initial={{ opacity: 0, y: 20 }} // Mantido y para este, ajuste para x se preferir
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        />
        <motion.button
          type="button"
          className="menu-search-button"
          onClick={handleSearch}
          initial={{ opacity: 0, y: 20 }} // Mantido y para este, ajuste para x se preferir
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
            {searchResults.length > 0 ? (
              <ul className="company-list">
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
                    <strong>{company.nome}</strong>
                    {company.id !== "notfound" && (
                      <small>
                        {" "}
                        (CNPJ: {company.cnpj} / Cód: {company.id})
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

export default MenuPage;
