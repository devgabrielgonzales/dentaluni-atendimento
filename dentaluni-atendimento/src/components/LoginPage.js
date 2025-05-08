import React, { useState } from "react";
import "../styles/LoginPage.css";
import { FaUser, FaLock } from "react-icons/fa";
import LogoImage from "../img/logo.png";
import HeroImage from "../img/hero-banner-bg.png";
// import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  // const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Usuário:", username);
    console.log("Senha:", password);
    console.log("Lembrar:", rememberMe);
    alert("Tentativa de login!");
    // navigate('/menu');
  };

  return (
    <div className="login-page">
      <div className="hero-section">
        <img src={HeroImage} alt="Hero background" className="hero-image" />
      </div>
      {/* login-container-wrapper foi removido */}
      <div className="login-container">
        {" "}
        {/* Agora filho direto de login-page */}
        <img src={LogoImage} alt="Logo da Empresa" className="login-logo" />
        <h1>Bem-vindo de volta!</h1>
        <p className="subtitle">
          Utilize seu <strong>usuário</strong> e <strong>senha do SIO</strong>{" "}
          para acessar seu perfil:
        </p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              placeholder="Usuário ou E-mail"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">
            <a href="/menu">Entrar</a>
          </button>
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
            <a href="/forgot-password">Esqueceu a sua senha?</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
