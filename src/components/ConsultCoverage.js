import React, { useState } from "react";
import PropTypes from "prop-types";
import { FaDownload, FaFilePdf } from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner";
import { toast } from "react-toastify";

const requestHeaders = {
  "client-id": "26",
  "client-token": "cb93f445a9426532143cd0f3c7866421",
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

const ConsultCoverage = ({ companyId, companyData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const companyName = companyData?.razao_social || `empresa cód. ${companyId}`;

  const triggerDownloadFromBlob = (blob, fileName) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleDownloadCoveragePdf = async () => {
    if (!companyId) {
      toast.error("Código da empresa não disponível para consulta.");
      return;
    }

    setIsLoading(true);

    let apiUrl = `https://api.dentaluni.com.br/sae/cobertura/${companyId}?tipo=pdf`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: requestHeaders,
      });

      if (!response.ok) {
        let errorMsg = `Erro ao buscar cobertura (Status: ${response.status} ${response.statusText})`;
        try {
          const errorData = await response.json();
          if (errorData && errorData.msg) {
            errorMsg = errorData.msg;
          } else {
            const errorText = await response.text();
            if (errorText) errorMsg = errorText;
          }
        } catch (e) {
        }
        throw new Error(errorMsg);
      }

      const blob = await response.blob();
      if (blob.type !== "application/pdf") {
        const responseText = await blob.text();
        console.error(
          "API não retornou um PDF. Resposta recebida (lida como texto):",
          responseText.substring(0, 200)
        );
        if (responseText.includes("Mensagem enviada")) {
          toast.info("Solicitação de cobertura processada: " + responseText);
          return;
        }
        throw new Error(
          "Formato de resposta inesperado. Esperava-se um PDF, mas recebido: " +
            blob.type
        );
      }

      triggerDownloadFromBlob(blob, `cobertura_empresa_${companyId}.pdf`);
      toast.success("Download da cobertura iniciado!");
    } catch (err) {
      console.error("Erro ao baixar PDF da cobertura:", err);
      toast.error(err.message || "Falha ao baixar o PDF da cobertura.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="consultar-cobertura-container">
      <fieldset className="form-section">
        <legend>
          <FaFilePdf style={{ marginRight: "8px" }} />
          Cobertura do Plano da Empresa
        </legend>

        <p className="coverage-text-info">
          Clique no botão abaixo para baixar o documento PDF com os detalhes da
          cobertura do plano para a empresa. <br />
        </p>

        <div
          className="form-actions"
          style={{
            justifyContent: "center",
            marginTop: "20px",
            paddingTop: "15px",
            borderTop: "1px dashed #eee",
          }}
        >
          <button
            onClick={handleDownloadCoveragePdf}
            className="button-primary"
            disabled={isLoading || !companyId}
          >
            {isLoading ? (<><FaDownload style={{ marginRight: "8px" }} />Baixando...</>) : (<><FaDownload style={{ marginRight: "8px" }} />Baixar Cobertura (PDF)</>)}
          </button>
        </div>
      </fieldset>
    </div>
  );
};

ConsultCoverage.propTypes = {
  companyId: PropTypes.string.isRequired,
  companyData: PropTypes.object,
};

export default ConsultCoverage;
