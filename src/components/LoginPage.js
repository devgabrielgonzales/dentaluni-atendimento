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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isLoading) return;

    if (codigo === "" || password === "") {
      toast.warn("Por favor, preencha código e senha.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "https://api.dentaluni.com.br/login/colaborador",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            login: codigo,
            senha: password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.accessToken) {
        toast.success("Login realizado com sucesso!");
        if (data.nome) {
          localStorage.setItem("userName", data.nome);
        } else {
          localStorage.setItem("userName", "Usuário DentalUni");
        }
        localStorage.setItem("userToken", data.accessToken);
        localStorage.setItem("userImg", data.img_painel);

        setTimeout(() => {
          navigate("/pesquisa");
        }, 1200);
      } else {
        const errorMessage =
          data.msg || data.message || "Código ou senha inválidos!";
        toast.error("Código ou senha inválidos!");
        setIsLoading(false);
        console.log(errorMessage);
      }
    } catch (error) {
      console.error("Erro na requisição de login (catch):", error);
      toast.error(
        "Erro ao tentar fazer login. Verifique sua conexão ou tente mais tarde."
      );
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
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
          Visita Fácil!
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
          Utilize seu código e senha para continuar.
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
            <label htmlFor="codigo">Código de acesso</label>
            <input
              type="text"
              id="codigo"
              placeholder="Ex: 90801"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              required
              disabled={isLoading}
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
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="password-toggle-btn"
                aria-label={
                  passwordVisible ? "Esconder senha" : "Mostrar senha"
                }
                disabled={isLoading}
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
                disabled={isLoading}
              />
              Lembrar
            </label>
            <Link
              to={isLoading ? "#" : "/lembrar-senha"}
              className={`forgot-password-link ${
                isLoading ? "disabled-link" : ""
              }`}
            >
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
