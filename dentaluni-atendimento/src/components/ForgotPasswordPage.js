import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/ForgotPasswordPage.css"; // Certifique-se que o caminho está correto
import Logo from "../img/logo.png"; // Ajuste o caminho se necessário
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
    console.log("Solicitando nova senha para o código de acesso:", codAcesso);

    const apiUrl = `https://api.dentaluni.com.br/esqueciMinhaSenha/${codAcesso}/2`;

    try {
      const response = await fetch(apiUrl, { method: "GET" });

      // Tentar ler a resposta. Primeiro como JSON, depois como texto se JSON falhar.
      let responseData;
      let isJsonResponse = false;
      try {
        responseData = await response.clone().json(); // Clonar para poder ler como texto depois se necessário
        isJsonResponse = true;
        console.log("Resposta da API (tentativa JSON):", responseData);
      } catch (e) {
        // Falha ao parsear JSON, tentar ler como texto
        responseData = await response.text();
        console.log("Resposta da API (texto simples):", responseData);
      }

      if (response.ok) {
        if (isJsonResponse && responseData.error === false) {
          // Resposta JSON e sem erro lógico da API
          toast.success(
            responseData.msg ||
              "Solicitação de nova senha processada com sucesso!"
          );
        } else if (isJsonResponse && responseData.error === true) {
          // Resposta JSON mas com erro lógico da API
          toast.error(responseData.msg || "Erro ao processar a solicitação.");
        } else if (
          !isJsonResponse &&
          typeof responseData === "string" &&
          responseData.toLowerCase().includes("e-mail env")
        ) {
          // Resposta texto simples, e parece ser de sucesso
          toast.success(responseData);
        } else if (!isJsonResponse && typeof responseData === "string") {
          // Resposta texto simples, mas não parece ser a mensagem de sucesso esperada
          toast.warn(responseData); // Mostrar como aviso
        } else {
          // Caso inesperado, mas response.ok é true
          toast.success(
            "Operação concluída, mas a resposta do servidor foi inesperada."
          );
        }
      } else {
        // Erro HTTP (ex: 404, 500)
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
      // Erro de rede ou outro erro antes de conseguir ler a resposta
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
