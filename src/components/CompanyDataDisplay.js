import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import LoadingSpinner from "./LoadingSpinner";
import { toast } from "react-toastify";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaEnvelope,
  FaUserTie,
  FaUsers,
  FaPhone,
  FaWhatsapp,
} from "react-icons/fa";
import "../styles/RegisterVisitPage.css"

const requestHeaders = {
  "client-id": "26",
  "client-token": "cb93f445a9426532143cd0f3c7866421",
  Accept: "application/json",
};

const formatCNPJ = (digitsOnly) => {
  if (!digitsOnly || typeof digitsOnly !== "string") return "N/A";
  const cleaned = digitsOnly.replace(/\D/g, "");
  if (cleaned.length !== 14) return digitsOnly;
  return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(
    5,
    8
  )}/${cleaned.slice(8, 12)}-${cleaned.slice(12, 14)}`;
};

const toTitleCase = (str) => {
  if (!str || typeof str !== "string") return "";
  const articles = ["de", "do", "da", "dos", "das", "e", "a", "o", "um", "uma"];
  return str
    .toLowerCase()
    .split(" ")
    .map((word, index) => {
      if (word.length > 1 && word === word.toUpperCase()) return word;
      if (index > 0 && articles.includes(word.toLowerCase()))
        return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

const formatCep = (cepStr) => {
  if (!cepStr || typeof cepStr !== "string") return "N/A";
  const cleaned = cepStr.replace(/\D/g, "");
  if (cleaned.length === 8) return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
  return cepStr;
};

const hasContent = (value) => {
  return !(
    value === null ||
    value === undefined ||
    String(value).trim() === "" ||
    String(value).trim() === "-"
  );
};

const DataRow = ({ label, value, children }) => {
  const hasValueProp = hasContent(value);
  const hasChildren = children !== null && children !== undefined;
  if (!hasValueProp && !hasChildren) return null;
  return (
    <div className="data-row">
      <span className="data-label">{label}:</span>
      <span className="data-value">
        {hasChildren ? children : String(value)}
      </span>
    </div>
  );
};

DataRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.node,
};

const hasDisplayableListContent = (items, fieldsToCheck) => {
  if (!items || !Array.isArray(items) || items.length === 0) return false;
  return items.some(
    (item) => item && fieldsToCheck.some((field) => hasContent(item[field]))
  );
};

const hasDisplayableObjectContent = (item, fieldsToCheck) => {
  if (!item) return false;
  return fieldsToCheck.some((field) => hasContent(item[field]));
};

const CompanyDataDisplay = () => {
  const [companyDetails, setCompanyDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const currentCompanyId = localStorage.getItem("selectedCompanyId");

    if (!currentCompanyId) {
      setIsLoading(false);
      toast.error("ID da empresa não encontrado no armazenamento local.");
      setCompanyDetails(null);
      return;
    }

    const fetchCompanyDetails = async () => {
      setIsLoading(true);
      setCompanyDetails(null);
      try {
        const response = await fetch(
          `https://api.dentaluni.com.br/sae/empresa?codigo=${currentCompanyId}`,
          { headers: requestHeaders }
        );
        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ msg: "Erro de rede ou formato inválido." }));
          throw new Error(
            errorData?.msg || `HTTP error! status: ${response.status}`
          );
        }
        const data = await response.json();
        if (isMounted) {
          if (!data.error && data.empresas && data.empresas.length > 0) {
            setCompanyDetails(data.empresas[0]);
          } else {
            toast.warn(data.msg || "Dados da empresa não encontrados na API.");
            setCompanyDetails(null);
          }
        }
      } catch (err) {
        console.error("Erro ao buscar dados da empresa:", err);
        if (isMounted) {
          toast.error(err.message || "Falha ao buscar dados da empresa.");
          setCompanyDetails(null);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchCompanyDetails();
    return () => {
      isMounted = false;
    };
  }, []);

  const cleanPhoneNumber = (phone) => {
    if (!phone) return "";
    return String(phone).replace(/\D/g, "");
  };

  if (isLoading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "20px" }}
      >
        <LoadingSpinner />
      </div>
    );
  }

  if (!companyDetails) {
    return (
      <div className="company-data-container ticket-message ticket-no-data">
        <p>Não foi possível carregar os dados da empresa.</p>
      </div>
    );
  }

  const {
    codigo,
    razao_social,
    cnpj,
    logradouro,
    numero,
    bairro,
    cidade,
    uf,
    cep,
    nome_consultor,
    desativado,
    email,
    email_fat,
    contatos,
  } = companyDetails;

  const dadosGeraisFields = [
    codigo,
    razao_social,
    cnpj,
    desativado === "1" || desativado === 1 ? "Desativada" : "Ativa",
    nome_consultor,
  ];
  const enderecoFields = [logradouro, numero, bairro, cidade, uf, cep];
  const emailsEmpresaFields = [email, email_fat];

  const showContatoPrincipal =
    contatos &&
    hasDisplayableObjectContent(contatos, ["nome_contato", "cargo_contato"]);
  const showResponsaveis =
    contatos?.responsaveis &&
    hasDisplayableListContent(contatos.responsaveis, [
      "a273_nome",
      "a273_cargo",
    ]);
  const showTelefones =
    contatos?.telefones &&
    hasDisplayableListContent(contatos.telefones, ["telefone"]);
  const showEmailsAdicionais =
    contatos?.emails &&
    hasDisplayableListContent(contatos.emails, ["a196_email"]);

  return (
    <div className="company-data-container">
      {hasContent(...dadosGeraisFields) && (
        <fieldset className="form-section">
          <legend>
            <FaBuilding style={{ marginRight: "8px" }} /> Dados Gerais da
            Empresa
          </legend>
          <DataRow label="Código" value={codigo} />
          <DataRow label="Razão Social" value={toTitleCase(razao_social)} />
          <DataRow label="CNPJ" value={formatCNPJ(cnpj)} />
          <DataRow
            label="Situação"
            value={
              desativado === "1" || desativado === 1 ? "Desativada" : "Ativa"
            }
          />
          <DataRow label="Consultor" value={nome_consultor} />
        </fieldset>
      )}

      {hasContent(...enderecoFields) && (
        <fieldset className="form-section">
          <legend>
            <FaMapMarkerAlt style={{ marginRight: "8px" }} /> Endereço
          </legend>
          <DataRow
            label="Logradouro"
            value={`${toTitleCase(logradouro || "")}${
              numero ? `, ${numero}` : numero === "0" ? ", 0" : ", S/N"
            }`}
          />
          <DataRow label="Bairro" value={toTitleCase(bairro)} />
          <DataRow
            label="Cidade/UF"
            value={`${toTitleCase(cidade || "")}${
              uf ? ` - ${uf.toUpperCase()}` : ""
            }`}
          />
          <DataRow label="CEP" value={formatCep(cep)} />
        </fieldset>
      )}

      {hasContent(...emailsEmpresaFields) && (
        <fieldset className="form-section">
          <legend>
            <FaEnvelope style={{ marginRight: "8px" }} /> E-mails Principais da
            Empresa
          </legend>
          <DataRow label="E-mail Principal" value={email?.toLowerCase()}>
            {hasContent(email) && (
              <a
                href={`mailto:${email.toLowerCase()}`}
                className="contact-link"
              >
                {email.toLowerCase()}
              </a>
            )}
          </DataRow>
          <DataRow label="E-mail Faturamento" value={email_fat?.toLowerCase()}>
            {hasContent(email_fat) && (
              <a
                href={`mailto:${email_fat.toLowerCase()}`}
                className="contact-link"
              >
                {email_fat.toLowerCase()}
              </a>
            )}
          </DataRow>
        </fieldset>
      )}

      {contatos && showContatoPrincipal && (
        <fieldset className="form-section">
          <legend>
            <FaUserTie style={{ marginRight: "8px" }} /> Contato Principal na
            Empresa
          </legend>
          <DataRow label="Nome" value={toTitleCase(contatos.nome_contato)} />
          <DataRow label="Cargo" value={toTitleCase(contatos.cargo_contato)} />
        </fieldset>
      )}

      {showResponsaveis && (
        <fieldset className="form-section">
          <legend>
            <FaUsers style={{ marginRight: "8px" }} /> Outros Responsáveis
          </legend>
          {contatos.responsaveis.map(
            (resp, index) =>
              (hasContent(resp.a273_nome) || hasContent(resp.a273_cargo)) && (
                <div key={`resp-${index}`} className="contact-item">
                  <DataRow label="Nome" value={toTitleCase(resp.a273_nome)} />
                  <DataRow label="Cargo" value={toTitleCase(resp.a273_cargo)} />
                </div>
              )
          )}
        </fieldset>
      )}

      {showTelefones && (
        <fieldset className="form-section">
          <legend>
            <FaPhone style={{ marginRight: "8px" }} /> Telefones de Contato
          </legend>
          {contatos.telefones.map((tel, index) => {
            const numeroLimpo = cleanPhoneNumber(tel.telefone);
            const whatsappLink = numeroLimpo
              ? `https://wa.me/55${numeroLimpo}`
              : null; // Adiciona 55 para Brasil
            const callLink = numeroLimpo ? `tel:${numeroLimpo}` : null;

            return (
              hasContent(tel.telefone) && (
                <div key={`tel-${index}`} className="contact-item">
                  <DataRow label="Tipo" value={toTitleCase(tel.a033_tp_fone)} />
                  <DataRow label="Número" value={tel.telefone}>
                    <span>{tel.telefone}</span>
                    {callLink && (
                      <a
                        href={callLink}
                        className="contact-action-icon"
                        title="Ligar"
                      >
                        <FaPhone />
                      </a>
                    )}
                    {whatsappLink && (
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-action-icon"
                        title="WhatsApp"
                      >
                        <FaWhatsapp />
                      </a>
                    )}
                  </DataRow>
                  <DataRow label="Observação" value={tel.a033_obs} />
                </div>
              )
            );
          })}
        </fieldset>
      )}

      {showEmailsAdicionais && (
        <fieldset className="form-section">
          <legend>
            <FaEnvelope style={{ marginRight: "8px" }} /> E-mails Adicionais de
            Contato
          </legend>
          {contatos.emails.map(
            (em, index) =>
              hasContent(em.a196_email) && (
                <div key={`email-${index}`} className="contact-item">
                  <DataRow
                    label="Nome Contato"
                    value={toTitleCase(em.a196_nome_contato)}
                  />
                  <DataRow label="Cargo" value={toTitleCase(em.a196_cargo)} />
                  <DataRow
                    label="Departamento"
                    value={toTitleCase(em.a196_departamento)}
                  />
                  <DataRow label="Email" value={em.a196_email?.toLowerCase()}>
                    {hasContent(em.a196_email) && (
                      <a
                        href={`mailto:${em.a196_email.toLowerCase()}`}
                        className="contact-link"
                      >
                        {em.a196_email.toLowerCase()}
                      </a>
                    )}
                  </DataRow>
                </div>
              )
          )}
        </fieldset>
      )}
    </div>
  );
};

CompanyDataDisplay.propTypes = {
};

export default CompanyDataDisplay;
