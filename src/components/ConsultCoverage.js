import React, { useState } from "react";
import { FaDownload, FaFileMedicalAlt,  } from "react-icons/fa";
import "../styles/RegisterVisitPage.css";

const ConsultCoverage = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [error, setError] = useState(null);

  const handleViewCoveragePdf = () => {
    const cleanedCardNumber = cardNumber.replace(/\D/g, "");
    if (!cleanedCardNumber) {
      setError("Por favor, insira um número de cartão válido.");
      return;
    }
    setError(null);

    const pdfUrl = `https://api.dentaluni.com.br/beneficiario/cobertura/${cleanedCardNumber}?tipo=pdf`;
    window.open(pdfUrl, "_blank");
  };

  return (
    <div className="consultar-cobertura-container">
      <fieldset className="form-section">
        <legend>
          <FaFileMedicalAlt style={{ marginRight: "8px" }} />
          Consultar Cobertura do Plano
        </legend>
        <label htmlFor="cardNumberCoverageInput">
          Número do Cartão do Beneficiário:
          <input
            id="cardNumberCoverageInput"
            type="text"
            value={cardNumber}
            onChange={(e) => {
              setCardNumber(e.target.value.replace(/\D/g, ""));
              if (error) setError(null);
            }}
            placeholder="Digite o número do cartão"
            className="detail-input"
          />
        </label>

        {error && (
          <p className="error-feedback consult-cobertura-error">{error}</p>
        )}

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
            onClick={handleViewCoveragePdf}
            className="button-primary"
            disabled={!cardNumber.trim()}
          >
            <FaDownload style={{ marginRight: "8px" }} />
            Baixar Cobertura (PDF)
          </button>
        </div>
      </fieldset>
    </div>
  );
};

export default ConsultCoverage;
