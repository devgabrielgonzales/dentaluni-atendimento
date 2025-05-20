import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaRegClock,
  FaFileInvoiceDollar, 
} from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner";
import "../styles/Ticket.css"; 

const Ticket = ({ companyId }) => {
  const [boletos, setBoletos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!companyId) {
      setIsLoading(false);
      setBoletos([]);
      return;
    }
    const fetchBoletos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.dentaluni.com.br/sae/lista_duplicatas/cod=${companyId}`
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
    return <div className="ticket-message ticket-error">⚠️ {error}</div>;
  if (boletos.length === 0)
    return (
      <div className="ticket-message ticket-no-data">
        Nenhum boleto em aberto encontrado.
      </div>
    );

  return (
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
            <p className="ticket-card-title">{boleto.descricao || "Boleto"}</p>
            <p className="ticket-card-info">
              <FaCalendarAlt /> Venc.: {boleto.vencimento}
            </p>
            <p className="ticket-card-info">Valor: R$ {boleto.valorcobrado}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Ticket;
