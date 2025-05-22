import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
  FaUserTie,
  FaUsers,
} from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner"; 

const requestHeaders = {
  "client-id": "26",
  "client-token": "cb93f445a9426532143cd0f3c7866421",
  Accept: "application/json",
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

const CompanyContacts = ({ companyId }) => {
  const [companyDetails, setCompanyDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!companyId) {
      setIsLoading(false);
      setError("ID da empresa não fornecido para buscar contatos.");
      setCompanyDetails(null);
      return;
    }

    const fetchCompanyContactsData = async () => {
      setIsLoading(true);
      setError(null);
      setCompanyDetails(null);
      try {
        const response = await fetch(
          `https://api.dentaluni.com.br/sae/empresa?codigo=${companyId}`,
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
        if (data.error) {
          throw new Error(
            data.msg || "Erro ao carregar dados da empresa para contatos."
          );
        }
        if (data.empresas && data.empresas.length > 0) {
          setCompanyDetails(data.empresas[0]);
        } else {
          setError("Dados da empresa não encontrados para os contatos.");
          setCompanyDetails(null);
        }
      } catch (err) {
        console.error("Erro ao buscar dados da empresa para contatos:", err);
        setError(err.message);
        setCompanyDetails(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyContactsData();
  }, [companyId]); 

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
  if (error) {
    return (
      <div
        className="ticket-message ticket-error"
        style={{ marginTop: "20px" }}
      >
        ⚠️ {error}
      </div>
    );
  }
  if (!companyDetails) {
    return (
      <div className="ticket-message ticket-no-data">
        <p>Informações de contato não disponíveis.</p>
      </div>
    );
  }

  const { email, email_fat, contatos } = companyDetails;
  const showEmpresaEmails = hasDisplayableObjectContent(
    { emailProp: email, email_fatProp: email_fat },
    ["emailProp", "email_fatProp"]
  );
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

  if (
    !showEmpresaEmails &&
    !showContatoPrincipal &&
    !showResponsaveis &&
    !showTelefones &&
    !showEmailsAdicionais
  ) {
    return (
      <div className="ticket-message ticket-no-data">
        <p>
          Nenhuma informação de contato detalhada encontrada para esta empresa.
        </p>
      </div>
    );
  }

  return (
    <div className="company-contacts-container">
      {showEmpresaEmails && (
        <fieldset className="form-section">
          <legend>
            <FaEnvelope style={{ marginRight: "8px" }} /> Contatos de E-mail da
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
            <FaUserTie style={{ marginRight: "8px" }} /> Contato Principal
          </legend>
          <DataRow label="Nome" value={toTitleCase(contatos.nome_contato)} />
          <DataRow label="Cargo" value={toTitleCase(contatos.cargo_contato)} />
        </fieldset>
      )}

      {showResponsaveis && (
        <fieldset className="form-section">
          <legend>
            <FaUsers style={{ marginRight: "8px" }} /> Responsáveis pela Empresa
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
            <FaPhone style={{ marginRight: "8px" }} /> Telefones
          </legend>
          {contatos.telefones.map((tel, index) => {
            const numeroLimpo = cleanPhoneNumber(tel.telefone);
            const whatsappLink = numeroLimpo
              ? `https://wa.me/55${numeroLimpo}`
              : null;
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
                        {" "}
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
            <FaEnvelope style={{ marginRight: "8px" }} /> E-mails Adicionais
          </legend>
          {contatos.emails.map(
            (em, index) =>
              hasContent(em.a196_email) && (
                <div key={`email-${index}`} className="contact-item">
                  <DataRow
                    label="Nome"
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

CompanyContacts.propTypes = {
  companyId: PropTypes.string.isRequired,
};

export default CompanyContacts;
