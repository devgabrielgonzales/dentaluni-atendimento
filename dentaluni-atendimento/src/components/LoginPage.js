import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/LoginPage.css"; 
import { FaEye, FaEyeSlash } from "react-icons/fa"; 
import nomeDoSeuLogo from '../img/logo.png'

const SigninPage = () => {
  const [codigo, setCodigo] = useState(""); 
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("codigo:", codigo);
    console.log("Senha:", password);
    console.log("Lembrar:", rememberMe);
    alert("Login simulado com sucesso!");
    navigate("/menu"); 
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="signin-page">
      <div className="signin-header">
        <div>
          <img className="logo" src={nomeDoSeuLogo} alt="Logo"/>
        </div>
        <h1>Bem-vindo de volta!</h1>
        <p>Utilize seu usuário e senha do SIO para acessar seu perfil:</p>
      </div>

      <div className="signin-form-card">
        <form onSubmit={handleSubmit} className="signin-form">
          <div className="input-field-group">
            <label htmlFor="email">Código de acesso</label>
            <input
              type="codigo"
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
                aria-label={passwordVisible ? "Hide password" : "Show password"}
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
            {/* Usando Link do react-router-dom */}
            <Link to="/forgot-password" className="forgot-password-link">
              Esqueceu a sua senha?
            </Link>
          </div>

          <button type="submit" className="signin-button">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default SigninPage;
