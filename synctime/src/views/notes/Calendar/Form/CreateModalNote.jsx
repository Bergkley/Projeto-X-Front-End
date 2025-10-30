import { useState, useEffect, useRef } from 'react';
import styles from './CreateModalNote.module.css';

const CreateModalNote = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState({
    status: '',
    colaboradores: [],
    prioridade: '',
    categoria: '',
    atividade: '',
    tipoAtividade: '',
    descricao: '',
    horarioInicio: '',
    horarioFim: ''
  });
  const [comments, setComments] = useState([
    {
      author: 'João Silva',
      text: 'Esta atividade foi concluída com sucesso. Aguardando aprovação.',
      date: '28/10/2025 às 14:30'
    },
    {
      author: 'Maria Oliveira',
      text: 'Adicionei uma nota sobre o impacto no projeto.',
      date: '28/10/2025 às 15:15'
    }
  ]);
  const [newComment, setNewComment] = useState('');

  const [showComments, setShowComments] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  const commentsRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setShowComments(!mobile); 
    };
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';
    setFormData({
      status: '',
      colaboradores: [],
      prioridade: '',
      categoria: '',
      atividade: '',
      tipoAtividade: '',
      descricao: '',
      horarioInicio: '',
      horarioFim: ''
    });
    setNewComment('');
    setShowComments(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'colaboradores') {
      const options = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setFormData((prev) => ({ ...prev, [name]: options }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTextareaChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addComment = () => {
    if (!newComment.trim()) return;
    const now = new Date().toLocaleString('pt-BR');
    const comment = {
      author: 'Usuário Atual',
      text: newComment.trim(),
      date: now
    };
    setComments((prev) => [...prev, comment]);
    setNewComment('');
    setTimeout(() => {
      if (commentsRef?.current) {
        commentsRef.current.scrollTop = commentsRef?.current?.scrollHeight;
      }
    }, 0);
  };

  const handleCommentKeyPress = (e) => {
    if (e.key === 'Enter') {
      addComment();
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const saveActivity = () => {
    const {
      status,
      prioridade,
      categoria,
      atividade,
      tipoAtividade,
      horarioInicio,
      horarioFim
    } = formData;
    if (
      !status ||
      !prioridade ||
      !categoria ||
      !atividade ||
      !tipoAtividade ||
      !horarioInicio ||
      !horarioFim
    ) {
      alert('Por favor, preencha os campos obrigatórios.');
      return;
    }
    console.log('Salvando:', {
      ...formData,
      colaboradores: formData.colaboradores,
      periodo: `${horarioInicio} até ${horarioFim}`
    });
    alert('Anotação salva com sucesso!');
    closeModal();
  };
  const showFooter = !isMobile || !showComments;

  return (
    <div
      className={`${styles.modalOverlay} ${isOpen ? styles.active : ''}`}
      onClick={handleOverlayClick}
    >
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Nova Anotação</h2>
          {isMobile && (
            <button 
              className={`${styles.toggleBtn} ${showComments ? styles.active : ''}`} 
              onClick={toggleComments}
              aria-expanded={showComments}
              aria-label={showComments ? 'Voltar ao formulário' : 'Mostrar comentários'}
            >
              {showComments ? '← Voltar ao Form' : '💬 Comentários'}
            </button>
          )}
          <button className={styles.closeBtn} onClick={closeModal}>
            &times;
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={`${styles.mainContent} ${showComments && isMobile ? styles.hiddenOnMobile : ''}`}>
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Informações Gerais</h3>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="status">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className={styles.formSelect}
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="em_andamento">Em Andamento</option>
                    <option value="finalizado">Finalizado</option>
                    <option value="pausado">Pausado</option>
                    <option value="pendente">Pendente</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="colaboradores">
                    Colaboradores Envolvidos
                  </label>
                  <select
                    id="colaboradores"
                    name="colaboradores"
                    className={styles.formSelect}
                    multiple
                    value={formData.colaboradores}
                    onChange={handleInputChange}
                  >
                    <option value="joao_silva">João Silva</option>
                    <option value="maria_oliveira">Maria Oliveira</option>
                    <option value="pedro_santos">Pedro Santos</option>
                    <option value="ana_costa">Ana Costa</option>
                    <option value="outros">Outros (especifique)</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="prioridade">
                    Prioridade
                  </label>
                  <select
                    id="prioridade"
                    name="prioridade"
                    className={styles.formSelect}
                    value={formData.prioridade}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="categoria">
                    Categoria Relacionada
                  </label>
                  <select
                    id="categoria"
                    name="categoria"
                    className={styles.formSelect}
                    value={formData.categoria}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="projeto_a">Projeto A</option>
                    <option value="projeto_b">Projeto B</option>
                    <option value="manutencao">Manutenção</option>
                    <option value="desenvolvimento">Desenvolvimento</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Detalhes da Atividade</h3>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="atividade">
                    Atividade
                  </label>
                  <input
                    type="text"
                    id="atividade"
                    name="atividade"
                    className={styles.formInput}
                    placeholder="Ex: Reunião de equipe"
                    value={formData.atividade}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="tipoAtividade">
                    Tipo de Atividade
                  </label>
                  <select
                    id="tipoAtividade"
                    name="tipoAtividade"
                    className={styles.formSelect}
                    value={formData.tipoAtividade}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="fisica">Atividade Física</option>
                    <option value="trabalho">Trabalho</option>
                    <option value="educacao">Educação</option>
                    <option value="lazer">Lazer</option>
                    <option value="saude">Saúde</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.formLabel} htmlFor="descricao">
                    Descrição do que foi feito
                  </label>
                  <textarea
                    id="descricao"
                    name="descricao"
                    className={styles.formTextarea}
                    placeholder="Descreva em detalhes o que foi realizado..."
                    value={formData.descricao}
                    onChange={handleTextareaChange}
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.formLabel}>Período do Horário</label>
                  <div className={styles.timeRangeGroup}>
                    <div className={styles.formGroup}>
                      <label
                        className={styles.formLabel}
                        htmlFor="horarioInicio"
                      >
                        Início
                      </label>
                      <input
                        type="time"
                        id="horarioInicio"
                        name="horarioInicio"
                        className={styles.formInput}
                        value={formData.horarioInicio}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel} htmlFor="horarioFim">
                        Fim
                      </label>
                      <input
                        type="time"
                        id="horarioFim"
                        name="horarioFim"
                        className={styles.formInput}
                        value={formData.horarioFim}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.sidebar} ${showComments && isMobile ? styles.expanded : ''}`}>
            {showComments && isMobile && (
              <button 
                className={styles.backBtn}
                onClick={toggleComments}
                aria-label="Voltar ao formulário"
              >
                ← Voltar
              </button>
            )}
            <h3 className={styles.sectionTitle}>Comentários</h3>
            <div className={styles.commentsList} ref={commentsRef}>
              {comments.map((comment, index) => (
                <div key={index} className={styles.commentItem}>
                  <div className={styles.commentAuthor}>{comment.author}</div>
                  <div className={styles.commentText}>{comment.text}</div>
                  <div className={styles.commentDate}>{comment.date}</div>
                </div>
              ))}
            </div>
            <div className={styles.addCommentGroup}>
              <input
                type="text"
                className={styles.addCommentInput}
                placeholder="Adicione um comentário..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={handleCommentKeyPress}
              />
              <button className={styles.addCommentBtn} onClick={addComment}>
                Adicionar
              </button>
            </div>
          </div>
        </div>
        {showFooter && (
          <div className={styles.modalFooter}>
            <button className={styles.btnSecondary} onClick={closeModal}>
              Cancelar
            </button>
            <button className={styles.btnPrimary} onClick={saveActivity}>
              Salvar Anotação
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateModalNote;