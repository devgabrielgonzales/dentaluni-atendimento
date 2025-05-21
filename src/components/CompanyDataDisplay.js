import React from "react";
import PropTypes from "prop-types";

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

const DataRow = ({ label, value }) => {
  const val = String(value || "").trim();
  if (val === "" || val === "-") {
    return null;
  }
  return (
    <div className="data-row">
      <span className="data-label">{label}:</span>
      <span className="data-value">{String(value)}</span>
    </div>
  );
};

DataRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const hasContent = (...values) => {
  return values.some(
    (val) =>
      val !== null &&
      val !== undefined &&
      String(val).trim() !== "" &&
      String(val).trim() !== "-"
  );
};

const CompanyDataDisplay = ({ companyDetails }) => {
  if (!companyDetails) {
    return (
      <div className="company-data-container ticket-message ticket-no-data">
        <p>Dados da empresa não disponíveis.</p>
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
    email_fat,
    email,
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
  const contatosEmpresaFields = [email, email_fat];

  let hasContatoPrincipal = false;
  if (contatos) {
    hasContatoPrincipal = hasContent(
      contatos.nome_contato,
      contatos.cargo_contato
    );
  }

  let hasTelefones = false;
  if (contatos?.telefones && contatos.telefones.length > 0) {
    hasTelefones = contatos.telefones.some((tel) =>
      hasContent(tel.a033_tp_fone, tel.telefone, tel.a033_obs)
    );
  }

  let hasEmailsAdicionais = false;
  if (contatos?.emails && contatos.emails.length > 0) {
    hasEmailsAdicionais = contatos.emails.some((em) =>
      hasContent(
        em.a196_nome_contato,
        em.a196_cargo,
        em.a196_departamento,
        em.a196_email
      )
    );
  }

  let hasResponsaveis = false;
  if (contatos?.responsaveis && contatos.responsaveis.length > 0) {
    hasResponsaveis = contatos.responsaveis.some((resp) =>
      hasContent(resp.nome, resp.cargo)
    );
  }

  return (
    <div className="company-data-container">
      {hasContent(...dadosGeraisFields) && (
        <fieldset className="form-section">
          <legend>Dados Gerais da Empresa</legend>
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
          <legend>Endereço</legend>
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

      {hasContent(...contatosEmpresaFields) && (
        <fieldset className="form-section">
          <legend>Contatos da Empresa</legend>
          <DataRow label="E-mail Principal" value={email?.toLowerCase()} />
          <DataRow
            label="E-mail Faturamento"
            value={email_fat?.toLowerCase()}
          />
        </fieldset>
      )}

      {contatos && hasContatoPrincipal && (
        <fieldset className="form-section">
          <legend>Responsável Principal</legend>
          <DataRow label="Nome" value={toTitleCase(contatos.nome_contato)} />
          <DataRow label="Cargo" value={toTitleCase(contatos.cargo_contato)} />
        </fieldset>
      )}

      {hasTelefones && (
        <fieldset className="form-section">
          <legend>Telefones Adicionais</legend>
          {contatos.telefones.map(
            (tel, index) =>
              hasContent(tel.a033_tp_fone, tel.telefone, tel.a033_obs) && (
                <div key={`tel-${index}`} className="contact-item">
                  <DataRow
                    label={`Tipo`}
                    value={toTitleCase(tel.a033_tp_fone)}
                  />
                  <DataRow label={`Número`} value={tel.telefone} />
                  <DataRow label={`Observação`} value={tel.a033_obs} />
                </div>
              )
          )}
        </fieldset>
      )}

      {hasEmailsAdicionais && (
        <fieldset className="form-section">
          <legend>E-mails Adicionais</legend>
          {contatos.emails.map(
            (em, index) =>
              hasContent(
                em.a196_nome_contato,
                em.a196_cargo,
                em.a196_departamento,
                em.a196_email
              ) && (
                <div key={`email-${index}`} className="contact-item">
                  <DataRow
                    label={`Nome`}
                    value={toTitleCase(em.a196_nome_contato)}
                  />
                  <DataRow label={`Cargo`} value={toTitleCase(em.a196_cargo)} />
                  <DataRow
                    label={`Departamento`}
                    value={toTitleCase(em.a196_departamento)}
                  />
                  <DataRow
                    label={`Email`}
                    value={em.a196_email?.toLowerCase()}
                  />
                </div>
              )
          )}
        </fieldset>
      )}

      {hasResponsaveis && (
        <fieldset className="form-section">
          <legend>Outros Responsáveis</legend>
          {contatos.responsaveis.map(
            (resp, index) =>
              hasContent(resp.nome, resp.cargo) && (
                <div key={`resp-${index}`} className="contact-item">
                  <DataRow
                    label={`Nome`}
                    value={toTitleCase(resp.nome) || "Não informado"}
                  />
                  <DataRow
                    label={`Cargo`}
                    value={toTitleCase(resp.cargo) || "Não informado"}
                  />
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
