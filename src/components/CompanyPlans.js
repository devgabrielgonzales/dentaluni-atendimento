import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion'; 
import { FaScroll, FaCalendarAlt, FaFileSignature, FaToggleOn, FaToggleOff, FaBarcode, FaGlobe, FaUsersCog } from 'react-icons/fa';
import LoadingSpinner from './LoadingSpinner';
import '../styles/RegisterVisitPage.css';
import { toast } from 'react-toastify';

const requestHeaders = {
  "client-id": "26",
  "client-token": "cb93f445a9426532143cd0f3c7866421",
  "Accept": "application/json",
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString.replace(' ', 'T'));
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  } catch (e) {
    return dateString;
  }
};

const toTitleCase = (str) => {
  if (!str || typeof str !== "string") return "";
  const articles = ["de", "do", "da", "dos", "das", "e", "a", "o", "um", "uma"];
  return str.toLowerCase().split(" ").map((word, index) => {
    if (word.length > 1 && word === word.toUpperCase() && !articles.includes(word.toLowerCase())) {
        const isPotentialAcronym = /^[A-Z0-9]+$/.test(word);
        if(isPotentialAcronym && word.length > 1) return word;
    }
    if (index > 0 && articles.includes(word.toLowerCase())) return word.toLowerCase();
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(" ");
};

const hasContent = (value) => {
  return !(value === null || value === undefined || String(value).trim() === "" || String(value).trim() === "-");
};

const DataRow = ({ label, value, children }) => {
  const hasValueProp = hasContent(value);
  const hasChildren = children !== null && children !== undefined;
  if (!hasValueProp && !hasChildren) return null;
  return (
    <div className="data-row">
      <span className="data-label">{label}:</span>
      <span className="data-value">{hasChildren ? children : String(value)}</span>
    </div>
  );
};

DataRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  children: PropTypes.node,
};

const CompanyPlans = ({ companyId }) => {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!companyId) {
      setIsLoading(false);
      toast.error("ID da empresa não fornecido para buscar planos.");
      setPlans([]);
      return;
    }

    let isMounted = true;
    const fetchPlans = async () => {
      setIsLoading(true);
      setPlans([]); 
      try {
        const response = await fetch(
          `https://api.dentaluni.com.br/sae/planos/${companyId}`,
          { headers: requestHeaders }
        );
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ msg: "Erro de rede ou formato inválido." }));
          throw new Error(errorData?.msg || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (isMounted) {
          if (!data.error && data.planos && Array.isArray(data.planos)) {
            const sortedPlans = data.planos.sort((a, b) => 
                (a.a006_nm_plano || "").localeCompare(b.a006_nm_plano || "")
            );
            setPlans(sortedPlans);
            if (sortedPlans.length === 0) {
                toast.info("Nenhum plano encontrado para esta empresa.");
            }
          } else {
            toast.warn(data.msg || "Não foram encontrados planos ou o formato da resposta é inesperado.");
            setPlans([]);
          }
        }
      } catch (err) {
        console.error("Erro ao buscar planos da empresa:", err);
        if (isMounted) {
          toast.error(err.message || "Falha ao buscar planos da empresa.");
          setPlans([]);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchPlans();
    return () => { isMounted = false; };
  }, [companyId]);

  const mapTipoPlano = (tipo) => tipo === 'P' ? 'Pós-Pagamento' : (tipo === 'R' ? 'Pré-Pagamento (Recurso)' : tipo);
  const mapAbrangencia = (tipo) => tipo === 'T' ? 'Nacional' : (tipo === 'M' ? 'Municipal' : (tipo === 'G' ? 'Grupo de Municípios' : tipo));
  const mapSimNao = (valor) => valor === '1' ? 'Sim' : (valor === '0' ? 'Não' : valor);
  const mapTipoPessoaPlano = (tipo) => tipo === 'J' ? 'Pessoa Jurídica' : (tipo === 'F' ? 'Pessoa Física' : tipo);
  const mapStatusContratoPlano = (valor) => valor === '0' ? 'Ativo' : (valor === '1' ? 'Inativo' : valor);


  if (isLoading) {
    return <div style={{display: 'flex', justifyContent: 'center', padding: '20px'}}><LoadingSpinner /></div>;
  }

  if (plans.length === 0 && !isLoading) { 
    return (
      <div className="list-message list-no-data" style={{marginTop: '20px'}}>
        <p>Nenhum plano para exibir.</p>
      </div>
    );
  }

  return (
    <div className="company-plans-container">
      {plans.map((plano, index) => (
        <motion.div
          key={plano.a006_cd_plano || index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <fieldset className="form-section">
            <legend>
              <FaScroll style={{ marginRight: '8px' }} /> 
              {toTitleCase(plano.a016_desc_plano_contrato || plano.a006_nm_reduzido || 'Plano')}
            </legend>
            
            <DataRow label="Nome Completo do Plano" value={toTitleCase(plano.a006_nm_plano)} />
            <DataRow label="Código do Plano" value={plano.a006_cd_plano} />
            <DataRow label="Status" value={mapStatusContratoPlano(plano.a007_ind_desat)} />
            <DataRow label="Registro ANS" value={plano.a006_registro_ans} />
            <DataRow label="Tipo" value={mapTipoPlano(plano.a006_tp_plano)} />
            <DataRow label="Abrangência" value={mapAbrangencia(plano.a006_tp_abrangencia)} />
            <DataRow label="Tipo Pessoa (Plano)" value={mapTipoPessoaPlano(plano.a006_tp_pessoa_plano)} />
            <DataRow label="Início Vigência" value={formatDate(plano.a006_dt_ini_vigencia)} />
            <DataRow label="Fim Vigência" value={formatDate(plano.a006_dt_fim_vigencia)} />
            <DataRow label="Meses de Vigência" value={plano.a007_meses_vigencia} />
            <DataRow label="Dia de Vencimento" value={plano.a007_dia_vcmto} />
            <DataRow label="Débito Automático" value={mapSimNao(plano.a006_ind_deb_automatico)} />
            <DataRow label="Cód. Contrato (Interno)" value={plano.a007_cd_contrato} />
          </fieldset>
        </motion.div>
      ))}
    </div>
  );
};

CompanyPlans.propTypes = {
  companyId: PropTypes.string.isRequired,
};

export default CompanyPlans;