import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { LuReceipt } from "react-icons/lu";
import { FaCalendarAlt, FaRegCopy, FaFilter } from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner";
import { toast } from "react-toastify";
import '../styles/RegisterVisitPage.css';

const requestHeaders = {
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

const formatCurrency = (value) => {
  if (value === null || value === undefined) return "N/A";
  const num = parseFloat(String(value).replace(",", "."));
  if (isNaN(num)) return String(value);
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

const ListInvoices = ({ companyId }) => {
  const [allInvoices, setAllInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(null);

  const [searchTermNFe, setSearchTermNFe] = useState("");
  const [searchMonth, setSearchMonth] = useState("");
  const [searchYear, setSearchYear] = useState("");

  useEffect(() => {
    if (!companyId) {
      setIsLoading(false);
      setAllInvoices([]);
      toast.warn("ID da empresa não fornecido para buscar notas fiscais.");
      return;
    }
    const fetchInvoices = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.dentaluni.com.br/sae/listar_nfes/${companyId}`,
          { headers: requestHeaders }
        );
        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ msg: `Erro HTTP: ${response.status}` }));
          throw new Error(
            errorData.msg ||
              `Erro ao buscar notas fiscais: ${response.statusText}`
          );
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.msg || "Erro ao carregar notas fiscais.");
        }
        const invoicesArray = data.dados || [];
        if (!Array.isArray(invoicesArray)) {
          throw new Error(
            "Formato de resposta da API inesperado para notas fiscais."
          );
        }
        invoicesArray.sort((a, b) => {
          const dateA = a.a063_dt_emissao
            ? new Date(a.a063_dt_emissao.replace(" ", "T"))
            : null;
          const dateB = b.a063_dt_emissao
            ? new Date(b.a063_dt_emissao.replace(" ", "T"))
            : null;
          if (!dateA && !dateB) return 0;
          if (!dateA) return 1;
          if (!dateB) return -1;
          if (isNaN(dateA.getTime())) return 1;
          if (isNaN(dateB.getTime())) return -1;
          return dateB - dateA;
        });
        setAllInvoices(invoicesArray);
        if (invoicesArray.length === 0 && !data.error) {
          toast.info("Nenhuma nota fiscal encontrada para esta empresa.");
        }
      } catch (err) {
        toast.error(err.message || "Falha ao buscar notas fiscais.");
        setAllInvoices([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvoices();
  }, [companyId]);

  const handleCopyNFeLink = (link, event) => {
    event.stopPropagation();
    if (!link) {
      toast.warn("Não há link de NF-e para copiar.");
      return;
    }
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setCopiedLink(link);
        toast.success("Link da NF-e copiado!");
        setTimeout(() => setCopiedLink(null), 2000);
      })
      .catch((err) => {
        console.error("Erro ao copiar link da NF-e: ", err);
        toast.error("Falha ao copiar o link da NF-e.");
      });
  };

  const handleBoletoAction = (nf) => {
    const statusDescricao = nf.a245_desc_sit_duplicata || "";
    if (statusDescricao.toUpperCase() === "ABERTA") {
      if (nf.a063_cd_duplicata && nf.a063_seq_duplicata && nf.a005_cd_cli) {
        const codigoDuplicata = nf.a063_cd_duplicata;
        const sequencia = nf.a063_seq_duplicata;
        const codigoEmpresa = nf.a005_cd_cli;
        const boletoUrl = `https://www.dentaluni.com.br/boleto/gerar/${codigoDuplicata}/${sequencia}/${codigoEmpresa}/0/E`;
        window.open(boletoUrl, "_blank");
        toast.info("Seu boleto está sendo aberto em uma nova aba...");
      } else {
        toast.warn(
          "Informações insuficientes para gerar o link do boleto desta nota fiscal."
        );
      }
    } else {
      toast.info(
        `Este boleto não pode ser aberto pois o status é: ${
          statusDescricao || "Indefinido"
        }.`
      );
    }
  };

  const displayedInvoices = useMemo(() => {
    let filtered = [...allInvoices];
    const trimmedSearchNFe = searchTermNFe.trim();
    const monthQuery = searchMonth.trim();
    const yearQuery = searchYear.trim();

    const hasNFeFilter = trimmedSearchNFe !== "";
    const hasMonthFilter = monthQuery !== "" && /^\d{1,2}$/.test(monthQuery);
    const hasYearFilter = yearQuery !== "" && /^\d{4}$/.test(yearQuery);
    let anyFilterActive = hasNFeFilter || hasMonthFilter || hasYearFilter;

    if (hasNFeFilter) {
      filtered = filtered.filter(
        (inv) => inv.a062_nfe && inv.a062_nfe.includes(trimmedSearchNFe)
      );
    }
    if (hasMonthFilter && hasYearFilter) {
      const paddedMonth = monthQuery.padStart(2, "0");
      filtered = filtered.filter((inv) => {
        if (!inv.a063_dt_emissao) return false;
        const emissionDate = inv.a063_dt_emissao.substring(0, 10);
        return emissionDate.startsWith(`${yearQuery}-${paddedMonth}`);
      });
    } else if (hasYearFilter && !hasMonthFilter) {
      filtered = filtered.filter((inv) => {
        if (!inv.a063_dt_emissao) return false;
        const emissionDate = inv.a063_dt_emissao.substring(0, 10);
        return emissionDate.startsWith(yearQuery);
      });
    }
    if (!anyFilterActive) {
      return filtered.slice(0, 10);
    }
    return filtered;
  }, [allInvoices, searchTermNFe, searchMonth, searchYear]);

  const getNoResultsMessage = () => {
    if (searchTermNFe.trim() || searchMonth.trim() || searchYear.trim()) {
      return "Nenhuma nota fiscal encontrada para os filtros aplicados.";
    }
    if (allInvoices.length === 0 && !isLoading) {
      return "Nenhuma nota fiscal emitida para esta empresa até o momento.";
    }
    return "";
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="listar-notasfiscais-container">
      <fieldset className="form-section filter-section">
        <legend>
          <FaFilter style={{ marginRight: "8px" }} /> Filtros de Busca
        </legend>
        <div className="filters-grid">
          <label className="filter-label">
            Número da NF-e:
            <input
              type="text"
              placeholder="Digite o número"
              value={searchTermNFe}
              onChange={(e) => setSearchTermNFe(e.target.value)}
              className="detail-input"
            />
          </label>
          <div className="date-filter-group">
            <label className="filter-label">
              Mês Emissão (MM):
              <input
                type="text"
                placeholder="MM"
                value={searchMonth}
                onChange={(e) =>
                  setSearchMonth(e.target.value.replace(/\D/g, "").slice(0, 2))
                }
                className="detail-input month-input"
                maxLength="2"
              />
            </label>
            <label className="filter-label">
              Ano Emissão (AAAA):
              <input
                type="text"
                placeholder="AAAA"
                value={searchYear}
                onChange={(e) =>
                  setSearchYear(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                className="detail-input year-input"
                maxLength="4"
              />
            </label>
          </div>
        </div>
      </fieldset>

      {displayedInvoices.length === 0 && !isLoading && (
        <div className="list-message list-no-data">{getNoResultsMessage()}</div>
      )}

      <div className="list-cards-container">
        {displayedInvoices.map((nf, index) => (
          <motion.div
            key={nf.a062_nfe || nf.a062_seq_nota || index}
            className="info-card clickable-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onClick={() => handleBoletoAction(nf)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) =>
              (e.key === "Enter" || e.key === " ") && handleBoletoAction(nf)
            }
          >
            <div className="info-card-icon-area">
              <LuReceipt />
            </div>
            <div className="info-card-details-area">
              <p className="info-card-title">NF-e: {nf.a062_nfe || "N/D"}</p>
              <p className="info-card-subtitle">
                {nf.a076_desc_tp_duplicata || "Serviço Prestado"}
              </p>
              <p className="info-card-info">
                <FaCalendarAlt /> Emissão: {formatDate(nf.a063_dt_emissao)}
              </p>
              <p className="info-card-info">
                Valor: {formatCurrency(nf.a063_vl_duplicata)}
              </p>
              <p className="info-card-info">
                Competência: {formatDate(nf.a086_dt_periodo_inicial)} -{" "}
                {formatDate(nf.a086_dt_periodo_final)}
              </p>
            </div>
            <div className="info-card-status-action-area">
              <span
                className="info-card-status-badge"
                style={{
                  backgroundColor:
                    nf.a063_sit_duplicata === "C"
                      ? "#E53935"
                      : nf.a063_sit_duplicata === "A"
                      ? "#43A047"
                      : nf.a063_sit_duplicata === "Q"
                      ? "#1976D2"
                      : "#757575",
                  color: "white",
                }}
              >
                {nf.a245_desc_sit_duplicata || nf.a063_sit_duplicata || "N/D"}
              </span>
              {nf.a062_nfe_link && (
                <button
                  onClick={(e) => handleCopyNFeLink(nf.a062_nfe_link, e)}
                  className="button-icon-copy"
                  title="Copiar link da NF-e (Prefeitura)"
                >
                  <FaRegCopy />{" "}
                  {copiedLink === nf.a062_nfe_link
                    ? "Copiado!"
                    : "Copiar Link NF-e"}
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ListInvoices;
