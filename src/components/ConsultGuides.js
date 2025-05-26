import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LuFileSearch } from "react-icons/lu";
import {
  FaSearch,
  FaNotesMedical,
  FaCalendarAlt,
  FaKey,
  FaExclamationTriangle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import '../styles/RegisterVisitPage.css';

const requestHeadersBase = {
  "client-id": "26",
  "client-token": "cb93f445a9426532143cd0f3c7866421",
  Accept: "application/json",
};

const formatDate = (dateString, includeTime = false) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString.replace(" ", "T"));
    if (isNaN(date.getTime())) return dateString;
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    if (includeTime) {
      options.hour = "2-digit";
      options.minute = "2-digit";
    }
    return date.toLocaleDateString("pt-BR", options);
  } catch (e) {
    return dateString;
  }
};

const hasContent = (value) => {
  return !(
    value === null ||
    value === undefined ||
    String(value).trim() === "" ||
    String(value).trim() === "-"
  );
};

const DataRow = ({ label, value }) => {
  if (!hasContent(value)) {
    return null;
  }
  return (
    <div className="data-row">
      <span className="data-label">{label}:</span>
      <span className="data-value">{String(value)}</span>
    </div>
  );
};

const ConsultGuides = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [guides, setGuides] = useState([]);
  const [isLoadingGuides, setIsLoadingGuides] = useState(false);
  const [isTokenLoading, setIsTokenLoading] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);

  const validateCardNumber = () => {
    const cleanedCardNumber = cardNumber.replace(/\D/g, "");
    if (!cleanedCardNumber) {
      toast.warn("Por favor, insira o número do cartão.");
      return false;
    }
    return cleanedCardNumber;
  };

  const handleSearchGuides = async (e) => {
    if (e) e.preventDefault();

    const cleanedCardNumber = validateCardNumber();
    if (!cleanedCardNumber) {
      setSearchAttempted(true);
      setGuides([]);
      return;
    }

    setSearchAttempted(true);
    setIsLoadingGuides(true);
    setGuides([]);
    const apiUrl = `https://api.dentaluni.com.br/beneficiario/guias`;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { ...requestHeadersBase, "Content-Type": "application/json" },
        body: JSON.stringify({ ncartao: cleanedCardNumber }),
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(
          data.msg || `Erro ao buscar guias (Status: ${response.status})`
        );
      }
      if (data.guias && Array.isArray(data.guias) && data.guias.length > 0) {
        const sortedGuides = data.guias.sort(
          (a, b) =>
            new Date(b.a034_dt_orcamento?.replace(" ", "T") || 0) -
            new Date(a.a034_dt_orcamento?.replace(" ", "T") || 0)
        );
        setGuides(sortedGuides);
        toast.success(
          `${data.qt_guias || sortedGuides.length} guia(s) encontrada(s)!`
        );
      } else {
        setGuides([]);
      }
    } catch (err) {
      console.error("Erro na busca por guias:", err);
      toast.error(err.message || "Falha ao buscar guias.");
      setGuides([]);
    } finally {
      setIsLoadingGuides(false);
    }
  };

  const handleRequestToken = async () => {
    const cleanedCardNumber = validateCardNumber();
    if (!cleanedCardNumber) {
      return;
    }

    setIsTokenLoading(true);
    const apiUrl = `https://api.dentaluni.com.br/beneficiario/gerar-token`;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { ...requestHeadersBase, "Content-Type": "application/json" },
        body: JSON.stringify({ cartao: cleanedCardNumber }),
      });
      const data = await response.json();
      if (!response.ok || data.erro || !data.status) {
        throw new Error(
          data.msg || `Erro ao gerar token (Status: ${response.status})`
        );
      }
      toast.success("Token gerado com sucesso!");
    } catch (err) {
      console.error("Erro ao gerar token:", err);
      toast.error(err.message || "Falha ao gerar token.");
    } finally {
      setIsTokenLoading(false);
    }
  };

  return (
    <div className="consult-guides-container">
      <form
        onSubmit={handleSearchGuides}
        className="visit-form"
        style={{ gap: "15px" }}
      >
        <fieldset className="form-section">
          <legend>
            <LuFileSearch style={{ marginRight: "8px" }} /> Consultar Guias
          </legend>
          <label htmlFor="cardNumberGuidesInput">
            Número do Cartão do Beneficiário:
            <input
              id="cardNumberGuidesInput"
              type="text"
              value={cardNumber}
              onChange={(e) => {
                setCardNumber(e.target.value.replace(/\D/g, ""));
                setSearchAttempted(false);
                setGuides([]);
              }}
              placeholder="Digite o número do cartão"
              className="detail-input"
            />
          </label>
          <div
            className="form-actions-group"
            style={{
              justifyContent: "center",
              marginTop: "20px",
              paddingTop: "10px",
              borderTop: "none",
            }}
          >
            <button
              type="submit"
              className="button-primary"
              disabled={isLoadingGuides || isTokenLoading}
              style={{ minWidth: "180px" }}
            >
              <FaSearch style={{ marginRight: "8px" }} />
              {isLoadingGuides ? "Buscando..." : "Buscar Guias"}
            </button>
            <button
              type="button"
              onClick={handleRequestToken}
              className="button-secondary"
              disabled={isLoadingGuides || isTokenLoading}
              style={{ minWidth: "180px" }}
            >
              <FaKey style={{ marginRight: "8px" }} />
              {isTokenLoading ? "Gerando..." : "Gerar Token"}
            </button>
          </div>
        </fieldset>
      </form>

      {!isLoadingGuides && searchAttempted && guides.length === 0 && (
        <div
          className="list-message list-no-data"
          style={{ marginTop: "20px" }}
        >
          Nenhuma guia encontrada para o cartão informado.
        </div>
      )}

      {guides.length > 0 && !isLoadingGuides && (
        <div className="list-cards-container" style={{ marginTop: "25px" }}>
          {guides.map((guia, index) => {
            const statusText = guia.a221_desc_status_orc;
            const statusSigla = guia.a221_status_orc;
            const uniqueKey = guia.rn
              ? `guia-rn-${guia.rn}-${guia.a026_num_formulario}`
              : `guia-idx-${index}-${guia.a026_num_formulario}`;

            return (
              <motion.div
                key={uniqueKey}
                className="info-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="info-card-details-area">
                  <p className="info-card-title">
                    Guia Nº: {guia.a026_num_formulario || "N/D"}
                  </p>
                  <p className="info-card-subtitle">
                    {guia.a012_nm_usuario || "Beneficiário não informado"}
                  </p>
                  <DataRow label="Cartão (Guia)" value={guia.nr_cartao} />
                  <DataRow
                    label="Data da Guia"
                    value={formatDate(guia.a034_dt_orcamento)}
                  />
                  <DataRow
                    label="Validade"
                    value={formatDate(guia.a034_dt_validade_orc)}
                  />
                  <DataRow label="Prestador" value={guia.a002_nm_pessoa} />
                </div>
                <div className="info-card-status-action-area">
                  {hasContent(statusText) && (
                    <span
                      className="info-card-status-badge"
                      style={{
                        backgroundColor:
                          statusSigla === "X"
                            ? "#E53935"
                            : statusSigla === "L" || statusSigla === "A"
                            ? "#4CAF50"
                            : "#757575",
                        color: "white",
                      }}
                    >
                      {statusText}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ConsultGuides;
