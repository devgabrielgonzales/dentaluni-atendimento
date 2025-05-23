import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LuFileSearch } from "react-icons/lu";
import {
  FaSearch,
  FaCalendarAlt,
  FaInfoCircle,
  FaUserMd,
  FaNotesMedical,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "../styles/RegisterVisitPage.css";

const requestHeaders = {
  "client-id": "26",
  "client-token": "cb93f445a9426532143cd0f3c7866421",
  Accept: "application/json",
  "Content-Type": "application/json",
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
  const [isLoading, setIsLoading] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);

  const handleSearchGuides = async (e) => {
    e.preventDefault();
    const cleanedCardNumber = cardNumber.replace(/\D/g, "");
    setSearchAttempted(true);
    if (!cleanedCardNumber) {
      toast.warn("Por favor, insira um número de cartão válido.");
      setGuides([]);
      return;
    }
    setIsLoading(true);
    setGuides([]);
    const apiUrl = `https://api.dentaluni.com.br/beneficiario/guias`;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: requestHeaders,
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
      setIsLoading(false);
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
            <FaNotesMedical style={{ marginRight: "8px" }} /> Consultar Guias
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
            className="form-actions"
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
              disabled={isLoading || !cardNumber.trim()}
            >
              {isLoading ? (
                <>
                  <FaSearch style={{ marginRight: "8px" }} /> Buscando Guias...
                </>
              ) : (
                <>
                  <FaSearch style={{ marginRight: "8px" }} /> Buscar Guias
                </>
              )}
            </button>
          </div>
        </fieldset>
      </form>

      {!isLoading && searchAttempted && guides.length === 0 && (
        <div
          className="list-message list-no-data"
          style={{ marginTop: "20px" }}
        >
          Nenhuma guia encontrada para o cartão informado.
        </div>
      )}

      {guides.length > 0 && !isLoading && (
        <div className="list-cards-container" style={{ marginTop: "25px" }}>
          {guides.map((guia, index) => {
            const statusText = guia.a221_desc_status_orc;
            const statusSigla = guia.a221_status_orc;

            return (
              <motion.div
                key={guia.a026_num_formulario || index}
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
                            ? "#ac1815"
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
