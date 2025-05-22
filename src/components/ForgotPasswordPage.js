import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/ForgotPasswordPage.css";
import Logo from "../img/logo.png";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const ForgotPasswordPage = () => {
  const [codAcesso, setCodAcesso] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isLoading) return;

    if (!codAcesso) {
      toast.warn("Por favor, informe seu código de acesso.");
      return;
    }

    setIsLoading(true);
    const apiUrl = `https://api.dentaluni.com.br/esqueciMinhaSenha/${codAcesso}/2`;

    try {
      const response = await fetch(apiUrl, { method: "GET" });

      let responseData;
      let isJsonResponse = false;
      try {
        responseData = await response.clone().json();
        isJsonResponse = true;
        console.log("Resposta da API (tentativa JSON):", responseData);
      } catch (e) {
        responseData = await response.text();
        console.log("Resposta da API (texto simples):", responseData);
      }

      if (response.ok) {
        if (isJsonResponse && responseData.error === false) {
          toast.success(
            responseData.msg ||
              "Solicitação de nova senha processada com sucesso!"
          );
        } else if (isJsonResponse && responseData.error === true) {
          toast.error(responseData.msg || "Erro ao processar a solicitação.");
        } else if (
          !isJsonResponse &&
          typeof responseData === "string" &&
          responseData.toLowerCase().includes("e-mail env")
        ) {
          toast.success(responseData);
        } else if (!isJsonResponse && typeof responseData === "string") {
          toast.warn(responseData);
        } else {
          toast.success(
            "Operação concluída, mas a resposta do servidor foi inesperada."
          );
        }
      } else {
        let errorMessage = `Erro ao solicitar nova senha (${response.status})`;
        if (isJsonResponse && responseData && responseData.msg) {
          errorMessage = responseData.msg;
        } else if (typeof responseData === "string" && responseData) {
          errorMessage = responseData;
        }
        toast.error(errorMessage);
        console.error(
          "Erro da API (nova senha):",
          response.status,
          responseData
        );
      }
    } catch (error) {
      console.error("Erro de rede ou ao processar a solicitação:", error);
      toast.error("Falha na comunicação. Tente novamente mais tarde.");
    }

    setIsLoading(false);
  };

  const animationOffset = -20;
  const baseDuration = 0.7;
  const baseDelay = 0.1;

  return (
    <div className="signin-page">
      <div className="signin-header">
        <div>
          <motion.img
            className="signin-animated-title logo"
            initial={{ opacity: 0, y: animationOffset }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: baseDuration,
              delay: baseDelay + 0.1,
              ease: "easeOut",
            }}
            src={Logo}
            alt="Logo"
          />
        </div>
        <motion.h1
          className="signin-animated-title"
          initial={{ opacity: 0, y: animationOffset }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: baseDuration,
            delay: baseDelay + 0.2,
            ease: "easeOut",
          }}
        >
          Recuperar Senha
        </motion.h1>
        <motion.p
          className="signin-animated-title"
          initial={{ opacity: 0, y: animationOffset }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: baseDuration,
            delay: baseDelay + 0.3,
            ease: "easeOut",
          }}
        >
          Insira seu código de acesso para enviarmos as instruções.
        </motion.p>
      </div>
      <motion.div
        className="signin-form-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: baseDelay + 0.4, ease: "backOut" }}
      >
        <form onSubmit={handleSubmit} className="signin-form">
          <div className="input-field-group">
            <label htmlFor="cod-forgot">Código de acesso</label>
            <input
              type="text"
              id="cod-forgot"
              placeholder="Ex:90801"
              value={codAcesso}
              onChange={(e) => setCodAcesso(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button type="submit" className="signin-button" disabled={isLoading}>
            {isLoading ? <div className="button-spinner"></div> : "Enviar Link"}
          </button>

          <div className="options-fp">
            <Link to="/login" className="back-to-login-link">
              Voltar para o Login
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
