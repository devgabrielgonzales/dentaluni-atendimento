import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import '../styles/MenuPage.css';

const MenuPage = () => {
  const [codEmpresa, setCodEmpresa] = useState('');

  const handleDadosEmpresa = () => {
    if (!codEmpresa) {
      alert('Por favor, informe o Cód. da Empresa.');
      return;
    }
    console.log('Botão Dados Empresa clicado com o Cód:', codEmpresa);
    alert(`Buscando dados da empresa com Cód: ${codEmpresa}`);
  };

  const handleRegistrarVisita = () => {
    if (!codEmpresa) {
      alert('Por favor, informe o Cód. da Empresa.');
      return;
    }
    console.log('Botão Registrar Visita clicado com o Cód:', codEmpresa);
    alert(`Registrando visita para empresa com Cód: ${codEmpresa}`);
  };

  return (
    <div className="menu-page">
      <header className="menu-header">
        <div className="colaborador-info">
          <FaUserCircle className="colaborador-icon" />
          <span>NOME COLABORADOR</span>
        </div>
        <h1 className="menu-title">MENU</h1>
      </header>

      <main className="menu-content">
        <div className="input-container">
          <label htmlFor="codEmpresaInput" className="cod-empresa-label">
            Cód. da Empresa
          </label>
          <input
            type="text"
            id="codEmpresaInput"
            className="cod-empresa-input"
            value={codEmpresa}
            onChange={(e) => setCodEmpresa(e.target.value)}
            placeholder="Digite o código"
          />
        </div>

        <div className="actions-container">
          <button
            type="button"
            className="action-button dados-empresa-button"
            onClick={handleDadosEmpresa}
          >
            Dados empresa
          </button>
          <button
            type="button"
            className="action-button registrar-visita-button"
            onClick={handleRegistrarVisita}
          >
            Registrar Visita
          </button>
        </div>
      </main>
    </div>
  );
};

export default MenuPage;