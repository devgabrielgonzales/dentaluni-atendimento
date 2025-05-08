import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MenuPage.css';
import { FaMapMarkedAlt } from 'react-icons/fa';
import { FaRegFileLines } from "react-icons/fa6";


const MenuPage = () => {
  const [codEmpresa, setCodEmpresa] = useState('');
  const navigate = useNavigate();

  const handleDadosEmpresa = () => {
    if (!codEmpresa) {
      alert('Por favor, informe o Cód. da Empresa.');
      return;
    }
    console.log('Botão Dados Empresa clicado com o Cód:', codEmpresa);
    navigate(`/company-data/${codEmpresa}`);
  };

  const handleRegistrarVisita = () => {
    if (!codEmpresa) {
      alert('Por favor, informe o Cód. da Empresa.');
      return;
    }
    console.log('Botão Registrar Visita clicado com o Cód:', codEmpresa);
    navigate(`/visit`);
  };

  const getFormattedDate = () => {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let formattedDate = today.toLocaleDateString('pt-BR', options);
    formattedDate = formattedDate.replace(/\b\w/g, char => char.toUpperCase());
    return formattedDate;
  };

  return (
    <div className="new-menu-page">
      <header className="new-menu-banner-section">
        <div className="avatar-placeholder"></div>
        <div className="greeting-text">Olá, Gabriel Gonzales</div>
        <div className="date-text">{getFormattedDate()}</div>
      </header>

      <main className="new-menu-content-area">
        <p className="question-text">Qual é o código da empresa?</p>
        <div className="new-input-container">
          <input
            type="text"
            className="new-cod-empresa-input"
            value={codEmpresa}
            onChange={(e) => setCodEmpresa(e.target.value)}
            placeholder="Digite o código"
          />
        </div>

        <div className="new-actions-container">
          <button
            type="button"
            className="new-action-button"
            onClick={handleDadosEmpresa}
          >
            <FaRegFileLines className="button-icon" />
            <span>Dados da empresa</span>
 
          </button>
          <button
            type="button"
            className="new-action-button"
            onClick={handleRegistrarVisita}
          >
            <FaMapMarkedAlt className="button-icon" />
            <span>Registrar visita</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default MenuPage;