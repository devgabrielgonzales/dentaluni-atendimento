import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ForgotPasswordPage.css';
import LogoImage from '../img/logo.png'; 
import HeroImage from '../img/hero-banner-bg.png'; 

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Email para recuperação:', email);
    alert(`Link de recuperação enviado para: ${email} (simulação)`);
  };

  return (
    <div className="fp-page-layout">
      <div className="hero-section">
        <img src={HeroImage} alt="Hero background" className="hero-image" />
      </div>
      <div className="fp-container-centered"> 
        <img src={LogoImage} alt="Logo da Empresa" className="fp-logo" />
        <h2>Esqueceu sua senha?</h2>
        <p className="fp-subtitle">
          Não se preocupe! Insira seu e-mail abaixo e enviaremos um link para você cadastrar uma nova senha.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="fp-input-group">
            <input
              type="email"
              placeholder="Seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="fp-button">
            Enviar link de recuperação
          </button>
        </form>
        <div className="fp-back-to-login">
          <Link to="/login">Voltar para o Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;