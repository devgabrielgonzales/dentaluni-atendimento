import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/RegisterVisitPage.css";
import {
  FaStar,
  FaPlus,
  FaTrash,
  FaHome,
  FaSearch,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";
import { motion } from "framer-motion";
import AppHeader from "./AppHeader";

const modalStyles = {
  /* ... */
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  content: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
    maxWidth: "500px",
    width: "90%",
    textAlign: "center",
    position: "relative",
    fontSize: "1.1em",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "transparent",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
  },
  protocolText: {
    fontWeight: "bold",
    color: "#333",
    marginTop: "15px",
    lineHeight: "1.6",
    wordBreak: "break-word",
  },
  okButton: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1em",
    marginTop: "20px",
    transition: "background-color 0.2s ease",
  },
};

const RegisterVisitPage = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();

  const motivoVisitaOptions = [
    { value: "", label: "Selecione um motivo...", id_topico: null },
    { value: "214", label: "Visita", id_topico: 214 },
    { value: "333", label: "Visita - Checklist", id_topico: 333 },
    { value: "331", label: "Visita de Eventos", id_topico: 331 },
    { value: "215", label: "Visita de Implantação", id_topico: 215 },
    { value: "311", label: "Visita de Reajuste", id_topico: 311 },
    { value: "330", label: "Visita de Treinamentos", id_topico: 330 },
    { value: "342", label: "Visita Negociação", id_topico: 342 },
    { value: "343", label: "Visita Outros", id_topico: 343 },
  ];

  const initialFormData = {
    motivoVisita: "",
    motivoVisitaOutros: "",
    ocorrenciasCadastral: {
      atualizacaoCadastral: false,
      insencaoCarencia: false,
      cancelamentoDigito: false,
      inclusaoPlanilha: false,
    },
    atualizacaoRazaoSocial: "",
    atualizacaoCEP: "",
    atualizacaoLogradouro: "",
    atualizacaoNumero: "",
    atualizacaoBairro: "",
    atualizacaoCidade: "",
    atualizacaoUF: "",
    ocorrenciasFaturamento: {
      atrasoFatura: false,
      alteracaoVencimento: false,
      alteracaoMovimentacao: false,
      inclusaoLink: false,
    },
    novaDataVencimento: "",
    ocorrenciasAtendimento: {
      cobrancaConsultorio: false,
      beneficiarioIntercambio: false,
      recebimentoToken: false,
      dificuldadeRede: false,
    },
    ocorrenciasMovimentacao: { inclusoes: false, exclusoes: false },
    relatoOcorrencias: "",
    totalFuncionariosEmpresa: "",
    totalFuncionariosPlano: "",
    dependentes: "",
    contribuiPlano: "",
    filiaisBeneficio: "",
    planoSaude: "",
    aniversarioContrato: "",
    utilizouClinicaUrgencia: "",
    notaClinicaUrgencia: 0,
    possuiInCompany: "",
    notaInCompany: 0,
    conheceSistemaChamadoSAE: "",
    notaSistemaSAE: 0,
    realizouEventosSaudeBucal: "",
    notaEventosSaudeBucal: 0,
    mesSIPAT: "",
    canalRHSelecionado: "",
    canalRHOutros: "",
    canalDentalUniSelecionado: "",
    canalDentalUniEmailEspecifico: "",
    canalDentalUniWhatsappEspecifico: "",
    canalDentalUniTelefoneEspecifico: "",
    canalDentalUniOutrosEspecifico: "",
    observacoes: "",
    filiais: [{ id: Date.now(), cidadeUF: "", numFuncionarios: "" }],
    responsaveis: [
      {
        id: Date.now(),
        cargo: "",
        nome: "",
        cpf: "",
        dataAniversario: "",
        telefone: "",
        whatsApp: "",
        email: "",
        timeTorce: "",
      },
    ],
    contatos: [
      {
        id: Date.now(),
        departamento: "",
        outroDepartamento: "",
        nome: "",
        email: "",
        telefone: "",
        whatsApp: "",
      },
    ],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const ocorrenciasCadastralLabels = {
    atualizacaoCadastral: "Atualização Cadastral",
    insencaoCarencia: "Insenção de Carência",
    cancelamentoDigito: "Cancelamento de Dígito",
    inclusaoPlanilha: "Inclusão via Planilha",
  };
  const ocorrenciasFaturamentoLabels = {
    atrasoFatura: "Atraso na fatura",
    alteracaoVencimento: "Alteração de vencimento",
    alteracaoMovimentacao: "Alteração de movimentação",
    inclusaoLink: "Inclusão via link",
  };
  const ocorrenciasAtendimentoLabels = {
    cobrancaConsultorio: "Cobrança em consultório",
    beneficiarioIntercambio: "Beneficiário Intercâmbio - Life",
    recebimentoToken: "Recebimento de token",
    dificuldadeRede: "Dificuldade em localizar rede",
  };
  const ocorrenciasMovimentacaoLabels = {
    inclusoes: "Inclusões",
    exclusoes: "Exclusões",
  };
  const canalRHOptions = [
    { value: "email", label: "E-mail" },
    { value: "muralIntranet", label: "Mural/Intranet" },
    { value: "whatsapp", label: "Whatsapp" },
    { value: "outros", label: "Outros" },
  ];
  const canalDentalUniOptions = [
    { value: "email", label: "E-mail" },
    { value: "whatsapp", label: "Whatsapp" },
    { value: "telefone", label: "Telefone" },
    { value: "outros", label: "Outros" },
  ];
  const allLabelsForHtml = {
    motivoVisitaOptions,
    ocorrenciasCadastralLabels,
    ocorrenciasFaturamentoLabels,
    ocorrenciasAtendimentoLabels,
    ocorrenciasMovimentacaoLabels,
    canalRHOptions,
    canalDentalUniOptions,
  };

  const handleSpecificRatingChange = (field, newRating) => {
    setFormData((prevData) => ({ ...prevData, [field]: newRating }));
  };
  const RatingStars = ({ ratingField, currentRating }) => (
    <div className="rating-stars-horizontal">
      {" "}
      <label className="rating-label">Nota:</label>{" "}
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={star <= currentRating ? "star-selected" : "star-empty"}
          onClick={() => handleSpecificRatingChange(ratingField, star)}
        />
      ))}{" "}
    </div>
  );

  const fetchAddressByCep = useCallback(async (cepToSearch) => {
    const cepNumerico = cepToSearch.replace(/\D/g, "");
    if (cepNumerico.length !== 8) {
      if (cepNumerico.trim() !== "") {
        setCepError("CEP deve conter 8 dígitos.");
      } else {
        setCepError("");
      }
      setFormData((prev) => ({
        ...prev,
        atualizacaoLogradouro: "",
        atualizacaoBairro: "",
        atualizacaoCidade: "",
        atualizacaoUF: "",
      }));
      return;
    }
    setCepLoading(true);
    setCepError("");
    try {
      const response = await fetch(
        `https://api.dentaluni.com.br/cep/buscar/${cepNumerico}`
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || `Erro ao buscar CEP (${response.status})`
        );
      }
      if (data.erro || !data.cep) {
        setCepError("CEP não encontrado.");
        setFormData((prev) => ({
          ...prev,
          atualizacaoLogradouro: "",
          atualizacaoBairro: "",
          atualizacaoCidade: "",
          atualizacaoUF: "",
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          atualizacaoLogradouro: data.logradouro || "",
          atualizacaoBairro: data.bairro || "",
          atualizacaoCidade: data.cidade || "",
          atualizacaoUF: data.uf || "",
        }));
      }
    } catch (error) {
      console.error("Falha ao buscar CEP:", error);
      setCepError(error.message || "Falha ao conectar com a API de CEP.");
      setFormData((prev) => ({
        ...prev,
        atualizacaoLogradouro: "",
        atualizacaoBairro: "",
        atualizacaoCidade: "",
        atualizacaoUF: "",
      }));
    } finally {
      setCepLoading(false);
    }
  }, []);

  useEffect(() => {
    if (formData.ocorrenciasCadastral.atualizacaoCadastral) {
      const cepNumerico = formData.atualizacaoCEP.replace(/\D/g, "");
      if (cepNumerico.length === 8) {
        fetchAddressByCep(cepNumerico);
      } else if (
        cepNumerico.trim() === "" &&
        formData.atualizacaoLogradouro.trim() === ""
      ) {
        setCepError("");
      }
    }
  }, [
    formData.atualizacaoCEP,
    formData.ocorrenciasCadastral.atualizacaoCadastral,
    fetchAddressByCep,
  ]);

  const handleInputChange = (event) => {
    const { name, value, type } = event.target;
    let newValue = value;
    if (name === "atualizacaoCEP") {
      newValue = value.replace(/\D/g, "");
      if (newValue.length > 8) {
        newValue = newValue.slice(0, 8);
      }
    } else if (type === "number" && name === "novaDataVencimento") {
      const numValue = parseInt(value, 10);
      if (value === "" || value === null) {
        newValue = "";
      } else if (!isNaN(numValue) && numValue >= 1 && numValue <= 31) {
        newValue = numValue;
      } else if (!isNaN(numValue)) {
        newValue = formData.novaDataVencimento;
      } else {
        newValue = "";
      }
    } else if (type === "number") {
      newValue = value === "" ? "" : parseInt(value, 10) || "";
    }
    setFormData((prevData) => ({ ...prevData, [name]: newValue }));
  };

  const handleCheckboxGroupChange = (event) => {
    const { name, checked, dataset } = event.target;
    const group = dataset.group;

    if (group === "ocorrenciasCadastral" && name === "atualizacaoCadastral") {
      if (checked) {
        const companyName = localStorage.getItem("selectedCompanyName") || "";
        const companyCep = (
          localStorage.getItem("selectedCompanyCep") || ""
        ).replace(/\D/g, "");
        const companyLogradouro =
          localStorage.getItem("selectedCompanyLogradouro") || "";
        const companyNumero =
          localStorage.getItem("selectedCompanyNumero") || "";
        const companyBairro =
          localStorage.getItem("selectedCompanyBairro") || "";
        const companyCidade =
          localStorage.getItem("selectedCompanyCidade") || "";
        const companyUf = localStorage.getItem("selectedCompanyUf") || "";

        
        setFormData((prevData) => ({
          ...prevData,
          ocorrenciasCadastral: {
            ...prevData.ocorrenciasCadastral,
            [name]: true,
          },
          atualizacaoRazaoSocial: companyName,
          atualizacaoCEP: companyCep, 
          atualizacaoLogradouro: companyLogradouro, 
          atualizacaoNumero: companyNumero, 
          atualizacaoBairro: companyBairro, 
          atualizacaoCidade: companyCidade, 
          atualizacaoUF: companyUf, 
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          ocorrenciasCadastral: {
            ...prevData.ocorrenciasCadastral,
            [name]: false,
          },
          atualizacaoRazaoSocial: "",
          atualizacaoCEP: "",
          atualizacaoLogradouro: "",
          atualizacaoNumero: "",
          atualizacaoBairro: "",
          atualizacaoCidade: "",
          atualizacaoUF: "",
          cepError: "",
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [group]: { ...prevData[group], [name]: checked },
      }));
    }
  };

  const handleCepBlur = (event) => {
    const cepValue = event.target.value.replace(/\D/g, "");
    if (
      formData.ocorrenciasCadastral.atualizacaoCadastral &&
      cepValue.length === 8
    ) {
      if (cepValue !== formData.atualizacaoCEP.replace(/\D/g, "")) {
        fetchAddressByCep(cepValue);
      }
    } else if (cepValue.length !== 8 && cepValue.trim() !== "") {
      setCepError("CEP deve conter 8 dígitos.");
      setFormData((prev) => ({
        ...prev,
        atualizacaoLogradouro: "",
        atualizacaoBairro: "",
        atualizacaoCidade: "",
        atualizacaoUF: "",
      }));
    } else if (cepValue.trim() === "") {
      setCepError("");
      setFormData((prev) => ({
        ...prev,
        atualizacaoLogradouro: "",
        atualizacaoBairro: "",
        atualizacaoCidade: "",
        atualizacaoUF: "",
      }));
    }
  };

  const handleFilialChange = (id, event) => {
    /* ... */ setFormData((prevData) => ({
      ...prevData,
      filiais: prevData.filiais.map((filial) =>
        filial.id === id
          ? { ...filial, [event.target.name]: event.target.value }
          : filial
      ),
    }));
  };
  const handleAddFilial = () => {
    /* ... */ setFormData((prevData) => ({
      ...prevData,
      filiais: [
        ...prevData.filiais,
        { id: Date.now(), cidadeUF: "", numFuncionarios: "" },
      ],
    }));
  };
  const handleRemoveFilial = (id) => {
    /* ... */ setFormData((prevData) => ({
      ...prevData,
      filiais: prevData.filiais.filter((filial) => filial.id !== id),
    }));
  };
  const handleResponsavelChange = (id, event) => {
    /* ... */ setFormData((prevData) => ({
      ...prevData,
      responsaveis: prevData.responsaveis.map((responsavel) =>
        responsavel.id === id
          ? { ...responsavel, [event.target.name]: event.target.value }
          : responsavel
      ),
    }));
  };
  const handleAddResponsavel = () => {
    /* ... */ setFormData((prevData) => ({
      ...prevData,
      responsaveis: [
        ...prevData.responsaveis,
        {
          id: Date.now(),
          cargo: "",
          nome: "",
          cpf: "",
          dataAniversario: "",
          telefone: "",
          whatsApp: "",
          email: "",
          timeTorce: "",
        },
      ],
    }));
  };
  const handleRemoveResponsavel = (id) => {
    /* ... */ setFormData((prevData) => ({
      ...prevData,
      responsaveis: prevData.responsaveis.filter(
        (responsavel) => responsavel.id !== id
      ),
    }));
  };
  const handleContatoChange = (id, event) => {
    /* ... */ setFormData((prevData) => ({
      ...prevData,
      contatos: prevData.contatos.map((contato) =>
        contato.id === id
          ? { ...contato, [event.target.name]: event.target.value }
          : contato
      ),
    }));
  };
  const handleAddContato = () => {
    /* ... */ setFormData((prevData) => ({
      ...prevData,
      contatos: [
        ...prevData.contatos,
        {
          id: Date.now(),
          departamento: "",
          outroDepartamento: "",
          nome: "",
          email: "",
          telefone: "",
          whatsApp: "",
        },
      ],
    }));
  };
  const handleRemoveContato = (id) => {
setFormData((prevData) => ({
      ...prevData,
      contatos: prevData.contatos.filter((contato) => contato.id !== id),
    }));
  };
  const formatDataToHtml = (data, labels) => {

    const corDentalUni = "#ac1815";
    let html = `<h1 style="color: ${corDentalUni}; font-family: Arial, sans-serif; text-align: center;"></h1>`;
    let sectionsAdded = 0;
    const addSection = (title, content) => {
      if (content && String(content).trim() !== "") {
        if (sectionsAdded > 0) {
          html +=
            '<hr style="border: 0; border-top: 1px solid #ccc; margin: 25px 0;">';
        }
        html += `<h3 style="color: ${corDentalUni}; font-family: Arial, sans-serif; margin-top: 20px; margin-bottom: 10px;">${title}</h3><div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6;">${content}</div>`;
        sectionsAdded++;
      }
    };
    const addField = (label, value) => {
      let displayValue = String(value).trim();
      if (
        label.toLowerCase().includes("nota") &&
        (displayValue === "0" || displayValue === "")
      ) {
        return "";
      }
      return value !== undefined && value !== null && displayValue !== ""
        ? `<p style="margin: 5px 0; padding-left:10px; word-break: break-word;"><strong>${label}:</strong> ${displayValue.replace(
            /\n/g,
            "<br>"
          )}</p>`
        : "";
    };
    const addCheckboxGroup = (groupTitle, groupData, groupLabels) => {
      let groupHtml = "";
      const selectedItems = Object.keys(groupData).filter(
        (key) => groupData[key]
      );
      if (selectedItems.length > 0) {
        groupHtml += `<p style="margin: 8px 0; padding-left:10px;"><strong>${groupTitle}:</strong></p><ul style="margin-top:0; padding-left: 30px; list-style-type: disc;">`;
        selectedItems.forEach((key) => {
          groupHtml += `<li>${groupLabels[key] || key}</li>`;
        });
        groupHtml += `</ul>`;
      }
      return groupHtml;
    };
    const motivoSelecionadoObj = labels.motivoVisitaOptions.find(
      (opt) => opt.value === data.motivoVisita
    );
    let motivoPrincipalLabel = motivoSelecionadoObj
      ? motivoSelecionadoObj.label
      : data.motivoVisita;
    let motivoContent = addField("Motivo Principal", motivoPrincipalLabel);
    if (
      data.motivoVisita === "343" &&
      data.motivoVisitaOutros &&
      data.motivoVisitaOutros.trim() !== ""
    ) {
      motivoContent += addField(
        "Outro Motivo Especificado",
        data.motivoVisitaOutros
      );
    }
    addSection("Motivo da Visita", motivoContent);
    let ocorrenciasContent = addCheckboxGroup(
      "Cadastral",
      data.ocorrenciasCadastral,
      labels.ocorrenciasCadastralLabels
    );
    ocorrenciasContent += addCheckboxGroup(
      "Faturamento",
      data.ocorrenciasFaturamento,
      labels.ocorrenciasFaturamentoLabels
    );
    ocorrenciasContent += addCheckboxGroup(
      "Atendimento",
      data.ocorrenciasAtendimento,
      labels.ocorrenciasAtendimentoLabels
    );
    ocorrenciasContent += addCheckboxGroup(
      "Movimentação",
      data.ocorrenciasMovimentacao,
      labels.ocorrenciasMovimentacaoLabels
    );
    if (data.ocorrenciasFaturamento.alteracaoVencimento) {
      ocorrenciasContent += addField(
        "Novo Dia de Vencimento",
        data.novaDataVencimento
      );
    }
    ocorrenciasContent += addField(
      "Relato das Ocorrências",
      data.relatoOcorrencias
    );
    addSection("Ocorrências", ocorrenciasContent);
    if (data.ocorrenciasCadastral.atualizacaoCadastral) {
      let atualizacaoHtml =
        addField("Razão Social", data.atualizacaoRazaoSocial) +
        addField("CEP", data.atualizacaoCEP) +
        addField("Logradouro", data.atualizacaoLogradouro) +
        addField("Número", data.atualizacaoNumero) +
        addField("Bairro", data.atualizacaoBairro) +
        addField("Cidade", data.atualizacaoCidade) +
        addField("UF", data.atualizacaoUF);
      addSection("Dados da Atualização Cadastral", atualizacaoHtml);
    }
    let pesquisaHtml =
      addField(
        "Total de Funcionários na Empresa (Potencial)",
        data.totalFuncionariosEmpresa
      ) +
      addField(
        "Total de Funcionários no Plano DentalUni",
        data.totalFuncionariosPlano
      ) +
      addField(
        "Permite Inclusão de Dependentes (Parentesco)",
        data.dependentes
      ) +
      addField("Empresa Contribui com Plano (%)", data.contribuiPlano) +
      addField("Filiais Sem Benefício (Cidade)", data.filiaisBeneficio) +
      addField("Possui Plano de Saúde (Operadora)", data.planoSaude) +
      addField("Aniversário Contrato Plano de Saúde", data.aniversarioContrato);
    addSection("Pesquisa e Atualizações da Empresa", pesquisaHtml);
    if (
      data.filiais &&
      data.filiais.some(
        (f) => String(f.cidadeUF).trim() || String(f.numFuncionarios).trim()
      )
    ) {
      let filiaisHtml = "<ul style='list-style-type: none; padding-left: 0;'>";
      data.filiais.forEach((f, i) => {
        if (String(f.cidadeUF).trim() || String(f.numFuncionarios).trim()) {
          filiaisHtml += `<li style="margin-bottom: 10px; border-top: 1px solid #eee; padding-top: 10px; margin-left:10px"><h4>Filial ${
            i + 1
          }</h4>${addField("Cidade/UF", f.cidadeUF)}${addField(
            "Nº de Funcionários",
            f.numFuncionarios
          )}</li>`;
        }
      });
      filiaisHtml += "</ul>";
      addSection("Filiais", filiaisHtml);
    }
    if (
      data.responsaveis &&
      data.responsaveis.some(
        (r) => String(r.nome).trim() || String(r.cargo).trim()
      )
    ) {
      let respHtml = "";
      data.responsaveis.forEach((r, i) => {
        if (String(r.nome).trim() || String(r.cargo).trim()) {
          const cargoLabels = {
            representanteComercial: "Representante Comercial",
            diretorEmpresa: "Diretor da Empresa",
            representanteLegal: "Representante Legal",
            proprietario: "Proprietário(a)",
            socio: "Sócio(a)",
            rh: "RH",
            financeiro: "Financeiro",
            compras: "Compras",
            outros: "Outros",
          };
          respHtml +=
            `<div style="margin-bottom: 15px; border-top: 1px solid #eee; padding-top: 10px; margin-left:10px"><h4>Responsável ${
              i + 1
            }</h4>` +
            addField("Cargo", cargoLabels[r.cargo] || r.cargo) +
            addField("Nome", r.nome) +
            addField("CPF", r.cpf) +
            addField("Data de Aniversário", r.dataAniversario) +
            addField("Telefone", r.telefone) +
            addField("WhatsApp", r.whatsApp) +
            addField("E-mail", r.email) +
            addField("Time que Torce (Camarote Arena)", r.timeTorce) +
            `</div>`;
        }
      });
      addSection("Responsáveis Adicionados", respHtml);
    }
    if (
      data.contatos &&
      data.contatos.some(
        (c) => String(c.nome).trim() || String(c.departamento).trim()
      )
    ) {
      let contatosHtml = "";
      data.contatos.forEach((c, i) => {
        if (String(c.nome).trim() || String(c.departamento).trim()) {
          let deptoDisplay = c.departamento;
          const deptoLabels = {
            financeiro: "Financeiro",
            rh: "RH",
            compras: "Compras",
            diretoria: "Diretoria",
            outros: "Outros",
          };
          if (
            c.departamento === "outros" &&
            String(c.outroDepartamento).trim()
          ) {
            deptoDisplay = `Outros (${c.outroDepartamento})`;
          } else {
            deptoDisplay =
              deptoLabels[c.departamento] ||
              c.departamento.charAt(0).toUpperCase() + c.departamento.slice(1);
          }
          contatosHtml +=
            `<div style="margin-bottom: 15px; border-top: 1px solid #eee; padding-top: 10px; margin-left:10px"><h4>Contato ${
              i + 1
            }</h4>` +
            addField("Departamento", deptoDisplay) +
            addField("Nome", c.nome) +
            addField("E-mail", c.email) +
            addField("Telefone", c.telefone) +
            addField("WhatsApp", c.whatsApp) +
            `</div>`;
        }
      });
      addSection("Contatos Adicionados", contatosHtml);
    }
    let questoesHtml = addField(
      "Utilizou Clínica de Urgência DentalUni",
      data.utilizouClinicaUrgencia === "sim"
        ? "Sim"
        : data.utilizouClinicaUrgencia === "nao"
        ? "Não"
        : ""
    );
    if (data.utilizouClinicaUrgencia === "sim")
      questoesHtml += addField(
        "Nota Clínica de Urgência",
        data.notaClinicaUrgencia ? `${data.notaClinicaUrgencia} estrela(s)` : ""
      );
    questoesHtml += addField(
      "Possui In Company",
      data.possuiInCompany === "sim"
        ? "Sim"
        : data.possuiInCompany === "nao"
        ? "Não"
        : ""
    );
    if (data.possuiInCompany === "sim")
      questoesHtml += addField(
        "Nota In Company",
        data.notaInCompany ? `${data.notaInCompany} estrela(s)` : ""
      );
    questoesHtml += addField(
      "Conhece Sistema de Chamado (SAE)",
      data.conheceSistemaChamadoSAE === "sim"
        ? "Sim"
        : data.conheceSistemaChamadoSAE === "nao"
        ? "Não"
        : ""
    );
    if (data.conheceSistemaChamadoSAE === "sim")
      questoesHtml += addField(
        "Nota Sistema SAE",
        data.notaSistemaSAE ? `${data.notaSistemaSAE} estrela(s)` : ""
      );
    questoesHtml += addField(
      "Realizou Eventos de Saúde Bucal",
      data.realizouEventosSaudeBucal === "sim"
        ? "Sim"
        : data.realizouEventosSaudeBucal === "nao"
        ? "Não"
        : ""
    );
    if (data.realizouEventosSaudeBucal === "sim")
      questoesHtml += addField(
        "Nota Eventos Saúde Bucal",
        data.notaEventosSaudeBucal
          ? `${data.notaEventosSaudeBucal} estrela(s)`
          : ""
      );
    questoesHtml += addField("Realiza Semana SIPAT (Mês)", data.mesSIPAT);
    addSection("Questões Adicionais", questoesHtml);
    let canaisHtml = "";
    let canalRhDisplay =
      labels.canalRHOptions.find((opt) => opt.value === data.canalRHSelecionado)
        ?.label || data.canalRHSelecionado;
    if (
      data.canalRHSelecionado === "outros" &&
      data.canalRHOutros &&
      data.canalRHOutros.trim() !== ""
    ) {
      canalRhDisplay += `: ${data.canalRHOutros.trim()}`;
    }
    canaisHtml += addField(
      "Canal de Comunicação RH com Funcionário",
      canalRhDisplay
    );
    let canalDentalUniDisplay =
      labels.canalDentalUniOptions.find(
        (opt) => opt.value === data.canalDentalUniSelecionado
      )?.label || data.canalDentalUniSelecionado;
    if (
      data.canalDentalUniSelecionado === "email" &&
      data.canalDentalUniEmailEspecifico
    )
      canalDentalUniDisplay += `: ${data.canalDentalUniEmailEspecifico}`;
    else if (
      data.canalDentalUniSelecionado === "whatsapp" &&
      data.canalDentalUniWhatsappEspecifico
    )
      canalDentalUniDisplay += `: ${data.canalDentalUniWhatsappEspecifico}`;
    else if (
      data.canalDentalUniSelecionado === "telefone" &&
      data.canalDentalUniTelefoneEspecifico
    )
      canalDentalUniDisplay += `: ${data.canalDentalUniTelefoneEspecifico}`;
    else if (
      data.canalDentalUniSelecionado === "outros" &&
      data.canalDentalUniOutrosEspecifico
    )
      canalDentalUniDisplay += `: ${data.canalDentalUniOutrosEspecifico}`;
    canaisHtml += addField(
      "Canal de Comunicação DentalUni com Empresa",
      canalDentalUniDisplay
    );
    addSection("Canais de Comunicação", canaisHtml);
    addSection("Observações Finais", addField("", data.observacoes));
    return html;
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    const codigoEmpresaStorage = localStorage.getItem("selectedCompanyId");
    const nomeUsuarioLogado =
      localStorage.getItem("userName") || "Usuário Padrão";
    const idCriadorTicket =
      localStorage.getItem("userId") ||
      localStorage.getItem("userToken") ||
      "ID_PADRAO";
    const codigoEmpresaFinal =
      codigoEmpresaStorage || companyId || "NAO_INFORMADO";
    const htmlMessage = formatDataToHtml(formData, allLabelsForHtml);
    const motivoSelecionado = motivoVisitaOptions.find(
      (opt) => opt.value === formData.motivoVisita
    );
    const assuntoSelecionado = motivoSelecionado
      ? motivoSelecionado.label
      : "Relatório de Visita";
    const apiUrl = "https://api.dentaluni.com.br/sae/atendimento";
    const dadosParaEnviar = {
      codigo: codigoEmpresaFinal,
      dpto: "86",
      tipo: "28",
      status: "1",
      abertura: "26",
      topico: formData.motivoVisita,
      assunto: assuntoSelecionado,
      msg: htmlMessage,
      criador: nomeUsuarioLogado,
      id_criador_ticket: idCriadorTicket,
      mostrar_empresa: "1",
    };
    console.log(
      "Enviando dados via POST:",
      JSON.stringify(dadosParaEnviar, null, 2)
    );
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosParaEnviar),
      });
      const responseData = await response.json();
      if (response.ok && !responseData.error) {
        setSubmitStatus("success");
        setModalMessage(
          responseData.retorno_app ||
            responseData.protocolo ||
            responseData.msg ||
            "Operação realizada com sucesso!"
        );
        setModalVisible(true);
        setFormData(initialFormData);
        window.scrollTo(0, 0);
      } else {
        console.error("Erro da API:", responseData);
        setSubmitStatus("error");
        setModalMessage(
          `Erro ao enviar relatório: ${
            responseData.msg ||
            responseData.protocolo ||
            responseData.retorno_app ||
            `Erro ${response.status} (${response.statusText})`
          }`
        );
        setModalVisible(true);
      }
    } catch (error) {
      console.error("Erro de rede ou na chamada da API:", error);
      setSubmitStatus("error");
      setModalMessage(
        `Erro de conexão: ${error.message}. Verifique sua internet e se a API está acessível.`
      );
      setModalVisible(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleCloseModal = () => {
    /* ... */ setModalVisible(false);
    setModalMessage("");
  };
  const handleHomeClick = () => {
    /* ... */ navigate(`/menu/${companyId || ""}`);
  };
  const handleSearchClick = () => {
    /* ... */ navigate("/pesquisa");
  };
  const handleLogoutClick = () => {
    /* ... */ localStorage.removeItem("userName");
    localStorage.removeItem("userToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userImg");
    localStorage.removeItem("selectedCompanyId");
    localStorage.removeItem("selectedCompanyName");
    localStorage.removeItem("selectedCompanyCnpj");
    localStorage.removeItem("selectedCompanyCep");
    localStorage.removeItem("selectedCompanyLogradouro");
    localStorage.removeItem("selectedCompanyNumero");
    localStorage.removeItem("selectedCompanyBairro");
    localStorage.removeItem("selectedCompanyCidade");
    localStorage.removeItem("selectedCompanyUf");
    navigate("/login");
  };

  return (
    <div className="details-page-layout-v2">
      <AppHeader
        companyIdProp={companyId}
        pageTitle={!companyId ? "Registrar Visita" : undefined}
        isLoadingCompanyInfo={false}
        showCompanyBuildingIcon={!!companyId}
      />
      <main className="new-menu-content-area menu-container">
        <motion.div
          className="register-visit-form-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1>Registrar Visita</h1>
          <form onSubmit={handleSubmit} className="visit-form">
            <fieldset className="form-section">
              <legend>Motivo da Visita</legend>
              <label className="select-label">
                Selecione o motivo principal:
                <select
                  name="motivoVisita"
                  value={formData.motivoVisita}
                  onChange={handleInputChange}
                  className="select-input"
                  required
                >
                  {motivoVisitaOptions.map((option) => (
                    <option
                      key={option.id_topico || "placeholder-motivo"}
                      value={option.value}
                      disabled={option.value === ""}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              {formData.motivoVisita === "343" && (
                <input
                  type="text"
                  name="motivoVisitaOutros"
                  placeholder="Qual outro motivo?"
                  value={formData.motivoVisitaOutros}
                  onChange={handleInputChange}
                  className="detail-input"
                />
              )}
            </fieldset>

            <fieldset className="form-section">
              <legend>Ocorrências</legend>
              <div className="ocorrencias-grid">
                <div className="ocorrencia-coluna">
                  <p className="ocorrencia-titulo">Cadastral</p>
                  <div className="checkbox-group-vertical">
                    {Object.keys(formData.ocorrenciasCadastral).map((key) => (
                      <label key={key}>
                        <input
                          type="checkbox"
                          name={key}
                          data-group="ocorrenciasCadastral"
                          checked={formData.ocorrenciasCadastral[key]}
                          onChange={handleCheckboxGroupChange}
                        />{" "}
                        <span>{ocorrenciasCadastralLabels[key]}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="ocorrencia-coluna">
                  <p className="ocorrencia-titulo">Faturamento</p>
                  <div className="checkbox-group-vertical">
                    {Object.keys(formData.ocorrenciasFaturamento).map((key) => (
                      <label key={key}>
                        <input
                          type="checkbox"
                          name={key}
                          data-group="ocorrenciasFaturamento"
                          checked={formData.ocorrenciasFaturamento[key]}
                          onChange={handleCheckboxGroupChange}
                        />{" "}
                        <span>{ocorrenciasFaturamentoLabels[key]}</span>
                      </label>
                    ))}
                  </div>
                  {formData.ocorrenciasFaturamento.alteracaoVencimento && (
                    <div
                      className="form-field-vertical"
                      style={{ marginTop: "10px" }}
                    >
                      <label>
                        Novo Dia de Vencimento:
                        <input
                          type="number"
                          name="novaDataVencimento"
                          value={formData.novaDataVencimento}
                          onChange={handleInputChange}
                          className="detail-input"
                          placeholder="Dia (1-31)"
                          min="1"
                          max="31"
                        />
                      </label>
                    </div>
                  )}
                </div>
                <div className="ocorrencia-coluna">
                  <p className="ocorrencia-titulo">Atendimento</p>
                  <div className="checkbox-group-vertical">
                    {Object.keys(formData.ocorrenciasAtendimento).map((key) => (
                      <label key={key}>
                        <input
                          type="checkbox"
                          name={key}
                          data-group="ocorrenciasAtendimento"
                          checked={formData.ocorrenciasAtendimento[key]}
                          onChange={handleCheckboxGroupChange}
                        />{" "}
                        <span>{ocorrenciasAtendimentoLabels[key]}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="ocorrencia-coluna">
                  <p className="ocorrencia-titulo">Movimentação</p>
                  <div className="checkbox-group-vertical">
                    {Object.keys(formData.ocorrenciasMovimentacao).map(
                      (key) => (
                        <label key={key}>
                          <input
                            type="checkbox"
                            name={key}
                            data-group="ocorrenciasMovimentacao"
                            checked={formData.ocorrenciasMovimentacao[key]}
                            onChange={handleCheckboxGroupChange}
                          />{" "}
                          <span>{ocorrenciasMovimentacaoLabels[key]}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>
              </div>
              <label className="relato-label">
                Relato:
                <textarea
                  name="relatoOcorrencias"
                  rows="4"
                  value={formData.relatoOcorrencias}
                  onChange={handleInputChange}
                ></textarea>
              </label>
            </fieldset>

            {formData.ocorrenciasCadastral.atualizacaoCadastral && (
              <fieldset className="form-section">
                <legend>Atualização Cadastral</legend>
                <label>
                  Razão Social:
                  <input
                    type="text"
                    name="atualizacaoRazaoSocial"
                    value={formData.atualizacaoRazaoSocial}
                    onChange={handleInputChange}
                    className="detail-input"
                  />
                </label>
                <label>
                  CEP:
                  <input
                    type="text"
                    name="atualizacaoCEP"
                    value={formData.atualizacaoCEP}
                    onChange={handleInputChange}
                    onBlur={handleCepBlur}
                    className="detail-input"
                    placeholder="00000000"
                    maxLength={8}
                  />
                </label>
                {cepLoading && (
                  <p className="loading-feedback">Buscando CEP...</p>
                )}
                {cepError && <p className="error-feedback">{cepError}</p>}
                <label>
                  Logradouro:
                  <input
                    type="text"
                    name="atualizacaoLogradouro"
                    value={formData.atualizacaoLogradouro}
                    onChange={handleInputChange}
                    className="detail-input"
                  />
                </label>
                <label>
                  Número:
                  <input
                    type="text"
                    name="atualizacaoNumero"
                    value={formData.atualizacaoNumero}
                    onChange={handleInputChange}
                    className="detail-input"
                  />
                </label>
                <label>
                  Bairro:
                  <input
                    type="text"
                    name="atualizacaoBairro"
                    value={formData.atualizacaoBairro}
                    onChange={handleInputChange}
                    className="detail-input"
                  />
                </label>
                <label>
                  Cidade:
                  <input
                    type="text"
                    name="atualizacaoCidade"
                    value={formData.atualizacaoCidade}
                    onChange={handleInputChange}
                    className="detail-input"
                  />
                </label>
                <label>
                  UF:
                  <input
                    type="text"
                    name="atualizacaoUF"
                    value={formData.atualizacaoUF}
                    onChange={handleInputChange}
                    className="detail-input"
                    maxLength="2"
                  />
                </label>
              </fieldset>
            )}
            <fieldset className="form-section">
              {" "}
              <legend>Pesquisa e Atualizações</legend>{" "}
              <div className="form-grid pesquisa-grid-single-col">
                {" "}
                <label>
                  Qual o total de funcionários na empresa? (Potencial)
                  <input
                    type="number"
                    name="totalFuncionariosEmpresa"
                    value={formData.totalFuncionariosEmpresa}
                    onChange={handleInputChange}
                  />
                </label>{" "}
                <label>
                  Total de Funcionários no Plano DentalUni?
                  <input
                    type="number"
                    name="totalFuncionariosPlano"
                    value={formData.totalFuncionariosPlano}
                    onChange={handleInputChange}
                  />
                </label>{" "}
                <div className="dynamic-field-section">
                  {" "}
                  <label className="dynamic-field-label">
                    Filiais (Cidade/UF | Nº de Funcionários):
                  </label>{" "}
                  {formData.filiais.map((filial) => (
                    <div key={filial.id} className="filial-entry">
                      {" "}
                      <input
                        type="text"
                        name="cidadeUF"
                        placeholder="Cidade/UF"
                        value={filial.cidadeUF}
                        onChange={(e) => handleFilialChange(filial.id, e)}
                        className="filial-input city-input"
                      />{" "}
                      <input
                        type="number"
                        name="numFuncionarios"
                        placeholder="Nº Funcionários"
                        value={filial.numFuncionarios}
                        onChange={(e) => handleFilialChange(filial.id, e)}
                        className="filial-input count-input"
                      />{" "}
                      {formData.filiais.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFilial(filial.id)}
                          className="remove-filial-btn"
                          aria-label="Remover Filial"
                        >
                          <FaTrash />
                        </button>
                      )}{" "}
                    </div>
                  ))}{" "}
                  <button
                    type="button"
                    onClick={handleAddFilial}
                    className="add-filial-btn"
                  >
                    <FaPlus /> Adicionar Filial
                  </button>{" "}
                </div>{" "}
                <label>
                  Permite a inclusão de dependentes no plano? (Especifique o
                  parentesco)
                  <input
                    type="text"
                    name="dependentes"
                    value={formData.dependentes}
                    onChange={handleInputChange}
                  />
                </label>{" "}
                <label>
                  Empresa contribui com o valor do plano? Qual o (%)?
                  <input
                    type="text"
                    name="contribuiPlano"
                    value={formData.contribuiPlano}
                    onChange={handleInputChange}
                  />
                </label>{" "}
                <label>
                  Possui filiais que não tenham o benefício? Qual cidade?
                  <input
                    type="text"
                    name="filiaisBeneficio"
                    value={formData.filiaisBeneficio}
                    onChange={handleInputChange}
                  />
                </label>{" "}
                <label>
                  Possui plano de saúde? Qual operadora?
                  <input
                    type="text"
                    name="planoSaude"
                    value={formData.planoSaude}
                    onChange={handleInputChange}
                  />
                </label>{" "}
                <label>
                  Data de aniversário de contrato do plano de saúde?
                  <input
                    type="text"
                    name="aniversarioContrato"
                    value={formData.aniversarioContrato}
                    onChange={handleInputChange}
                    placeholder="DD/MM ou MM/AAAA"
                  />
                </label>{" "}
              </div>{" "}
            </fieldset>
            <fieldset className="form-section">
              {" "}
              <legend>Adicionar Responsáveis</legend>{" "}
              {formData.responsaveis.map((responsavel, index) => (
                <div
                  key={responsavel.id}
                  className="dynamic-entry responsavel-entry"
                  style={{
                    borderBottom: "1px solid #eee",
                    marginBottom: "15px",
                    paddingBottom: "15px",
                  }}
                >
                  {" "}
                  <h4>Responsável {index + 1}</h4>{" "}
                  <label className="select-label">
                    Cargo:{" "}
                    <select
                      name="cargo"
                      value={responsavel.cargo}
                      onChange={(e) =>
                        handleResponsavelChange(responsavel.id, e)
                      }
                      className="select-input"
                    >
                      {" "}
                      <option value="">Selecione...</option>
                      <option value="representanteComercial">
                        Representante Comercial
                      </option>
                      <option value="diretorEmpresa">Diretor da Empresa</option>
                      <option value="representanteLegal">
                        Representante Legal
                      </option>
                      <option value="proprietario">Proprietário(a)</option>
                      <option value="socio">Sócio(a)</option>
                      <option value="rh">RH</option>
                      <option value="financeiro">Financeiro</option>
                      <option value="compras">Compras</option>
                      <option value="outros">Outros</option>{" "}
                    </select>{" "}
                  </label>{" "}
                  <label>
                    Nome:
                    <input
                      type="text"
                      name="nome"
                      value={responsavel.nome}
                      onChange={(e) =>
                        handleResponsavelChange(responsavel.id, e)
                      }
                      className="detail-input"
                    />
                  </label>{" "}
                  <label>
                    CPF:
                    <input
                      type="text"
                      name="cpf"
                      value={responsavel.cpf}
                      onChange={(e) =>
                        handleResponsavelChange(responsavel.id, e)
                      }
                      className="detail-input"
                      placeholder="000.000.000-00"
                    />
                  </label>{" "}
                  <label>
                    Data de Aniversário:
                    <input
                      type="date"
                      name="dataAniversario"
                      value={responsavel.dataAniversario}
                      onChange={(e) =>
                        handleResponsavelChange(responsavel.id, e)
                      }
                      className="detail-input"
                    />
                  </label>{" "}
                  <label>
                    Telefone:
                    <input
                      type="tel"
                      name="telefone"
                      value={responsavel.telefone}
                      onChange={(e) =>
                        handleResponsavelChange(responsavel.id, e)
                      }
                      className="detail-input"
                      placeholder="(00) 00000-0000"
                    />
                  </label>{" "}
                  <label>
                    WhatsApp:
                    <input
                      type="tel"
                      name="whatsApp"
                      value={responsavel.whatsApp}
                      onChange={(e) =>
                        handleResponsavelChange(responsavel.id, e)
                      }
                      className="detail-input"
                      placeholder="(00) 00000-0000"
                    />
                  </label>{" "}
                  <label>
                    Email:
                    <input
                      type="email"
                      name="email"
                      value={responsavel.email}
                      onChange={(e) =>
                        handleResponsavelChange(responsavel.id, e)
                      }
                      className="detail-input"
                    />
                  </label>{" "}
                  <label>
                    Qual time torce? (Camarote Arena)
                    <input
                      type="text"
                      name="timeTorce"
                      value={responsavel.timeTorce}
                      onChange={(e) =>
                        handleResponsavelChange(responsavel.id, e)
                      }
                      className="detail-input"
                    />
                  </label>{" "}
                  {formData.responsaveis.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveResponsavel(responsavel.id)}
                      className="remove-filial-btn"
                      style={{ marginTop: "10px" }}
                      aria-label="Remover Responsável"
                    >
                      <FaTrash /> Remover Responsável {index + 1}
                    </button>
                  )}{" "}
                </div>
              ))}{" "}
              <button
                type="button"
                onClick={handleAddResponsavel}
                className="add-filial-btn"
              >
                <FaPlus /> Adicionar Responsável
              </button>{" "}
            </fieldset>
            <fieldset className="form-section">
              {" "}
              <legend>
                Adicionar Contatos (Pessoas que falam com a DentalUni)
              </legend>{" "}
              {formData.contatos.map((contato, index) => (
                <div
                  key={contato.id}
                  className="dynamic-entry contato-entry"
                  style={{
                    borderBottom: "1px solid #eee",
                    marginBottom: "15px",
                    paddingBottom: "15px",
                  }}
                >
                  {" "}
                  <h4>Contato {index + 1}</h4>{" "}
                  <label className="select-label">
                    Departamento:{" "}
                    <select
                      name="departamento"
                      value={contato.departamento}
                      onChange={(e) => handleContatoChange(contato.id, e)}
                      className="select-input"
                    >
                      {" "}
                      <option value="">Selecione...</option>
                      <option value="financeiro">Financeiro</option>
                      <option value="rh">RH</option>
                      <option value="compras">Compras</option>
                      <option value="diretoria">Diretoria</option>
                      <option value="outros">Outros</option>{" "}
                    </select>{" "}
                  </label>{" "}
                  {contato.departamento === "outros" && (
                    <label style={{ marginTop: "5px" }}>
                      Descreva o Departamento:
                      <input
                        type="text"
                        name="outroDepartamento"
                        value={contato.outroDepartamento}
                        onChange={(e) => handleContatoChange(contato.id, e)}
                        className="detail-input"
                        placeholder="Ex: Marketing"
                        style={{ marginTop: "2px" }}
                      />
                    </label>
                  )}{" "}
                  <label style={{ marginTop: "10px" }}>
                    Nome:
                    <input
                      type="text"
                      name="nome"
                      value={contato.nome}
                      onChange={(e) => handleContatoChange(contato.id, e)}
                      className="detail-input"
                    />
                  </label>{" "}
                  <label>
                    Email:
                    <input
                      type="email"
                      name="email"
                      value={contato.email}
                      onChange={(e) => handleContatoChange(contato.id, e)}
                      className="detail-input"
                    />
                  </label>{" "}
                  <label>
                    Telefone:
                    <input
                      type="tel"
                      name="telefone"
                      value={contato.telefone}
                      onChange={(e) => handleContatoChange(contato.id, e)}
                      className="detail-input"
                      placeholder="(00) 00000-0000"
                    />
                  </label>{" "}
                  <label>
                    WhatsApp:
                    <input
                      type="tel"
                      name="whatsApp"
                      value={contato.whatsApp}
                      onChange={(e) => handleContatoChange(contato.id, e)}
                      className="detail-input"
                      placeholder="(00) 00000-0000"
                    />
                  </label>{" "}
                  {formData.contatos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveContato(contato.id)}
                      className="remove-filial-btn"
                      style={{ marginTop: "10px" }}
                      aria-label="Remover Contato"
                    >
                      <FaTrash /> Remover Contato {index + 1}
                    </button>
                  )}{" "}
                </div>
              ))}{" "}
              <button
                type="button"
                onClick={handleAddContato}
                className="add-filial-btn"
              >
                <FaPlus /> Adicionar Contato
              </button>{" "}
            </fieldset>
            <fieldset className="form-section">
              {" "}
              <legend>Questões Adicionais</legend>{" "}
              <div className="additional-questions-column">
                {" "}
                <div className="question-block">
                  {" "}
                  <p className="question-title">
                    Já utilizou a Clínica de urgência da DentalUni?
                  </p>{" "}
                  <div className="radio-group-horizontal">
                    {" "}
                    <label>
                      <input
                        type="radio"
                        name="utilizouClinicaUrgencia"
                        value="sim"
                        checked={formData.utilizouClinicaUrgencia === "sim"}
                        onChange={handleInputChange}
                      />
                      <span>Sim</span>
                    </label>{" "}
                    <label>
                      <input
                        type="radio"
                        name="utilizouClinicaUrgencia"
                        value="nao"
                        checked={formData.utilizouClinicaUrgencia === "nao"}
                        onChange={handleInputChange}
                      />
                      <span>Não</span>
                    </label>{" "}
                  </div>{" "}
                  {formData.utilizouClinicaUrgencia === "sim" && (
                    <RatingStars
                      ratingField="notaClinicaUrgencia"
                      currentRating={formData.notaClinicaUrgencia}
                    />
                  )}{" "}
                </div>{" "}
                <div className="question-block">
                  {" "}
                  <p className="question-title">Possui In Company?</p>{" "}
                  <div className="radio-group-horizontal">
                    {" "}
                    <label>
                      <input
                        type="radio"
                        name="possuiInCompany"
                        value="sim"
                        checked={formData.possuiInCompany === "sim"}
                        onChange={handleInputChange}
                      />
                      <span>Sim</span>
                    </label>{" "}
                    <label>
                      <input
                        type="radio"
                        name="possuiInCompany"
                        value="nao"
                        checked={formData.possuiInCompany === "nao"}
                        onChange={handleInputChange}
                      />
                      <span>Não</span>
                    </label>{" "}
                  </div>{" "}
                  {formData.possuiInCompany === "sim" && (
                    <RatingStars
                      ratingField="notaInCompany"
                      currentRating={formData.notaInCompany}
                    />
                  )}{" "}
                </div>{" "}
                <div className="question-block">
                  {" "}
                  <p className="question-title">
                    Conhece o sistema para abrir chamado (SAE Atendimento)?
                  </p>{" "}
                  <div className="radio-group-horizontal">
                    {" "}
                    <label>
                      <input
                        type="radio"
                        name="conheceSistemaChamadoSAE"
                        value="sim"
                        checked={formData.conheceSistemaChamadoSAE === "sim"}
                        onChange={handleInputChange}
                      />
                      <span>Sim</span>
                    </label>{" "}
                    <label>
                      <input
                        type="radio"
                        name="conheceSistemaChamadoSAE"
                        value="nao"
                        checked={formData.conheceSistemaChamadoSAE === "nao"}
                        onChange={handleInputChange}
                      />
                      <span>Não</span>
                    </label>{" "}
                  </div>{" "}
                  {formData.conheceSistemaChamadoSAE === "sim" && (
                    <RatingStars
                      ratingField="notaSistemaSAE"
                      currentRating={formData.notaSistemaSAE}
                    />
                  )}{" "}
                </div>{" "}
                <div className="question-block">
                  {" "}
                  <p className="question-title">
                    Já realizou eventos relacionados a Saúde Bucal?
                  </p>{" "}
                  <div className="radio-group-horizontal">
                    {" "}
                    <label>
                      <input
                        type="radio"
                        name="realizouEventosSaudeBucal"
                        value="sim"
                        checked={formData.realizouEventosSaudeBucal === "sim"}
                        onChange={handleInputChange}
                      />
                      <span>Sim</span>
                    </label>{" "}
                    <label>
                      <input
                        type="radio"
                        name="realizouEventosSaudeBucal"
                        value="nao"
                        checked={formData.realizouEventosSaudeBucal === "nao"}
                        onChange={handleInputChange}
                      />
                      <span>Não</span>
                    </label>{" "}
                  </div>{" "}
                  {formData.realizouEventosSaudeBucal === "sim" && (
                    <RatingStars
                      ratingField="notaEventosSaudeBucal"
                      currentRating={formData.notaEventosSaudeBucal}
                    />
                  )}{" "}
                </div>{" "}
                <div className="question-block sipat-question">
                  {" "}
                  <label>
                    Realiza semana de SIPAT? Qual mês?
                    <input
                      type="text"
                      name="mesSIPAT"
                      value={formData.mesSIPAT}
                      onChange={handleInputChange}
                      placeholder="Ex: Outubro"
                    />
                  </label>{" "}
                </div>{" "}
              </div>{" "}
            </fieldset>
            <fieldset className="form-section">
              {" "}
              <legend>
                Qual o canal de comunicação do RH com o funcionário?
              </legend>{" "}
              <div className="radio-group-vertical">
                {" "}
                {canalRHOptions.map((option) => (
                  <label key={option.value}>
                    <input
                      type="radio"
                      name="canalRHSelecionado"
                      value={option.value}
                      checked={formData.canalRHSelecionado === option.value}
                      onChange={handleInputChange}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}{" "}
              </div>{" "}
              {formData.canalRHSelecionado === "outros" && (
                <input
                  type="text"
                  name="canalRHOutros"
                  placeholder="Especifique qual outro canal do RH"
                  value={formData.canalRHOutros}
                  onChange={handleInputChange}
                  className="detail-input"
                  style={{ marginTop: "10px" }}
                />
              )}{" "}
            </fieldset>
            <fieldset className="form-section">
              {" "}
              <legend>
                Qual o canal de comunicação DentalUni com a empresa?
              </legend>{" "}
              <div className="radio-group-vertical">
                {" "}
                {canalDentalUniOptions.map((option) => (
                  <label key={option.value}>
                    <input
                      type="radio"
                      name="canalDentalUniSelecionado"
                      value={option.value}
                      checked={
                        formData.canalDentalUniSelecionado === option.value
                      }
                      onChange={handleInputChange}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}{" "}
              </div>{" "}
              {formData.canalDentalUniSelecionado === "email" && (
                <input
                  type="email"
                  name="canalDentalUniEmailEspecifico"
                  placeholder="Digite o e-mail de contato"
                  value={formData.canalDentalUniEmailEspecifico}
                  onChange={handleInputChange}
                  className="detail-input"
                  style={{ marginTop: "10px" }}
                />
              )}{" "}
              {formData.canalDentalUniSelecionado === "whatsapp" && (
                <input
                  type="tel"
                  name="canalDentalUniWhatsappEspecifico"
                  placeholder="Digite o WhatsApp de contato (Ex: 5541...)"
                  value={formData.canalDentalUniWhatsappEspecifico}
                  onChange={handleInputChange}
                  className="detail-input"
                  style={{ marginTop: "10px" }}
                />
              )}{" "}
              {formData.canalDentalUniSelecionado === "telefone" && (
                <input
                  type="tel"
                  name="canalDentalUniTelefoneEspecifico"
                  placeholder="Digite o telefone de contato (Ex: 5541...)"
                  value={formData.canalDentalUniTelefoneEspecifico}
                  onChange={handleInputChange}
                  className="detail-input"
                  style={{ marginTop: "10px" }}
                />
              )}{" "}
              {formData.canalDentalUniSelecionado === "outros" && (
                <input
                  type="text"
                  name="canalDentalUniOutrosEspecifico"
                  placeholder="Qual outro canal DentalUni?"
                  value={formData.canalDentalUniOutrosEspecifico}
                  onChange={handleInputChange}
                  className="detail-input"
                  style={{ marginTop: "10px" }}
                />
              )}{" "}
            </fieldset>
            <fieldset className="form-section">
              {" "}
              <legend>Observações</legend>{" "}
              <textarea
                name="observacoes"
                rows="6"
                placeholder="Adicione suas observações finais aqui..."
                value={formData.observacoes}
                onChange={handleInputChange}
              ></textarea>{" "}
            </fieldset>
            <div className="form-actions">
              {" "}
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="button-secondary"
                disabled={isSubmitting}
              >
                Voltar
              </button>{" "}
              <button
                type="submit"
                className="button-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registrando Visita..." : "Registrar Visita"}
              </button>{" "}
            </div>
          </form>
        </motion.div>
      </main>
      {modalVisible && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.content}>
            <button
              onClick={handleCloseModal}
              style={modalStyles.closeButton}
              aria-label="Fechar modal"
            >
              <FaTimes />
            </button>
            <h3 style={{ marginTop: 0, marginBottom: "20px" }}>
              {submitStatus === "success"
                ? "Retorno do Atendimento"
                : "Erro no Envio"}
            </h3>
            <div
              style={modalStyles.protocolText}
              dangerouslySetInnerHTML={{ __html: modalMessage }}
            ></div>
            <button
              onClick={handleCloseModal}
              style={modalStyles.okButton}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
            >
              OK
            </button>
          </div>
        </div>
      )}
      <motion.footer
        className="new-bottom-menu"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <button
          className="menu-item"
          onClick={handleHomeClick}
          aria-label="Início"
        >
          <FaHome />
        </button>
        <button
          className="menu-item-principal"
          onClick={handleSearchClick}
          aria-label="Pesquisar Empresa"
        >
          <FaSearch />
        </button>
        <button
          className="menu-item"
          onClick={handleLogoutClick}
          aria-label="Sair"
        >
          <FaSignOutAlt />
        </button>
      </motion.footer>
    </div>
  );
};

export default RegisterVisitPage;
