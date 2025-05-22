import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaFileInvoiceDollar } from "react-icons/fa"; 
import { LuBarcode } from "react-icons/lu";
import LoadingSpinner from "./LoadingSpinner";
import "../styles/Ticket.css"; 

const Boleto = ({ companyId }) => {
  const [boletos, setBoletos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!companyId) {
      setIsLoading(false);
      return;
    }

    const requestHeaders = {
      "client-id": "26",
      "client-token": "cb93f445a9426532143cd0f3c7866421",
      Accept: "application/json",
    };

    const fetchBoletos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.dentaluni.com.br/sae/lista_duplicatas/cod=${companyId}`,
          {
            method: "GET",
            headers: requestHeaders,
          }
        );
        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ msg: `Erro HTTP: ${response.status}` }));
          throw new Error(
            errorData.msg || `Erro ao buscar boletos: ${response.statusText}`
          );
        }
        const data = await response.json();
        if (data.error) {
          if (
            data.msg &&
            data.msg.toLowerCase().includes("nenhum") &&
            data.msg.toLowerCase().includes("encontrado")
          ) {
            setBoletos([]); 
          } else {
            throw new Error(data.msg || "Erro ao carregar dados dos boletos.");
          }
        } else {
          setBoletos(data.dados || []); 
        }
      } catch (err) {
        setError(err.message);
        setBoletos([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBoletos();
  }, [companyId]);

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return (
      <div
        className="ticket-message ticket-error"
        style={{ margin: "20px auto" }}
      >
        ⚠️ {error}
      </div>
    );

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

  return (
    <fieldset className="form-section boleto-fieldset-container">
      <legend>
        <LuBarcode style={{ marginRight: "8px" }} />
        Boletos em aberto
      </legend>
      {boletos.length === 0 ? (
        <div className="ticket-message ticket-no-data">
          Nenhum boleto em aberto encontrado.
        </div>
      ) : (
        <div className="ticket-list-container">
          {boletos.map((boleto, index) => (
            <motion.div
              key={boleto.codigo || index}
              className="ticket-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => boleto.link && window.open(boleto.link, "_blank")}
            >
              <div className="ticket-card-icon-area">
                <FaFileInvoiceDollar />
              </div>
              <div className="ticket-card-details-area">
                <p className="ticket-card-info">
                  Vencimento: {formatDate(boleto.vencimento)}
                </p>
                <p className="ticket-card-info">
                  Valor: R$ {boleto.valorcobrado}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </fieldset>
  );
};

export default Boleto;
