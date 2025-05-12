import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/RegisterVisitPage.css"; // Seu caminho
import {
  FaStar,
  FaPlus,
  FaTrash,
  FaUserCircle,
  FaHome,
  FaSearch,
  FaSignOutAlt, // Ícones para o footer
} from "react-icons/fa";
import { motion } from "framer-motion";

const RegisterVisitPage = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();

  const initialFormData = {
    /* ... (seu initialFormData como você forneceu) ... */ motivoVisita: "",
    motivoVisitaOutros: "",
    ocorrenciasCadastral: {
      atualizacaoCadastral: false,
      insencaoCarencia: false,
      cancelamentoDigito: false,
      inclusaoPlanilha: false,
    },
    ocorrenciasFaturamento: {
      atrasoFatura: false,
      alteracaoVencimento: false,
      alteracaoMovimentacao: false,
      inclusaoLink: false,
    },
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
    camaroteArena: "",
    repCompras: "",
    diretorEmpresa: "",
    repLegal: "",
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
    observacoes: "",
    filiais: [{ id: Date.now(), cidadeUF: "", numFuncionarios: "" }],
  };

  const [formData, setFormData] = useState(initialFormData);
  // Removido companyDisplayName e userName daqui, pois não estão no seu header
  // const [userName, setUserName] = useState("Gabriel Gonzales");
  // const [companyDisplayName, setCompanyDisplayName] = useState('');

  useEffect(() => {
    if (companyId) {
      console.log(`ID da Empresa recebido: ${companyId}`);
      // Lógica para buscar/definir nome da empresa se necessário no header
    }
  }, [companyId]);

  const handleInputChange = (event) => {
    const { name, value, type } = event.target;
    const newValue = type === "number" ? parseInt(value, 10) || 0 : value;
    setFormData((prevData) => ({ ...prevData, [name]: newValue }));
  };

  const handleCheckboxGroupChange = (event) => {
    const { name, checked, dataset } = event.target;
    const group = dataset.group;
    setFormData((prevData) => ({
      ...prevData,
      [group]: { ...prevData[group], [name]: checked },
    }));
  };

  const handleFilialChange = (id, event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      filiais: prevData.filiais.map((filial) =>
        filial.id === id ? { ...filial, [name]: value } : filial
      ),
    }));
  };

  const handleAddFilial = () => {
    setFormData((prevData) => ({
      ...prevData,
      filiais: [
        ...prevData.filiais,
        { id: Date.now(), cidadeUF: "", numFuncionarios: "" },
      ],
    }));
  };

  const handleRemoveFilial = (id) => {
    setFormData((prevData) => ({
      ...prevData,
      filiais: prevData.filiais.filter((filial) => filial.id !== id),
    }));
  };

  const handleSpecificRatingChange = (field, newRating) => {
    setFormData((prevData) => ({ ...prevData, [field]: newRating }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Dados do Formulário de Visita:", formData);
    alert("Visita registrada com sucesso! (simulação)");
  };

  // Handlers para o novo menu de rodapé
  const handleHomeClick = () => {
    navigate("/company-details/101");
  }; // Ajuste a rota conforme necessário
  const handleSearchClick = () => {
    navigate("/menu");
  }; // Ajuste a rota conforme necessário
  const handleLogoutClick = () => {
    navigate("/login");
  }; // Ajuste a rota conforme necessário

  const motivoVisitaOptions = [
    { value: "", label: "Selecione um motivo..." },
    { value: "implantacao", label: "Implantação" },
    { value: "eventos", label: "Eventos" },
    { value: "reajuste", label: "Reajuste" },
    { value: "treinamentos", label: "Treinamentos" },
    { value: "negociacao", label: "Negociação" },
    { value: "naoHouve", label: "Não houve" },
    { value: "outros", label: "Outros" },
  ];
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
  const criteriosOptions = [
    { value: "criterioUrgencia", label: "Critério Urgência Central/Marcação?" },
    { value: "maisVidasCompanny", label: "+Vidas X Companny?" },
    {
      value: "conheceSistemaChamadoSAE",
      label: "Conhece Sistema Chamado (Self/App/Nav)?",
    },
    {
      value: "realizouEventosSaudeBucal",
      label: "Realizou Eventos Saúde Bucal?",
    },
    {
      value: "realizaDescontoParticular",
      label: "Realiza Desconto Particular?",
    },
  ];
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
  ];

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
  // getFormattedDate não está sendo usada no header que você colou, então removi.
  // Se precisar, pode adicionar de volta.

  return (
    // Usando as classes de layout da CompanyDetailsPage que você forneceu
    <div className="details-page-layout-v2">
      <div className="container">
        <header className="details-header-curved">
          <div className="user-info-container">
            <FaUserCircle className="user-avatar-icon-v2" />
            <div className="user-text-info">
              <motion.p
                className="user-welcome-text-v2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
              >
                Olá, Bem-vindo! 👋
              </motion.p>
              <motion.h1
                className="user-name-text-v2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
              >
                Gabriel Gonzales
              </motion.h1>
            </div>
          </div>
        </header>
      </div>

      <main className="new-menu-content-area">
        {" "}
        <motion.div
          className="register-visit-form-container"
          initial={{ opacity: 0, y:20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        >
          <h1>Registrar Visita</h1>
          <form onSubmit={handleSubmit} className="visit-form">
            <fieldset className="form-section">
              {" "}
              <legend>Motivo da Visita</legend>{" "}
              <label className="select-label">
                {" "}
                Selecione o motivo principal:{" "}
                <select
                  name="motivoVisita"
                  value={formData.motivoVisita}
                  onChange={handleInputChange}
                  className="select-input"
                  required
                >
                  {" "}
                  {motivoVisitaOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      disabled={option.value === ""}
                    >
                      {" "}
                      {option.label}{" "}
                    </option>
                  ))}{" "}
                </select>{" "}
              </label>{" "}
              {formData.motivoVisita === "outros" && (
                <input
                  type="text"
                  name="motivoVisitaOutros"
                  placeholder="Qual outro motivo?"
                  value={formData.motivoVisitaOutros}
                  onChange={handleInputChange}
                  className="detail-input"
                />
              )}{" "}
            </fieldset>
            {/* Ocorrências (Checkboxes) */}
            <fieldset className="form-section">
              {" "}
              <legend>Ocorrências</legend>{" "}
              <div className="ocorrencias-grid">
                {" "}
                <div className="ocorrencia-coluna">
                  {" "}
                  <p className="ocorrencia-titulo">Cadastral</p>{" "}
                  <div className="checkbox-group-vertical">
                    {" "}
                    {Object.keys(formData.ocorrenciasCadastral).map((key) => (
                      <label key={key}>
                        {" "}
                        <input
                          type="checkbox"
                          name={key}
                          data-group="ocorrenciasCadastral"
                          checked={formData.ocorrenciasCadastral[key]}
                          onChange={handleCheckboxGroupChange}
                        />{" "}
                        <span>{ocorrenciasCadastralLabels[key]}</span>{" "}
                      </label>
                    ))}{" "}
                  </div>{" "}
                </div>{" "}
                <div className="ocorrencia-coluna">
                  {" "}
                  <p className="ocorrencia-titulo">Faturamento</p>{" "}
                  <div className="checkbox-group-vertical">
                    {" "}
                    {Object.keys(formData.ocorrenciasFaturamento).map((key) => (
                      <label key={key}>
                        {" "}
                        <input
                          type="checkbox"
                          name={key}
                          data-group="ocorrenciasFaturamento"
                          checked={formData.ocorrenciasFaturamento[key]}
                          onChange={handleCheckboxGroupChange}
                        />{" "}
                        <span>{ocorrenciasFaturamentoLabels[key]}</span>{" "}
                      </label>
                    ))}{" "}
                  </div>{" "}
                </div>{" "}
                <div className="ocorrencia-coluna">
                  {" "}
                  <p className="ocorrencia-titulo">Atendimento</p>{" "}
                  <div className="checkbox-group-vertical">
                    {" "}
                    {Object.keys(formData.ocorrenciasAtendimento).map((key) => (
                      <label key={key}>
                        {" "}
                        <input
                          type="checkbox"
                          name={key}
                          data-group="ocorrenciasAtendimento"
                          checked={formData.ocorrenciasAtendimento[key]}
                          onChange={handleCheckboxGroupChange}
                        />{" "}
                        <span>{ocorrenciasAtendimentoLabels[key]}</span>{" "}
                      </label>
                    ))}{" "}
                  </div>{" "}
                </div>{" "}
                <div className="ocorrencia-coluna">
                  {" "}
                  <p className="ocorrencia-titulo">Movimentação</p>{" "}
                  <div className="checkbox-group-vertical">
                    {" "}
                    {Object.keys(formData.ocorrenciasMovimentacao).map(
                      (key) => (
                        <label key={key}>
                          {" "}
                          <input
                            type="checkbox"
                            name={key}
                            data-group="ocorrenciasMovimentacao"
                            checked={formData.ocorrenciasMovimentacao[key]}
                            onChange={handleCheckboxGroupChange}
                          />{" "}
                          <span>{ocorrenciasMovimentacaoLabels[key]}</span>{" "}
                        </label>
                      )
                    )}{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
              <label className="relato-label">
                {" "}
                Relato:{" "}
                <textarea
                  name="relatoOcorrencias"
                  rows="4"
                  value={formData.relatoOcorrencias}
                  onChange={handleInputChange}
                ></textarea>{" "}
              </label>{" "}
            </fieldset>
            {/* Pesquisa e Atualizações */}
            <fieldset className="form-section">
              {" "}
              <legend>Pesquisa e Atualizações</legend>{" "}
              <div className="form-grid pesquisa-grid-single-col">
                {" "}
                <label>
                  {" "}
                  Qual o total de funcionários na empresa? (Potencial){" "}
                  <input
                    type="number"
                    name="totalFuncionariosEmpresa"
                    value={formData.totalFuncionariosEmpresa}
                    onChange={handleInputChange}
                  />{" "}
                </label>{" "}
                <div className="dynamic-field-section">
                  {" "}
                  <label className="dynamic-field-label">
                    {" "}
                    Filiais (Cidade/UF | Nº de Funcionários):{" "}
                  </label>{" "}
                  {formData.filiais.map((filial, index) => (
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
                        >
                          {" "}
                          <FaTrash />{" "}
                        </button>
                      )}{" "}
                    </div>
                  ))}{" "}
                  <button
                    type="button"
                    onClick={handleAddFilial}
                    className="add-filial-btn"
                  >
                    {" "}
                    <FaPlus /> Adicionar Filial{" "}
                  </button>{" "}
                </div>{" "}
                <label>
                  {" "}
                  Permite a inclusão de dependentes no plano? (Especifique o
                  parentesco){" "}
                  <input
                    type="text"
                    name="dependentes"
                    value={formData.dependentes}
                    onChange={handleInputChange}
                  />{" "}
                </label>{" "}
                <label>
                  {" "}
                  Empresa contribui com o valor do plano? Qual o (%)?{" "}
                  <input
                    type="text"
                    name="contribuiPlano"
                    value={formData.contribuiPlano}
                    onChange={handleInputChange}
                  />{" "}
                </label>{" "}
                <label>
                  {" "}
                  Possui filiais que não tenham o benefício? Qual cidade?{" "}
                  <input
                    type="text"
                    name="filiaisBeneficio"
                    value={formData.filiaisBeneficio}
                    onChange={handleInputChange}
                  />{" "}
                </label>{" "}
                <label>
                  {" "}
                  Possui plano de saúde? Qual operadora?{" "}
                  <input
                    type="text"
                    name="planoSaude"
                    value={formData.planoSaude}
                    onChange={handleInputChange}
                  />{" "}
                </label>{" "}
                <label>
                  {" "}
                  Data de aniversário de contrato do plano de saúde?{" "}
                  <input
                    type="text"
                    name="aniversarioContrato"
                    value={formData.aniversarioContrato}
                    onChange={handleInputChange}
                    placeholder="DD/MM ou MM/AAAA"
                  />{" "}
                </label>{" "}
                <label>
                  {" "}
                  Camarote Arena: Qual time torce?{" "}
                  <input
                    type="text"
                    name="camaroteArena"
                    value={formData.camaroteArena}
                    onChange={handleInputChange}
                  />{" "}
                </label>{" "}
                <label>
                  {" "}
                  Representante do compras: (Nome/Cargo/CPF/Data Nascimento){" "}
                  <input
                    type="text"
                    name="repCompras"
                    value={formData.repCompras}
                    onChange={handleInputChange}
                  />{" "}
                </label>{" "}
                <label>
                  {" "}
                  Diretor da empresa: (Nome/Cargo/CPF/Data Nascimento){" "}
                  <input
                    type="text"
                    name="diretorEmpresa"
                    value={formData.diretorEmpresa}
                    onChange={handleInputChange}
                  />{" "}
                </label>{" "}
                <label>
                  {" "}
                  Representante legal: (Nome/Cargo/CPF/Data Nascimento){" "}
                  <input
                    type="text"
                    name="repLegal"
                    value={formData.repLegal}
                    onChange={handleInputChange}
                  />{" "}
                </label>{" "}
              </div>{" "}
            </fieldset>
            {/* Nova Seção de Perguntas Sim/Não com Notas Condicionais */}
            <fieldset className="form-section">
              {" "}
              <legend>Questões Adicionais</legend>{" "}
              <div className="additional-questions-column">
                {" "}
                <div className="question-block">
                  {" "}
                  <p className="question-title">
                    {" "}
                    Já utilizou a Clínica de urgência da DentalUni?{" "}
                  </p>{" "}
                  <div className="radio-group-horizontal">
                    {" "}
                    <label>
                      {" "}
                      <input
                        type="radio"
                        name="utilizouClinicaUrgencia"
                        value="sim"
                        checked={formData.utilizouClinicaUrgencia === "sim"}
                        onChange={handleInputChange}
                      />{" "}
                      <span>Sim</span>{" "}
                    </label>{" "}
                    <label>
                      {" "}
                      <input
                        type="radio"
                        name="utilizouClinicaUrgencia"
                        value="nao"
                        checked={formData.utilizouClinicaUrgencia === "nao"}
                        onChange={handleInputChange}
                      />{" "}
                      <span>Não</span>{" "}
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
                      {" "}
                      <input
                        type="radio"
                        name="possuiInCompany"
                        value="sim"
                        checked={formData.possuiInCompany === "sim"}
                        onChange={handleInputChange}
                      />{" "}
                      <span>Sim</span>{" "}
                    </label>{" "}
                    <label>
                      {" "}
                      <input
                        type="radio"
                        name="possuiInCompany"
                        value="nao"
                        checked={formData.possuiInCompany === "nao"}
                        onChange={handleInputChange}
                      />{" "}
                      <span>Não</span>{" "}
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
                    {" "}
                    Conhece o sistema para abrir chamado (SAE Atendimento)?{" "}
                  </p>{" "}
                  <div className="radio-group-horizontal">
                    {" "}
                    <label>
                      {" "}
                      <input
                        type="radio"
                        name="conheceSistemaChamadoSAE"
                        value="sim"
                        checked={formData.conheceSistemaChamadoSAE === "sim"}
                        onChange={handleInputChange}
                      />{" "}
                      <span>Sim</span>{" "}
                    </label>{" "}
                    <label>
                      {" "}
                      <input
                        type="radio"
                        name="conheceSistemaChamadoSAE"
                        value="nao"
                        checked={formData.conheceSistemaChamadoSAE === "nao"}
                        onChange={handleInputChange}
                      />{" "}
                      <span>Não</span>{" "}
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
                    {" "}
                    Já realizou eventos relacionados a Saúde Bucal?{" "}
                  </p>{" "}
                  <div className="radio-group-horizontal">
                    {" "}
                    <label>
                      {" "}
                      <input
                        type="radio"
                        name="realizouEventosSaudeBucal"
                        value="sim"
                        checked={formData.realizouEventosSaudeBucal === "sim"}
                        onChange={handleInputChange}
                      />{" "}
                      <span>Sim</span>{" "}
                    </label>{" "}
                    <label>
                      {" "}
                      <input
                        type="radio"
                        name="realizouEventosSaudeBucal"
                        value="nao"
                        checked={formData.realizouEventosSaudeBucal === "nao"}
                        onChange={handleInputChange}
                      />{" "}
                      <span>Não</span>{" "}
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
                    {" "}
                    Realiza semana de SIPAT? Qual mês?{" "}
                    <input
                      type="text"
                      name="mesSIPAT"
                      value={formData.mesSIPAT}
                      onChange={handleInputChange}
                      placeholder="Ex: Outubro"
                    />{" "}
                  </label>{" "}
                </div>{" "}
              </div>{" "}
            </fieldset>
            {/* Canais de Comunicação RH (Radio Group) */}
            <fieldset className="form-section">
              {" "}
              <legend>
                {" "}
                Qual o canal de comunicação do RH com o funcionário?{" "}
              </legend>{" "}
              <div className="radio-group-vertical">
                {" "}
                {canalRHOptions.map((option) => (
                  <label key={option.value}>
                    {" "}
                    <input
                      type="radio"
                      name="canalRHSelecionado"
                      value={option.value}
                      checked={formData.canalRHSelecionado === option.value}
                      onChange={handleInputChange}
                    />{" "}
                    <span>{option.label}</span>{" "}
                  </label>
                ))}{" "}
              </div>{" "}
              {formData.canalRHSelecionado === "outros" && (
                <input
                  type="text"
                  name="canalRHOutros"
                  placeholder="Qual outro canal?"
                  value={formData.canalRHOutros}
                  onChange={handleInputChange}
                  className="detail-input"
                />
              )}{" "}
            </fieldset>
            {/* Canais de Comunicação DentalUni (Radio Group) */}
            <fieldset className="form-section">
              {" "}
              <legend>
                {" "}
                Qual o canal de comunicação DentalUni com a empresa?{" "}
              </legend>{" "}
              <div className="radio-group-vertical">
                {" "}
                {canalDentalUniOptions.map((option) => (
                  <label key={option.value}>
                    {" "}
                    <input
                      type="radio"
                      name="canalDentalUniSelecionado"
                      value={option.value}
                      checked={
                        formData.canalDentalUniSelecionado === option.value
                      }
                      onChange={handleInputChange}
                    />{" "}
                    <span>{option.label}</span>{" "}
                  </label>
                ))}{" "}
              </div>{" "}
            </fieldset>
            {/* Observações (Textarea) */}
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
            {/* Botões Finais */}
            <div className="form-actions">
              {" "}
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="button-secondary"
              >
                {" "}
                Voltar{" "}
              </button>{" "}
              <button type="submit" className="button-primary">
                {" "}
                Registrar Visita{" "}
              </button>{" "}
            </div>
          </form>
        </motion.div>
      </main>

      <motion.footer
        className="new-bottom-menu"
        initial={{ opacity: 0, y: 30 }} // Animação de entrada para o footer
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="container">
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
        </div>
      </motion.footer>
    </div>
  );
};

export default RegisterVisitPage;
