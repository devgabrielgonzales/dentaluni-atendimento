import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/RegisterVisitPage.css';
import { FaStar } from 'react-icons/fa';

const capitalizeFirst = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

const RegisterVisitPage = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();

  const initialFormData = {
    motivoVisita: '',
    motivoVisitaOutros: '',
    ocorrenciasCadastral: '',
    ocorrenciasFaturamento: '',
    ocorrenciasAtendimento: '',
    ocorrenciasMovimentacao: '',
    totalFuncionariosEmpresa: '',
    totalFuncionariosPlano: '',
    coberturaPF: '',
    coberturaNumFuncionarios: '',
    possuiFuncionarioPJTerceiro: '',
    empresaPrioridadeAVidas: '',
    possuiPlanoSaude: '',
    textilIsentoGrupoRisco: '',
    comandoFuncional: '',
    nomeContatoEmpresa: '',
    telefoneEmpresaContato: '',
    emailEmpresaContato: '',
    segmentoRegiaoLocalizacao: '',
    criterioSelecionado: '', 
    percentualDescontoParticular: '', 
    nota: 0,
    canalRHSelecionado: '', 
    canalRHOutros: '',
    canalDentalUniSelecionado: '', 
    observacoes: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (companyId) {
      console.log(`ID da Empresa recebido: ${companyId}`);
    }
  }, [companyId]);

  const handleInputChange = (event) => {
    const { name, value, type } = event.target;
    const newValue = type === 'number' ? parseInt(value, 10) || 0 : value;
    setFormData(prevData => ({ ...prevData, [name]: newValue }));
  };

  
  

  const handleRatingChange = (newRating) => {
     setFormData(prevData => ({ ...prevData, nota: newRating }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Dados do Formulário de Visita:', formData);
    alert('Visita registrada com sucesso! (simulação)');
  };

  
  const motivoVisitaOptions = [ { value: '', label: 'Selecione um motivo...' }, { value: 'implantacao', label: 'Implantação' }, { value: 'eventos', label: 'Eventos' }, { value: 'reajuste', label: 'Reajuste' }, { value: 'treinamentos', label: 'Treinamentos' }, { value: 'negociacao', label: 'Negociação' }, { value: 'naoHouve', label: 'Não houve' }, { value: 'outros', label: 'Outros' } ];
  const ocorrenciasCadastralOptions = [ { value: 'inclusaoContrato', label: 'Inclusão de Contrato'}, { value: 'inclusaoCadastro', label: 'Inclusão de Cadastro'}, { value: 'alteracaoDados', label: 'Alteração de dados cadastrais'}, { value: 'inclusaoPlanilha', label: 'Inclusão via Planilha'} ];
  const ocorrenciasFaturamentoOptions = [ { value: 'segundaViaBoleto', label: '2ª via de boleto'}, { value: 'alteracaoVencimento', label: 'Alteração de vencimento'}, { value: 'reenvioNegociacao', label: 'Reenvio/correção de negociação'}, { value: 'inclusaoLink', label: 'Inclusão via link'} ];
  const ocorrenciasAtendimentoOptions = [ { value: 'reembolsoConsultorio', label: 'Reembolso em consultório'}, { value: 'beneficiarioIntercambio', label: 'Beneficiário Intercâmbio - Life'}, { value: 'reembolsoNaoCirurgico', label: 'Reembolso Não Cirúrgico'}, { value: 'dificuldadeRede', label: 'Dificuldade em localizar rede'} ];
  const ocorrenciasMovimentacaoOptions = [ { value: 'inclusoes', label: 'Inclusões'}, { value: 'exclusoes', label: 'Exclusões'} ];
  
  const criteriosOptions = [
      { value: 'criterioUrgencia', label: 'Critério Urgência Central/Marcação?'}, { value: 'maisVidasCompanny', label: '+Vidas X Companny?'},
      { value: 'conheceSistemaChamado', label: 'Conhece Sistema Chamado (Self/App/Nav)?'}, { value: 'realizouEventosSaudeBucal', label: 'Realizou Eventos Saúde Bucal?'},
      { value: 'realizaDescontoParticular', label: 'Realiza Desconto Particular?'}
  ];
  
  const canalRHOptions = [ { value: 'email', label: 'E-mail'}, { value: 'muralIntranet', label: 'Mural/Intranet'}, { value: 'whatsapp', label: 'Whatsapp'}, { value: 'outros', label: 'Outros'} ];
  const canalDentalUniOptions = [ { value: 'email', label: 'E-mail'}, { value: 'whatsapp', label: 'Whatsapp'}, { value: 'telefone', label: 'Telefone'} ];
  

  return (
    <div className="register-visit-page">
      <h1>Registrar Visita</h1>
      <form onSubmit={handleSubmit} className="visit-form">

        {/* Motivo Visita (Select) */}
        <fieldset className="form-section">
          <legend>Motivo da Visita</legend>
          <label className="select-label">
            Selecione o motivo principal:
            <select name="motivoVisita" value={formData.motivoVisita} onChange={handleInputChange} className="select-input" required >
              {motivoVisitaOptions.map(option => ( <option key={option.value} value={option.value} disabled={option.value === ''}> {option.label} </option> ))}
            </select>
          </label>
          {formData.motivoVisita === 'outros' && ( <input type="text" name="motivoVisitaOutros" placeholder="Qual outro motivo?" value={formData.motivoVisitaOutros} onChange={handleInputChange} className="detail-input" /> )}
        </fieldset>

        {/* Ocorrências (Radio Groups) */}
        <fieldset className="form-section">
          <legend>Ocorrências</legend>
          <div className="ocorrencias-grid">
            <div className="ocorrencia-coluna">
              <p className="ocorrencia-titulo">Cadastral</p>
              <div className="radio-group-vertical">
                {ocorrenciasCadastralOptions.map((option) => ( <label key={option.value}> <input type="radio" name="ocorrenciasCadastral" value={option.value} checked={formData.ocorrenciasCadastral === option.value} onChange={handleInputChange}/> <span>{option.label}</span> </label> ))}
              </div>
            </div>
            <div className="ocorrencia-coluna">
              <p className="ocorrencia-titulo">Faturamento</p>
              <div className="radio-group-vertical">
                {ocorrenciasFaturamentoOptions.map((option) => ( <label key={option.value}> <input type="radio" name="ocorrenciasFaturamento" value={option.value} checked={formData.ocorrenciasFaturamento === option.value} onChange={handleInputChange}/> <span>{option.label}</span> </label> ))}
              </div>
            </div>
            <div className="ocorrencia-coluna">
              <p className="ocorrencia-titulo">Atendimento</p>
              <div className="radio-group-vertical">
                {ocorrenciasAtendimentoOptions.map((option) => ( <label key={option.value}> <input type="radio" name="ocorrenciasAtendimento" value={option.value} checked={formData.ocorrenciasAtendimento === option.value} onChange={handleInputChange}/> <span>{option.label}</span> </label> ))}
              </div>
            </div>
             <div className="ocorrencia-coluna">
              <p className="ocorrencia-titulo">Movimentação</p>
              <div className="radio-group-vertical">
                {ocorrenciasMovimentacaoOptions.map((option) => ( <label key={option.value}> <input type="radio" name="ocorrenciasMovimentacao" value={option.value} checked={formData.ocorrenciasMovimentacao === option.value} onChange={handleInputChange}/> <span>{option.label}</span> </label> ))}
              </div>
            </div>
          </div>
        </fieldset>

        {/* Pesquisa e Atualizações (Text Inputs) */}
        <fieldset className="form-section">
          <legend>Pesquisa e Atualizações</legend>
           <div className="form-grid pesquisa-grid">
              <label> Qual o total de funcionários na empresa? (Empresa) <input type="number" name="totalFuncionariosEmpresa" value={formData.totalFuncionariosEmpresa} onChange={handleInputChange} /> </label>
              <label> Qual o total de funcionários no plano? <input type="number" name="totalFuncionariosPlano" value={formData.totalFuncionariosPlano} onChange={handleInputChange} /> </label>
              <label> Cobertura PF <input type="text" name="coberturaPF" value={formData.coberturaPF} onChange={handleInputChange} /> </label>
              <label> Nº de Funcionários (Cobertura) <input type="number" name="coberturaNumFuncionarios" value={formData.coberturaNumFuncionarios} onChange={handleInputChange}/> </label>
              <label className="full-width"> Possui funcionário PJ ou Terceiro no plano? Especifique o CNPJ/Nome <input type="text" name="possuiFuncionarioPJTerceiro" value={formData.possuiFuncionarioPJTerceiro} onChange={handleInputChange} /> </label>
              <label className="full-width"> Empresa prioridade A com +X vidas ou A+? Qual o motivo? <input type="text" name="empresaPrioridadeAVidas" value={formData.empresaPrioridadeAVidas} onChange={handleInputChange} /> </label>
              <label className="full-width"> Possui Plano de Saúde? Qual operadora? <input type="text" name="possuiPlanoSaude" value={formData.possuiPlanoSaude} onChange={handleInputChange} /> </label>
              <label className="full-width"> Têxtil é isento de condição de grupo de risco? <input type="text" name="textilIsentoGrupoRisco" value={formData.textilIsentoGrupoRisco} onChange={handleInputChange} /> </label>
              <label> Comando Funcional <input type="text" name="comandoFuncional" value={formData.comandoFuncional} onChange={handleInputChange} /> </label>
              <label> Nome do contato (RH, Financeiro, Diretoria, Outros) <input type="text" name="nomeContatoEmpresa" value={formData.nomeContatoEmpresa} onChange={handleInputChange} /> </label>
              <label> Telefone do Empresa (Contato) <input type="tel" name="telefoneEmpresaContato" value={formData.telefoneEmpresaContato} onChange={handleInputChange} /> </label>
              <label> E-mail da Empresa (Contato) <input type="email" name="emailEmpresaContato" value={formData.emailEmpresaContato} onChange={handleInputChange} /> </label>
              <label className="full-width"> Segmento / Região / Localização? <input type="text" name="segmentoRegiaoLocalizacao" value={formData.segmentoRegiaoLocalizacao} onChange={handleInputChange} /> </label>
           </div>
        </fieldset>

        {/* Critérios (Radio Group) e Nota */}
        <div className="side-by-side-grids">
            <fieldset className="form-section criteria-section">
              <legend>Critérios</legend>
              {/* Usando Radio Buttons para seleção única */}
              <div className="radio-group-vertical">
                  {criteriosOptions.map((option) => (
                    <label key={option.value}>
                       <input type="radio" name="criterioSelecionado" value={option.value} checked={formData.criterioSelecionado === option.value} onChange={handleInputChange} />
                       <span>{option.label}</span>
                       {/* Input condicional para percentual */}
                       {option.value === 'realizaDescontoParticular' && formData.criterioSelecionado === 'realizaDescontoParticular' && (
                           <input type="text" name="percentualDescontoParticular" placeholder="Qual %?" value={formData.percentualDescontoParticular} onChange={handleInputChange} className="detail-input percent-input" />
                       )}
                    </label>
                  ))}
              </div>
            </fieldset>

            <fieldset className="form-section nota-section">
              <legend>Nota</legend>
               <div className="rating-stars explicit-rating">
                 {[1, 2, 3, 4, 5].map((star) => (
                   <div key={star} className="rating-row">
                     <span>{star}</span>
                     <FaStar className={star <= formData.nota ? 'star-selected' : 'star-empty'} onClick={() => handleRatingChange(star)} />
                   </div>
                 ))}
               </div>
            </fieldset>
        </div>

        {/* Canais de Comunicação RH (Radio Group) */}
        <fieldset className="form-section">
          <legend>Qual o canal de comunicação do RH com o funcionário?</legend>
           <div className="radio-group-vertical">
            {canalRHOptions.map((option) => ( <label key={option.value}> <input type="radio" name="canalRHSelecionado" value={option.value} checked={formData.canalRHSelecionado === option.value} onChange={handleInputChange} /> <span>{option.label}</span> </label> ))}
          </div>
           {formData.canalRHSelecionado === 'outros' && ( <input type="text" name="canalRHOutros" placeholder="Qual outro canal?" value={formData.canalRHOutros} onChange={handleInputChange} className="detail-input"/> )}
        </fieldset>

        {/* Canais de Comunicação DentalUni (Radio Group) */}
        <fieldset className="form-section">
          <legend>Qual o canal de comunicação DentalUni com a empresa?</legend>
           <div className="radio-group-vertical">
            {canalDentalUniOptions.map((option) => ( <label key={option.value}> <input type="radio" name="canalDentalUniSelecionado" value={option.value} checked={formData.canalDentalUniSelecionado === option.value} onChange={handleInputChange} /> <span>{option.label}</span> </label> ))}
          </div>
        </fieldset>

        {/* Observações (Textarea) */}
        <fieldset className="form-section">
           <legend>Observações</legend>
           <textarea name="observacoes" rows="6" placeholder="Adicione suas observações finais aqui..." value={formData.observacoes} onChange={handleInputChange}></textarea>
        </fieldset>

        {/* Botões de Ação */}
        <div className="form-actions">
          <button type="button" onClick={() => navigate(-1)} className="button-secondary">Voltar</button>
          <button type="submit" className="button-primary">Registrar Visita</button>
        </div>
      </form>
    </div>
  );
};

export default RegisterVisitPage;