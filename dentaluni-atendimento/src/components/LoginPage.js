import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Logo from "../img/logo.png";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const SigninPage = () => {
  const [codigo, setCodigo] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    console.log("Código de acesso:", codigo);
    console.log("Senha:", password);
    console.log("Lembrar:", rememberMe);

    setTimeout(() => {
      if (codigo === "90801" && password === "123") {
        toast.success("Login realizado com sucesso!");
        setTimeout(() => {
          navigate("/menu");
        }, 1200);
      } else if (codigo === "" || password === "") {
        toast.warn("Por favor, preencha código e senha.");
        setIsLoading(false);
      } else {
        toast.error("Código ou senha inválidos!");
        setIsLoading(false);
      }
    }, 1000);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="signin-page">
      <div className="signin-header">
        <div>
          <motion.img
            className="signin-animated-title logo"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            src={Logo}
            alt="Logo"
          />
        </div>
        <motion.h1
          className="signin-animated-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
        >
          Visita Fácil!
        </motion.h1>
        <motion.p
          className="signin-animated-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
        >
          Utilize seu código e senha para continuar.
        </motion.p>
      </div>

      <motion.div
        className="signin-form-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.5, ease: "backOut" }}
      >
        <form onSubmit={handleSubmit} className="signin-form">
          <div className="input-field-group">
            <label htmlFor="codigo">Código de acesso</label>
            <input
              type="number"
              id="codigo"
              placeholder="Ex: 90801"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              required
            />
          </div>

          <div className="input-field-group">
            <label htmlFor="password">Senha</label>
            <div className="password-input-wrapper">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="password-toggle-btn"
                aria-label={
                  passwordVisible ? "Esconder senha" : "Mostrar senha"
                }
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="options">
            <label htmlFor="rememberMe" className="remember-me">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Lembrar
            </label>
            <Link to="/forgot-password" className="forgot-password-link">
              Esqueceu a sua senha?
            </Link>
          </div>

          <button type="submit" className="signin-button" disabled={isLoading}>
            {isLoading ? <div className="button-spinner"></div> : "Entrar"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default SigninPage;
