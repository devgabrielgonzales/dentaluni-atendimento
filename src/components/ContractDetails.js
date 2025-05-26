import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  FaFileContract,
  FaInfoCircle,
  FaCalendarCheck,
  FaUserTie,
  FaFileSignature,
} from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner";
import { toast } from "react-toastify";

const requestHeaders = {
  "client-id": "26",
  "client-token": "cb93f445a9426532143cd0f3c7866421",
  Accept: "application/json",
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const datePart = dateString.split(" ")[0];
    const [yearOrDay, month, dayOrYear] = datePart.split(/[-/]/);
    let dateToParse;
    if (yearOrDay.length === 4) {
      dateToParse = `${yearOrDay}-${month}-${dayOrYear}`;
    } else {
      dateToParse = `${dayOrYear}-${month}-${yearOrDay}`;
    }
    const date = new Date(dateToParse.replace(/-/g, "/"));
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
  } catch (e) {
    console.warn("Erro ao formatar data:", dateString, e);
    return dateString;
  }
};

const toTitleCase = (str) => {
  if (!str || typeof str !== "string") return "";
  const articles = ["de", "do", "da", "dos", "das", "e", "a", "o", "um", "uma"];
  return str
    .toLowerCase()
    .split(" ")
    .map((word, index) => {
      if (!word) return ""; 
      if (
        word.length > 1 &&
        word === word.toUpperCase() &&
        !articles.includes(word.toLowerCase())
      ) {
        const isPotentialAcronym = /^[A-Z0-9]+$/.test(word);
        if (isPotentialAcronym && word.length > 1) return word;
      }
      if (index > 0 && articles.includes(word.toLowerCase()))
        return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
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

DataRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
};

const ContractDetails = ({ companyId }) => {
  const [contractData, setContractData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!companyId) {
      setIsLoading(false);
      toast.error("ID da empresa não fornecido para buscar dados do contrato.");
      setContractData(null);
      return;
    }
    let isMounted = true;
    const fetchContractData = async () => {
      setIsLoading(true);
      setContractData(null);
      try {
        const response = await fetch(
          `https://api.dentaluni.com.br/sae/contrato/${companyId}`,
          { headers: requestHeaders }
        );
        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ msg: "Erro de rede ou formato inválido." }));
          throw new Error(
            errorData?.msg || `HTTP error! status: ${response.status}`
          );
        }
        const data = await response.json();
        if (isMounted) {
          if (!data.error && data.contrato && data.contrato.length > 0) {
            setContractData(data.contrato[0]);
          } else {
            toast.info(
              data.msg ||
                "Nenhum dado de contrato encontrado para esta empresa."
            );
            setContractData(null);
          }
        }
      } catch (err) {
        console.error("Erro ao buscar dados do contrato:", err);
        if (isMounted) {
          toast.error(err.message || "Falha ao buscar dados do contrato.");
          setContractData(null);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchContractData();
    return () => {
      isMounted = false;
    };
  }, [companyId]);

  if (isLoading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "20px" }}
      >
        <LoadingSpinner />
      </div>
    );
  }

  if (!contractData) {
    return (
      <div className="list-message list-no-data" style={{ marginTop: "20px" }}>
        <p>
          Não foi possível carregar os detalhes do contrato ou não existem
          dados.
        </p>
      </div>
    );
  }

  const {
    ini_vigencia_contrato,
    pri_men_contrato,
    data_desativacao,
    dt_alteracao,
    ind_desat,
    nome_consultor,
    tp_contrato,
    ind_por_adesao,
    permite_ato_complementar,
    ind_faturar_empresa,
    ind_nf_unificada,
    ind_item_nf_mens_unif,
    fat_ato_pos_pagamento,
    ind_fat_atos_pos_auto,
    fat_ato_complementar,
    fat_ato_coparticipacao,
    faturar_guia_data_desc,
    ind_clausula_mandato,
    ind_faturar_resp_financ_atos,
    dt_programada_reajuste,
  } = contractData;

  return (
    <div className="contract-details-container">
      <fieldset className="form-section">
        <legend>
          <FaFileContract style={{ marginRight: "8px" }} /> Detalhes do Contrato
        </legend>
        <DataRow label="Status do Contrato" value={toTitleCase(ind_desat)} />
        <DataRow label="Tipo de Contrato" value={toTitleCase(tp_contrato)} />
        <DataRow label="Modalidade" value={toTitleCase(ind_por_adesao)} />
        <DataRow label="Consultor" value={toTitleCase(nome_consultor)} />
      </fieldset>

      <fieldset className="form-section">
        <legend>
          <FaCalendarCheck style={{ marginRight: "8px" }} /> Vigência e Prazos
        </legend>
        <DataRow
          label="Início da Vigência"
          value={formatDate(ini_vigencia_contrato)}
        />
        <DataRow
          label="Primeira Mensalidade"
          value={formatDate(pri_men_contrato)}
        />
        <DataRow
          label="Data de Desativação"
          value={formatDate(data_desativacao)}
        />
        <DataRow
          label="Data Prog. Reajuste"
          value={formatDate(dt_programada_reajuste)}
        />
        <DataRow label="Última Alteração" value={formatDate(dt_alteracao)} />
      </fieldset>

      <fieldset className="form-section">
        <legend>
          <FaFileSignature style={{ marginRight: "8px" }} /> Condições de
          Faturamento
        </legend>
        <DataRow
          label="Faturar para Empresa"
          value={toTitleCase(ind_faturar_empresa)}
        />
        <DataRow
          label="Permite Ato Complementar"
          value={toTitleCase(permite_ato_complementar)}
        />
        <DataRow label="NF Unificada" value={toTitleCase(ind_nf_unificada)} />
        <DataRow
          label="Item NF Mens. Unif."
          value={toTitleCase(ind_item_nf_mens_unif)}
        />
        <DataRow
          label="Fat. Ato Pós-Pagamento"
          value={toTitleCase(fat_ato_pos_pagamento)}
        />
        <DataRow
          label="Fat. Atos Pós Auto."
          value={toTitleCase(ind_fat_atos_pos_auto)}
        />
        <DataRow
          label="Fat. Ato Complementar"
          value={toTitleCase(fat_ato_complementar)}
        />
        <DataRow
          label="Fat. Ato Coparticipação"
          value={toTitleCase(fat_ato_coparticipacao)}
        />
        <DataRow
          label="Faturar Guia por"
          value={toTitleCase(faturar_guia_data_desc)}
        />
        <DataRow
          label="Cláusula de Mandato"
          value={toTitleCase(ind_clausula_mandato)}
        />
        <DataRow
          label="Fat. Resp. Financ. Atos"
          value={toTitleCase(ind_faturar_resp_financ_atos)}
        />
      </fieldset>
    </div>
  );
};

ContractDetails.propTypes = {
  companyId: PropTypes.string.isRequired,
};

export default ContractDetails;
