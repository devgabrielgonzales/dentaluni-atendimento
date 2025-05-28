import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { LuFileSearch } from "react-icons/lu";
import {
  FaSearch,
  FaNotesMedical,
  FaCalendarAlt,
  FaKey,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "../styles/RegisterVisitPage.css"

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

const hasContent = (value) =>
  !(
    value === null ||
    value === undefined ||
    String(value).trim() === "" ||
    String(value).trim() === "-"
  );

const DataRow = ({ label, value }) => {
  if (!hasContent(value)) return null;
  return (
    <div className="data-row">
      <span className="data-label">{label}:</span>
      <span className="data-value">{String(value)}</span>
    </div>
  );
};

DataRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const extractCompanyCodeFromCard = (cardNumberToValidate) => {
  const cleanedCardNumber = String(cardNumberToValidate).replace(/\D/g, "");
  if (!cleanedCardNumber.startsWith("002025")) {
    return {
      isValid: false,
      companyCodeFromCard: null,
      error: "Cartão deve iniciar com 002025.",
    };
  }
  const prefixLength = 6;
  const partAfterPrefix = cleanedCardNumber.substring(prefixLength);
  if (cleanedCardNumber.length <= 19) {
    if (partAfterPrefix.length >= 5 && /^\d{5}/.test(partAfterPrefix)) {
      if (
        (cleanedCardNumber.length === 18 && partAfterPrefix.length === 12) ||
        (cleanedCardNumber.length === 19 && partAfterPrefix.length === 13) ||
        (cleanedCardNumber.length >= prefixLength + 5 &&
          cleanedCardNumber.length < 18)
      ) {
        return {
          isValid: true,
          companyCodeFromCard: parseInt(
            partAfterPrefix.substring(0, 5),
            10
          ).toString(),
        };
      }
    }
  } else {
    if (partAfterPrefix.length >= 7 && /^\d{7}/.test(partAfterPrefix)) {
      return {
        isValid: true,
        companyCodeFromCard: parseInt(
          partAfterPrefix.substring(0, 7),
          10
        ).toString(),
      };
    }
  }
  return {
    isValid: false,
    companyCodeFromCard: null,
    error: "Formato do cartão inválido para os critérios de comprimento.",
  };
};

const ConsultGuides = ({ companyId }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [guides, setGuides] = useState([]);
  const [isLoadingGuides, setIsLoadingGuides] = useState(false);
  const [isTokenLoading, setIsTokenLoading] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);

  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [tokenModalMessage, setTokenModalMessage] = useState("");
  const [isTokenErrorInModal, setIsTokenErrorInModal] = useState(false);

  const validateCardAndCompany = (cardToValidate) => {
    const cleanedCardNumber = String(cardToValidate).replace(/\D/g, "");
    if (!cleanedCardNumber) {
      toast.warn("Por favor, insira o número do cartão.");
      return null;
    }
    const cardValidationResult = extractCompanyCodeFromCard(cleanedCardNumber);
    if (!cardValidationResult.isValid) {
      toast.warn(
        cardValidationResult.error || "Formato do número do cartão inválido."
      );
      return null;
    }
    if (cardValidationResult.companyCodeFromCard !== String(companyId)) {
      toast.warn("Este número de cartão não pertence à empresa selecionada.");
      return null;
    }
    return cleanedCardNumber;
  };

  const handleSearchGuides = async (e) => {
    if (e) e.preventDefault();
    setSearchAttempted(true);
    const validCleanedCardNumber = validateCardAndCompany(cardNumber);
    if (!validCleanedCardNumber) {
      setGuides([]);
      return;
    }
    setIsLoadingGuides(true);
    setGuides([]);
    const apiUrl = `https://api.dentaluni.com.br/beneficiario/guias`;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { ...requestHeadersBase, "Content-Type": "application/json" },
        body: JSON.stringify({ ncartao: validCleanedCardNumber }),
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
      toast.error(err.message || "Falha ao buscar guias.");
      setGuides([]);
    } finally {
      setIsLoadingGuides(false);
    }
  };

  const handleRequestToken = async () => {
    const validCleanedCardNumber = validateCardAndCompany(cardNumber);
    if (!validCleanedCardNumber) {
      return;
    }
    setIsTokenLoading(true);
    setTokenModalMessage("");
    setIsTokenErrorInModal(false);
    const apiUrl = `https://api.dentaluni.com.br/beneficiario/gerar-token`;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { ...requestHeadersBase, "Content-Type": "application/json" },
        body: JSON.stringify({ cartao: validCleanedCardNumber }),
      });
      const data = await response.json();
      if (!response.ok || data.erro || !data.status) {
        setTokenModalMessage(
          data.msg || `Erro ao gerar token (Status: ${response.status})`
        );
        setIsTokenErrorInModal(true);
      } else {
        setTokenModalMessage(`${data.msg}. Seu token é: ${data.token}`);
        setIsTokenErrorInModal(false);
      }
    } catch (err) {
      setTokenModalMessage(err.message || "Falha ao gerar token.");
      setIsTokenErrorInModal(true);
    } finally {
      setIsTokenLoading(false);
      setIsTokenModalOpen(true);
    }
  };

  const closeTokenModal = () => {
    setIsTokenModalOpen(false);
  };

  return (
    <>
      {" "}
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
              Número do Cartão do Beneficiário (da empresa selecionada):
              <input
                id="cardNumberGuidesInput"
                type="text"
                value={cardNumber}
                onChange={(e) => {
                  setCardNumber(e.target.value.replace(/\D/g, ""));
                  setSearchAttempted(false);
                  setGuides([]);
                }}
                placeholder="Digite o número do cartão (ex: 002025...)"
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
                <FaSearch style={{ marginRight: "8px" }} />{" "}
                {isLoadingGuides ? "Buscando..." : "Buscar Guias"}
              </button>
              <button
                type="button"
                onClick={handleRequestToken}
                className="button-secondary"
                disabled={isLoadingGuides || isTokenLoading}
                style={{ minWidth: "180px" }}
              >
                <FaKey style={{ marginRight: "8px" }} />{" "}
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
      {isTokenModalOpen && (
        <div className="app-modal-overlay" onClick={closeTokenModal}>
          <div
            className="app-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="app-modal-close-button"
              onClick={closeTokenModal}
              aria-label="Fechar"
            >
              <FaTimes />
            </button>
            <h4
              className={
                isTokenErrorInModal
                  ? "modal-title-error"
                  : "modal-title-success"
              }
            >
              {isTokenErrorInModal ? "Falha ao Gerar Token" : "Token Gerado"}
            </h4>
            <p
              className="modal-text-message"
              style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}
            >
              {tokenModalMessage}
            </p>
            <button
              onClick={closeTokenModal}
              className={`button-primary modal-ok-button ${
                isTokenErrorInModal ? "button-error-ok" : ""
              }`}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

ConsultGuides.propTypes = {
  companyId: PropTypes.string.isRequired,
};

export default ConsultGuides;
