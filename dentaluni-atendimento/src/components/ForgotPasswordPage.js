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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isLoading) return;

    if (!codAcesso) {
      toast.warn("Por favor, informe seu código de acesso.");
      return;
    }

    setIsLoading(true);
    console.log("Código de acesso para recuperação:", codAcesso);

    setTimeout(() => {
      toast.success(`Link de recuperação enviado para o acesso: ${codAcesso}`);

      setIsLoading(false);
    }, 1000);
  };

  const animationOffset = -10;
  const baseDuration = 0.4;
  const baseDelay = 0.1;

  return (
    <div className="signin-page">
      {" "}
      {/* Reutilizando a classe da página de login para layout */}
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
              type="number"
              id="cod-forgot"
              placeholder="Ex:90801"
              value={codAcesso}
              onChange={(e) => setCodAcesso(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="signin-button" disabled={isLoading}>
            {isLoading ? <div className="button-spinner"></div> : "Enviar Link"}
          </button>

          <div className="options-fp">
            {" "}
            {/* Classe para estilizar este link de "voltar" */}
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
