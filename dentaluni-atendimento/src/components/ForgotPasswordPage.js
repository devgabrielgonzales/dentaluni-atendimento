import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/ForgotPasswordPage.css";
import Logo from "../img/logo.png";
import { motion } from "framer-motion";

const ForgotPasswordPage = () => {
  const [codAcesso, setCodAcesso] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Email para recuperação:", codAcesso);
    alert(`Link de recuperação enviado para: ${codAcesso} (simulação)`);
  };

  return (
    <div className="signin-page">
      {" "}
      <div className="signin-header">
        {" "}
        <div>
          <motion.img
            className="signin-animated-title logo"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            src={Logo}
            alt="Logo"
          />
        </div>
        <motion.h1
          className="signin-animated-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          Recuperar Senha
        </motion.h1>
        <motion.p
          className="signin-animated-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          Insira seu código de acesso para enviarmos as instruções.
        </motion.p>
      </div>
      <motion.div
              className="signin-form-card"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "backOut" }}>
        {" "}
        <form onSubmit={handleSubmit} className="signin-form">
          <div className="input-field-group">
            <label htmlFor="email-forgot">Código de acesso</label>
            <input
              type="text"
              id="cod-forgot"
              placeholder="Ex:90801"
              value={codAcesso}
              onChange={(e) => setCodAcesso(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="signin-button">
            Enviar Link
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
