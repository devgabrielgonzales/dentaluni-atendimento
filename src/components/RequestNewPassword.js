import React, { useState } from "react";
import { FaKey, FaTimes, FaInfoCircle } from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner";

const requestHeaders = {
  "client-id": "26",
  "client-token": "cb93f445a9426532143cd0f3c7866421",
  Accept: "application/json",
};

const RequestCompanyNewPassword = ({ companyId, companyData }) => {
  const companyName = companyData?.razao_social || "a empresa selecionada";

  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isErrorInModal, setIsErrorInModal] = useState(false);

  const handleRequestPassword = async () => {
    if (!companyId) {
      setModalMessage("Código da empresa não identificado para esta operação.");
      setIsErrorInModal(true);
      setIsModalOpen(true);
      return;
    }

    setIsLoading(true);
    setModalMessage("");
    setIsErrorInModal(false);

    const apiUrl = `https://api.dentaluni.com.br/esqueciMinhaSenha/${companyId}/3`;

    try {
      const response = await fetch(apiUrl, { headers: requestHeaders });

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        let successMessage;

        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          if (data.error) {
            throw new Error(
              data.msg || "Ocorreu um erro na solicitação de senha."
            );
          }
          successMessage =
            data.msg ||
            "E-mail enviado com sucesso! Verifique sua caixa de entrada.";
        } else {
          successMessage = await response.text();
          if (!successMessage) {
            successMessage =
              "Solicitação processada. Verifique o e-mail do responsável.";
          }
        }
        setModalMessage(successMessage);
        setIsErrorInModal(false);
      } else {
        let errorMessage = `Erro ${response.status}: ${response.statusText}`;
        try {
          const errorBody = await response.text();
          try {
            const errorJson = JSON.parse(errorBody);
            if (errorJson && errorJson.msg) {
              errorMessage = errorJson.msg;
            } else if (errorBody) {
              errorMessage = errorBody;
            }
          } catch (parseError) {
            if (errorBody) errorMessage = errorBody;
          }
        } catch (e) {}
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Erro na solicitação de nova senha:", error);
      setModalMessage(
        error.message ||
          "Não foi possível processar sua solicitação. Tente novamente mais tarde."
      );
      setIsErrorInModal(true);
    } finally {
      setIsLoading(false);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const toTitleCase = (str) => {
    if (!str || typeof str !== "string") return "";
    const articles = [
      "de",
      "do",
      "da",
      "dos",
      "das",
      "e",
      "a",
      "o",
      "um",
      "uma",
    ];
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

  return (
    <div className="request-password-container">
      <div className="request-password-subtitle-wrapper">
        <FaInfoCircle className="subtitle-icon" />
        <p className="request-password-subtitle">
          Ao clicar no botão abaixo, uma nova senha temporária será gerada e
          enviada para o e-mail de contato principal cadastrado para{" "}
          {toTitleCase(companyName)}.
        </p>
      </div>
      <button
        onClick={handleRequestPassword}
        className="button-primary request-password-button"
        disabled={isLoading}
      >
        <FaKey style={{ marginRight: "8px" }} />
        Solicitar Nova Senha
      </button>

      {isModalOpen && (
        <div className="app-modal-overlay" onClick={closeModal}>
          <div
            className="app-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="app-modal-close-button"
              onClick={closeModal}
              aria-label="Fechar"
            >
              <FaTimes />
            </button>
            <h4
              className={
                isErrorInModal ? "modal-title-error" : "modal-title-success"
              }
            >
              {isErrorInModal ? "Falha na Solicitação" : "Solicitação Enviada"}
            </h4>
            <p className="modal-text-message">{modalMessage}</p>
            <button
              onClick={closeModal}
              className={`button-primary modal-ok-button ${
                isErrorInModal ? "button-error-ok" : ""
              }`}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestCompanyNewPassword;
