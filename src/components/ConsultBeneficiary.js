import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaUser,
  FaAddressCard,
  FaFileMedicalAlt,
  FaExternalLinkAlt,
  FaUsers,
} from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner";
import "../styles/RegisterVisitPage.css";
import { toast } from "react-toastify";

const requestHeaders = {
  "client-id": "26",
  "client-token": "cb93f445a9426532143cd0f3c7866421",
  Accept: "application/json",
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString.replace(" ", "T"));
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("pt-BR");
  } catch (e) {
    return dateString;
  }
};

const ConsultBeneficiary = ({ companyId, companyData }) => {
  const [searchNome, setSearchNome] = useState("");
  const [searchCpf, setSearchCpf] = useState("");
  const [searchCartao, setSearchCartao] = useState("");
  const [beneficiaryResult, setBeneficiaryResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchNome && !searchCpf && !searchCartao) {
      toast.warn(
        "Preencha ao menos um campo para busca (Nome, CPF ou Cartão)."
      );
      setBeneficiaryResult(null);
      return;
    }

    setIsLoading(true);
    setBeneficiaryResult(null);

    const baseUrl = "https://api.dentaluni.com.br/sae/empresa_beneficiario";
    const params = new URLSearchParams({ codigo: String(companyId) });

    if (searchNome.trim())
      params.append("nome", searchNome.trim().toUpperCase());
    if (searchCpf.replace(/\D/g, "").trim())
      params.append("cpf", searchCpf.replace(/\D/g, ""));
    if (searchCartao.replace(/\D/g, "").trim())
      params.append("cartao", searchCartao.replace(/\D/g, ""));

    const searchApiUrl = `${baseUrl}?${params.toString()}`;

    try {
      const response = await fetch(searchApiUrl, {
        method: "GET",
        headers: requestHeaders,
      });
      const data = await response.json();

      if (!response.ok || data.error) {
        const errorMessage =
          data.msg ||
          `Erro ao buscar beneficiário (Status: ${response.status})`;
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      if (data.dados_beneficiario) {
        setBeneficiaryResult(data);
        toast.success("Beneficiário encontrado!");
      } else {
        setBeneficiaryResult(null);
        toast.info(
          "Nenhum beneficiário encontrado com os critérios informados."
        );
      }
    } catch (err) {
      console.error("Erro na busca por beneficiário:", err);
      if (
        !(
          err.message.includes("Status:") ||
          err.message.includes("Nenhum beneficiário")
        )
      ) {
        toast.error(err.message || "Falha ao buscar beneficiário.");
      }
      setBeneficiaryResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewCardPdf = () => {
    if (
      beneficiaryResult &&
      beneficiaryResult.dados_beneficiario?.a012_nr_cartao
    ) {
      const numeroCartao = beneficiaryResult.dados_beneficiario.a012_nr_cartao;
      const pdfUrl = `https://api.dentaluni.com.br/beneficiario/cartao/visualizar/${numeroCartao}?tipo=pdf`;
      window.open(pdfUrl, "_blank");
    } else {
      toast.warn(
        "Busque um beneficiário primeiro para visualizar a carteirinha."
      );
    }
  };

  const DataRow = ({ label, value }) => {
    if (
      value === null ||
      value === undefined ||
      String(value).trim() === "" ||
      String(value).trim() === "-"
    ) {
      return null;
    }
    return (
      <div className="data-row">
        <span className="data-label">{label}:</span>
        <span className="data-value">{String(value)}</span>
      </div>
    );
  };

  return (
    <div className="consult-beneficiary-container">
      <form
        onSubmit={handleSearch}
        className="visit-form"
        style={{ gap: "15px" }}
      >
        <fieldset className="form-section">
          <legend>
            <FaUsers /> Consultar Beneficiário
          </legend>
          <label>
            {" "}
            Nome do Beneficiário:
            <input
              type="text"
              value={searchNome}
              onChange={(e) => setSearchNome(e.target.value)}
              placeholder="Nome completo ou parcial"
            />
          </label>
          <label>
            {" "}
            CPF do Beneficiário:
            <input
              type="text"
              value={searchCpf}
              onChange={(e) =>
                setSearchCpf(e.target.value.replace(/\D/g, "").slice(0, 11))
              }
              placeholder="Apenas números"
              maxLength={11}
            />
          </label>
          <label>
            {" "}
            Número do Cartão:
            <input
              type="text"
              value={searchCartao}
              onChange={(e) =>
                setSearchCartao(e.target.value.replace(/\D/g, ""))
              }
              placeholder="Apenas números"
            />
          </label>
          <div
            className="form-actions"
            style={{
              justifyContent: "center",
              marginTop: "10px",
              paddingTop: "10px",
            }}
          >
            <button
              type="submit"
              className="button-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <FaSearch style={{ marginRight: "8px" }} /> Buscar
                </>
              )}
            </button>
          </div>
        </fieldset>
      </form>

      {beneficiaryResult &&
        beneficiaryResult.dados_beneficiario &&
        !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ marginTop: "20px" }}
          >
            <fieldset className="form-section">
              <legend>
                <FaUser style={{ marginRight: "8px" }} />
                Dados do Beneficiário
              </legend>
              <DataRow
                label="Nome Completo"
                value={beneficiaryResult.dados_beneficiario.a012_nome_completo}
              />
              <DataRow
                label="Nº Cartão"
                value={beneficiaryResult.dados_beneficiario.a012_nr_cartao}
              />
              <DataRow
                label="CPF (Informado)"
                value={
                  searchCpf &&
                  beneficiaryResult.dados_beneficiario.a012_nome_completo
                    ? searchCpf.replace(
                        /(\d{3})(\d{3})(\d{3})(\d{2})/,
                        "$1.$2.$3-$4"
                      )
                    : "N/D"
                }
              />
              <DataRow
                label="Inclusão"
                value={formatDate(
                  beneficiaryResult.dados_beneficiario.dt_inclusao
                )}
              />
              {beneficiaryResult.dados_beneficiario.a012_dt_exclusao && (
                <DataRow
                  label="Exclusão"
                  value={formatDate(
                    beneficiaryResult.dados_beneficiario.a012_dt_exclusao
                  )}
                />
              )}
              <DataRow
                label="Plano do Benef."
                value={beneficiaryResult.dados_beneficiario.a012_plano}
              />
              <DataRow
                label="UF Emissão RG"
                value={beneficiaryResult.dados_beneficiario.uf_expedicao_rg}
              />
            </fieldset>

            {beneficiaryResult.dados_plano &&
              beneficiaryResult.dados_plano.length > 0 && (
                <fieldset className="form-section">
                  <legend>
                    <FaFileMedicalAlt style={{ marginRight: "8px" }} />
                    Plano Contratado
                  </legend>
                  {beneficiaryResult.dados_plano.map((plano, index) => (
                    <div
                      key={index}
                      style={
                        beneficiaryResult.dados_plano.length > 1
                          ? {
                              marginBottom: "10px",
                              borderBottom: "1px dashed #eee",
                              paddingBottom: "10px",
                            }
                          : {}
                      }
                    >
                      <DataRow label="Nome" value={plano.a006_nm_reduzido} />
                      <DataRow
                        label="Tipo"
                        value={plano.a061_desc_tipo_plano}
                      />
                    </div>
                  ))}
                </fieldset>
              )}

            <fieldset className="form-section">
              <legend>
                <FaAddressCard style={{ marginRight: "8px" }} />
                Carteirinha Virtual
              </legend>
              <div
                className="form-actions"
                style={{
                  justifyContent: "center",
                  marginTop: "10px",
                  paddingTop: "10px",
                  borderTop: "none",
                }}
              >
                <button
                  onClick={handleViewCardPdf}
                  className="button-secondary"
                  disabled={
                    !beneficiaryResult?.dados_beneficiario?.a012_nr_cartao
                  }
                >
                  <FaExternalLinkAlt style={{ marginRight: "8px" }} />{" "}
                  Visualizar Carteirinha (PDF)
                </button>
              </div>
            </fieldset>
          </motion.div>
        )}
    </div>
  );
};

export default ConsultBeneficiary;
