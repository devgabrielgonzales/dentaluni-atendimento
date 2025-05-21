import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LuFileSearch } from "react-icons/lu";
import {
  FaCalendarAlt,
  FaInfoCircle,
  FaTimes,
  FaPaperclip,
} from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner";
import "../styles/RegisterVisitPage.css"; // Certifique-se de que este CSS existe ou comente se não for usar

const formatDate = (dateString) => {
  if (!dateString) return "N/D";
  try {
    const date = new Date(dateString.replace(" ", "T"));
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return dateString;
  }
};

const requestHeaders = {
  "client-id": "26",
  "client-token": "cb93f445a9426532143cd0f3c7866421",
  Accept: "application/json",
};

const ProtocolsList = ({ companyId }) => {
  const [protocols, setProtocols] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [listError, setListError] = useState(null);

  const [selectedProtocol, setSelectedProtocol] = useState(null);
  const [protocolDetails, setProtocolDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!companyId) {
      setIsLoadingList(false);
      setProtocols([]);
      setListError("ID da empresa não fornecido.");
      return;
    }

    const fetchProtocols = async () => {
      setIsLoadingList(true);
      setListError(null);
      console.log("fetchProtocols", companyId);
      try {
        const response = await fetch(
          `https://api.dentaluni.com.br/sae/list?cod=${companyId}`,
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
            errorData.msg || `Erro ao buscar protocolos: ${response.statusText}`
          );
        }
        const data = await response.json();
        if (data.error) {
          if (
            data.msg &&
            data.msg.toLowerCase().includes("nenhum") &&
            data.msg.toLowerCase().includes("encontrado")
          ) {
            setProtocols([]);
          } else {
            throw new Error(data.msg || "Erro ao carregar protocolos.");
          }
        } else {
          setProtocols(data.tickets || []);
        }
      } catch (err) {
        setListError(err.message);
        setProtocols([]);
      } finally {
        setIsLoadingList(false);
      }
    };

    fetchProtocols();
  }, [companyId]);

  useEffect(() => {
    if (!selectedProtocol || !selectedProtocol.id_ticket) {
      setProtocolDetails(null);
      return;
    }

    const fetchProtocolDetails = async () => {
      setIsLoadingDetails(true);
      setDetailsError(null);
      try {
        const response = await fetch(
          `https://api.dentaluni.com.br/sae/ticket?id=${selectedProtocol.id_ticket}`,
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
            errorData.msg || `Erro ao buscar detalhes: ${response.statusText}`
          );
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.msg || "Erro ao carregar detalhes.");
        }
        setProtocolDetails(data);
      } catch (err) {
        setDetailsError(err.message);
        setProtocolDetails(null);
      } finally {
        setIsLoadingDetails(false);
      }
    };

    fetchProtocolDetails();
  }, [selectedProtocol]);

  const handleProtocolClick = (protocol) => {
    setSelectedProtocol(protocol);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProtocol(null);
    setProtocolDetails(null);
    setDetailsError(null);
  };

  const filteredProtocols = protocols.filter(
    (protocol) =>
      protocol.protocolo_ans &&
      protocol.protocolo_ans.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderProtocolList = () => {
    if (isLoadingList) return <LoadingSpinner />;
    if (listError)
      return (
        <div className="protocol-message protocol-error">⚠️ {listError}</div>
      );

    const protocolsToDisplay = searchTerm ? filteredProtocols : protocols;

    if (protocolsToDisplay.length === 0) {
      return (
        <div className="protocol-message protocol-no-data">
          {searchTerm
            ? "Nenhum protocolo encontrado para esta busca."
            : "Nenhum protocolo encontrado."}
        </div>
      );
    }

    return (
      <div className="protocol-list-container">
        {protocolsToDisplay.map((protocol, index) => (
          <motion.div
            key={protocol.id_ticket || index}
            className="protocol-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onClick={() => handleProtocolClick(protocol)}
          >
            <div className="protocol-card-icon-area">
              <LuFileSearch />
            </div>
            <div className="protocol-card-details-area">
              <p className="protocol-card-title">
                {protocol.assunto_ticket || protocol.cod_ticket}
              </p>
              {protocol.protocolo_ans && (
                <p className="protocol-card-info protocol-ans-list">
                  ANS: {protocol.protocolo_ans}
                </p>
              )}
              <p className="protocol-card-info">
                <FaInfoCircle /> {protocol.nome_topico || "Não especificado"}
              </p>
              <p className="protocol-card-info">
                <FaCalendarAlt /> {formatDate(protocol.data_ticket)}
              </p>
              <span
                className="protocol-card-status-badge list-item-status"
                style={{
                  backgroundColor: protocol.cor_status || "#757575",
                  color: "white",
                }}
              >
                {protocol.nome_status || "N/D"}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderModalContent = () => {
    if (isLoadingDetails) return <LoadingSpinner />;
    if (detailsError)
      return (
        <div className="protocol-message protocol-error">
          ⚠️ Erro: {detailsError}
        </div>
      );
    if (!protocolDetails || !protocolDetails.ticket)
      return (
        <div className="protocol-message protocol-no-data">
          Detalhes não disponíveis.
        </div>
      );

    const { ticket, msgs } = protocolDetails;
    return (
      <>
        <h4>Detalhes do Protocolo</h4>
        <div className="protocol-detail-section">
          <p>
            <strong>Assunto:</strong> {ticket.assunto_ticket || "N/D"}
          </p>
          <p>
            <strong>Abertura:</strong> {formatDate(ticket.data_ticket)}
          </p>
          <p>
            <strong>Criado por:</strong> {ticket.nome_criador_ticket || "N/D"}
          </p>
          <p>
            <strong>Solicitado por:</strong>{" "}
            {ticket.protocolo_solicitado_por || "N/D"}
          </p>
          {ticket.protocolo_ans && (
            <p>
              <strong>Protocolo ANS:</strong> {ticket.protocolo_ans}
            </p>
          )}
        </div>

        <div className="protocol-detail-section">
          <h5>Mensagem Inicial:</h5>
          <div
            className="protocol-message-content"
            dangerouslySetInnerHTML={{
              __html: ticket.msg_ticket || "Nenhuma mensagem inicial.",
            }}
          />
        </div>

        {msgs && msgs.length > 0 && (
          <div className="protocol-detail-section">
            <h5>Histórico de Interações:</h5>
            {msgs.map((msg, index) => (
              <div key={msg.id_msg || index} className="protocol-message-entry">
                <p className="message-meta">
                  <strong>{msg.usuario_nome || "Sistema"}</strong> em{" "}
                  {formatDate(msg.data_msg)}
                  <span
                    className="protocol-card-status-badge"
                    style={{
                      backgroundColor: msg.cor_status || "#757575",
                      color: "white",
                      padding: "2px 5px",
                      borderRadius: "3px",
                      fontSize: "0.8em",
                      marginLeft: "5px",
                    }}
                  >
                    {msg.nome_status}
                  </span>
                </p>
                <div
                  className="protocol-message-content"
                  dangerouslySetInnerHTML={{ __html: msg.texto_msg || "" }}
                />
                {msg.arquivos &&
                  msg.arquivos.trim() !== "" &&
                  msg.arquivos.trim() !== ";" && (
                    <p className="message-attachments">
                      <FaPaperclip /> Anexos:{" "}
                      {msg.arquivos
                        .split(";")
                        .filter((f) => f.trim() !== "")
                        .join(", ")}
                    </p>
                  )}
              </div>
            ))}
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <div className="protocol-search-container">
        <input
          type="text"
          placeholder="Buscar por Protocolo ANS..."
          className="protocol-search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {renderProtocolList()}
      {isModalOpen && (
        <div className="protocol-modal-overlay" onClick={closeModal}>
          <div
            className="protocol-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="protocol-modal-close-button"
              onClick={closeModal}
              aria-label="Fechar"
            >
              <FaTimes />
            </button>
            {renderModalContent()}
          </div>
        </div>
      )}
    </>
  );
};

export default ProtocolsList;
