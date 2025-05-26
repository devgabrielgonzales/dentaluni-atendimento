import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import {
  FaPercentage,
  FaCalendarAlt,
  FaInfoCircle,
  FaClipboardList,
} from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner";
import { toast } from "react-toastify";
import "../styles/RegisterVisitPage.css"

const requestHeaders = {
  "client-id": "26",
  "client-token": "cb93f445a9426532143cd0f3c7866421",
  Accept: "application/json",
};

const formatDateForDisplay = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const datePart = dateString.split(" ")[0];
    let [p1, p2, p3] = datePart.split(/[-/]/);
    let dateToParse;
    if (p1 && p2 && p3) {
      if (p1.length === 4) dateToParse = `${p1}-${p2}-${p3}`; 
      else if (p3.length === 4) dateToParse = `${p3}-${p2}-${p1}`; 
      else return dateString; 
      const date = new Date(dateToParse.replace(/-/g, "/"));
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
    }
    return dateString;
  } catch (e) {
    return dateString;
  }
};

const parseSortableDate = (dateStringDDMMYYYY) => {
  if (!dateStringDDMMYYYY || typeof dateStringDDMMYYYY !== "string")
    return null;
  const parts = String(dateStringDDMMYYYY).split("/"); 
  if (parts.length === 3) {
    const date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  console.warn(
    `Data em formato inesperado para ordenação: ${dateStringDDMMYYYY}`
  );
  return null;
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

const ReadjustmentsInfo = ({ companyId }) => {
  const [readjustmentData, setReadjustmentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!companyId) {
      setIsLoading(false);
      toast.error("ID da empresa não fornecido.");
      setReadjustmentData(null);
      return;
    }
    let isMounted = true;
    const fetchReadjustments = async () => {
      setIsLoading(true);
      setReadjustmentData(null);
      try {
        const response = await fetch(
          `https://api.dentaluni.com.br/sae/reajustes/${companyId}`,
          { headers: requestHeaders }
        );
        if (!response.ok) {
          const d = await response.json().catch(() => ({}));
          throw new Error(d.msg || `HTTP error ${response.status}`);
        }
        const apiResponse = await response.json();
        if (isMounted) {
          if (
            !apiResponse.error &&
            apiResponse.data &&
            apiResponse.data.reajustes
          ) {
            const processedData = {};
            for (const pk in apiResponse.data.reajustes) {
              if (Object.hasOwnProperty.call(apiResponse.data.reajustes, pk)) {
                const items = apiResponse.data.reajustes[pk];
                if (Array.isArray(items)) {
                  processedData[pk] = [...items].sort(
                    (a, b) =>
                      (parseSortableDate(b.data_reajuste) || 0) -
                      (parseSortableDate(a.data_reajuste) || 0)
                  );
                } else {
                  processedData[pk] = [];
                }
              }
            }
            setReadjustmentData(processedData);
            if (Object.keys(processedData).length === 0)
              toast.info("Nenhum histórico de reajuste encontrado.");
          } else {
            toast.warn(apiResponse.msg || "Dados de reajuste não encontrados.");
            setReadjustmentData({});
          }
        }
      } catch (err) {
        if (isMounted) {
          toast.error(err.message || "Falha ao buscar reajustes.");
          setReadjustmentData({});
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchReadjustments();
    return () => {
      isMounted = false;
    };
  }, [companyId]);

  const sortedPlanKeys = useMemo(() => {
    if (!readjustmentData || Object.keys(readjustmentData).length === 0)
      return [];
    const plansWithDates = Object.keys(readjustmentData).map((planKey) => {
      const readjustments = readjustmentData[planKey];
      let mostRecentDate = null;
      let mostRecentDateString = null;
      if (
        readjustments &&
        readjustments.length > 0 &&
        readjustments[0].data_reajuste
      ) {
        mostRecentDateString = readjustments[0].data_reajuste;
        mostRecentDate = parseSortableDate(mostRecentDateString);
      }
      return { planKey, mostRecentDate, mostRecentDateString };
    });
    const sortedKeys = [...plansWithDates]
      .sort((a, b) => {
        const dateA = a.mostRecentDate;
        const dateB = b.mostRecentDate;
        if (!dateA && !dateB) return 0;
        if (!dateA || isNaN(dateA?.getTime())) return 1;
        if (!dateB || isNaN(dateB?.getTime())) return -1;
        return dateB.getTime() - dateA.getTime();
      })
      .map((item) => item.planKey);
    return sortedKeys;
  }, [readjustmentData]);

  if (isLoading)
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "20px" }}
      >
        <LoadingSpinner />
      </div>
    );
  if (!readjustmentData || sortedPlanKeys.length === 0) {
    return (
      <div className="list-message list-no-data" style={{ marginTop: "20px" }}>
        <p>Nenhum histórico de reajuste para exibir.</p>
      </div>
    );
  }

  return (
    <div className="readjustments-info-container">
      {sortedPlanKeys.map((planKey) => {
        const planReadjustments = readjustmentData[planKey];
        const planNameDisplay = toTitleCase(
          planKey.substring(planKey.indexOf("-") + 1).trim()
        );
        return (
          <motion.div
            key={planKey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <fieldset className="form-section">
              <legend>
                <FaClipboardList style={{ marginRight: "8px" }} /> Reajustes:{" "}
                {planNameDisplay}
              </legend>
              {!planReadjustments || planReadjustments.length === 0 ? (
                <p
                  className="list-message list-no-data-small"
                  style={{ padding: "10px 0", textAlign: "center" }}
                >
                  Nenhum histórico de reajuste para este plano.
                </p>
              ) : (
                planReadjustments.map((reajuste, index) => (
                  <div key={index} className="contact-item">
                    <DataRow
                      label="Data do Reajuste"
                      value={formatDateForDisplay(reajuste.data_reajuste)}
                    />
                    <DataRow
                      label="Motivo"
                      value={toTitleCase(reajuste.motivo)}
                    />
                    <DataRow
                      label="Índice (Tipo)"
                      value={toTitleCase(reajuste.indice)}
                    />
                    <DataRow
                      label="Proposto"
                      value={
                        hasContent(reajuste.proposto)
                          ? `${reajuste.proposto}%`
                          : null
                      }
                    />
                    <DataRow
                      label="Aplicado"
                      value={
                        hasContent(reajuste.aplicado)
                          ? `${reajuste.aplicado}%`
                          : null
                      }
                    />
                    <DataRow
                      label="Período Ref."
                      value={
                        hasContent(reajuste.data_inicial) &&
                        hasContent(reajuste.data_final)
                          ? `${formatDateForDisplay(
                              reajuste.data_inicial
                            )} - ${formatDateForDisplay(reajuste.data_final)}`
                          : null
                      }
                    />
                    <DataRow
                      label="Próx. Reajuste Programado"
                      value={formatDateForDisplay(
                        reajuste.dt_programada_reajuste
                      )}
                    />
                  </div>
                ))
              )}
            </fieldset>
          </motion.div>
        );
      })}
    </div>
  );
};
ReadjustmentsInfo.propTypes = { companyId: PropTypes.string.isRequired };
export default ReadjustmentsInfo;
