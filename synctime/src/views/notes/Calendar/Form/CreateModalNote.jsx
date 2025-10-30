import { useState, useEffect, useRef } from 'react';
import styles from './CreateModalNote.module.css';
import { useTheme } from './../../../../hooks/useTheme';
import { useEmphasisColor } from './../../../../hooks/useEmphasisColor';

const CreateModalNote = () => {
  const { theme } = useTheme();
  const { emphasisColor } = useEmphasisColor();
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
      className={`${styles.modalOverlay} ${styles[theme]} ${isOpen ? styles.active : ''}`}
      onClick={handleOverlayClick}
    >
      <div className={`${styles.modalContainer} ${styles[theme]}`}>
        <div 
          className={`${styles.modalHeader} ${styles[theme]}`}
          style={{
            background: `linear-gradient(135deg, ${emphasisColor || '#667eea'} 0%, ${emphasisColor || '#764ba2'} 100%)`
          }}
        >
          <h2 className={`${styles.modalTitle} ${styles[theme]}`}>Nova Anotação</h2>
          {isMobile && (
            <button 
              className={`${styles.toggleBtn} ${styles[theme]} ${showComments ? styles.active : ''}`} 
              onClick={toggleComments}
              aria-expanded={showComments}
              aria-label={showComments ? 'Voltar ao formulário' : 'Mostrar comentários'}
              style={{
                borderColor: emphasisColor || '#667eea',
                background: `rgba(${emphasisColor || '#667eea'}, 0.2)`
              }}
            >
              {showComments ? '← Voltar ao Form' : '💬 Comentários'}
            </button>
          )}
          <button className={`${styles.closeBtn} ${styles[theme]}`} onClick={closeModal}>
            &times;
          </button>
        </div>
        <div className={`${styles.modalBody} ${styles[theme]}`}>
          <div className={`${styles.mainContent} ${styles[theme]} ${showComments && isMobile ? styles.hiddenOnMobile : ''}`}>
            <div className={`${styles.formSection} ${styles[theme]}`}>
              <h3 className={`${styles.sectionTitle} ${styles[theme]}`} style={{ '--section-bar-color': emphasisColor || '#667eea' }}>
                Informações Gerais
              </h3>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={`${styles.formLabel} ${styles[theme]}`} htmlFor="status">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className={`${styles.formSelect} ${styles[theme]}`}
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    style={{
                      '--focus-color': emphasisColor || '#667eea'
                    }}
                  >
                    <option value="">Selecione...</option>
                    <option value="em_andamento">Em Andamento</option>
                    <option value="finalizado">Finalizado</option>
                    <option value="pausado">Pausado</option>
                    <option value="pendente">Pendente</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={`${styles.formLabel} ${styles[theme]}`} htmlFor="colaboradores">
                    Colaboradores Envolvidos
                  </label>
                  <select
                    id="colaboradores"
                    name="colaboradores"
                    className={`${styles.formSelect} ${styles[theme]}`}
                    multiple
                    value={formData.colaboradores}
                    onChange={handleInputChange}
                    style={{
                      '--focus-color': emphasisColor || '#667eea'
                    }}
                  >
                    <option value="joao_silva">João Silva</option>
                    <option value="maria_oliveira">Maria Oliveira</option>
                    <option value="pedro_santos">Pedro Santos</option>
                    <option value="ana_costa">Ana Costa</option>
                    <option value="outros">Outros (especifique)</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={`${styles.formLabel} ${styles[theme]}`} htmlFor="prioridade">
                    Prioridade
                  </label>
                  <select
                    id="prioridade"
                    name="prioridade"
                    className={`${styles.formSelect} ${styles[theme]}`}
                    value={formData.prioridade}
                    onChange={handleInputChange}
                    required
                    style={{
                      '--focus-color': emphasisColor || '#667eea'
                    }}
                  >
                    <option value="">Selecione...</option>
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={`${styles.formLabel} ${styles[theme]}`} htmlFor="categoria">
                    Categoria Relacionada
                  </label>
                  <select
                    id="categoria"
                    name="categoria"
                    className={`${styles.formSelect} ${styles[theme]}`}
                    value={formData.categoria}
                    onChange={handleInputChange}
                    required
                    style={{
                      '--focus-color': emphasisColor || '#667eea'
                    }}
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

            <div className={`${styles.formSection} ${styles[theme]}`}>
              <h3 className={`${styles.sectionTitle} ${styles[theme]}`} style={{ '--section-bar-color': emphasisColor || '#667eea' }}>
                Detalhes da Atividade
              </h3>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={`${styles.formLabel} ${styles[theme]}`} htmlFor="atividade">
                    Atividade
                  </label>
                  <input
                    type="text"
                    id="atividade"
                    name="atividade"
                    className={`${styles.formInput} ${styles[theme]}`}
                    placeholder="Ex: Reunião de equipe"
                    value={formData.atividade}
                    onChange={handleInputChange}
                    required
                    style={{
                      '--focus-color': emphasisColor || '#667eea'
                    }}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={`${styles.formLabel} ${styles[theme]}`} htmlFor="tipoAtividade">
                    Tipo de Atividade
                  </label>
                  <select
                    id="tipoAtividade"
                    name="tipoAtividade"
                    className={`${styles.formSelect} ${styles[theme]}`}
                    value={formData.tipoAtividade}
                    onChange={handleInputChange}
                    required
                    style={{
                      '--focus-color': emphasisColor || '#667eea'
                    }}
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
                  <label className={`${styles.formLabel} ${styles[theme]}`} htmlFor="descricao">
                    Descrição do que foi feito
                  </label>
                  <textarea
                    id="descricao"
                    name="descricao"
                    className={`${styles.formTextarea} ${styles[theme]}`}
                    placeholder="Descreva em detalhes o que foi realizado..."
                    value={formData.descricao}
                    onChange={handleTextareaChange}
                    style={{
                      '--focus-color': emphasisColor || '#667eea'
                    }}
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={`${styles.formLabel} ${styles[theme]}`}>Período do Horário</label>
                  <div className={styles.timeRangeGroup}>
                    <div className={styles.formGroup}>
                      <label
                        className={`${styles.formLabel} ${styles[theme]}`}
                        htmlFor="horarioInicio"
                      >
                        Início
                      </label>
                      <input
                        type="time"
                        id="horarioInicio"
                        name="horarioInicio"
                        className={`${styles.formInput} ${styles[theme]}`}
                        value={formData.horarioInicio}
                        onChange={handleInputChange}
                        required
                        style={{
                          '--focus-color': emphasisColor || '#667eea'
                        }}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={`${styles.formLabel} ${styles[theme]}`} htmlFor="horarioFim">
                        Fim
                      </label>
                      <input
                        type="time"
                        id="horarioFim"
                        name="horarioFim"
                        className={`${styles.formInput} ${styles[theme]}`}
                        value={formData.horarioFim}
                        onChange={handleInputChange}
                        required
                        style={{
                          '--focus-color': emphasisColor || '#667eea'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.sidebar} ${styles[theme]} ${showComments && isMobile ? styles.expanded : ''}`}>
            {showComments && isMobile && (
              <button 
                className={`${styles.backBtn} ${styles[theme]}`}
                onClick={toggleComments}
                aria-label="Voltar ao formulário"
                style={{
                  color: emphasisColor || '#667eea'
                }}
              >
                ← Voltar
              </button>
            )}
            <h3 className={`${styles.sectionTitle} ${styles[theme]}`} style={{ '--section-bar-color': emphasisColor || '#667eea' }}>
              Comentários
            </h3>
            <div className={`${styles.commentsList} ${styles[theme]}`} ref={commentsRef}>
              {comments.map((comment, index) => (
                <div 
                  key={index} 
                  className={`${styles.commentItem} ${styles[theme]}`}
                  style={{
                    borderLeftColor: emphasisColor || '#667eea'
                  }}
                >
                  <div className={`${styles.commentAuthor} ${styles[theme]}`} style={{ color: emphasisColor || '#667eea' }}>
                    {comment.author}
                  </div>
                  <div className={`${styles.commentText} ${styles[theme]}`}>{comment.text}</div>
                  <div className={`${styles.commentDate} ${styles[theme]}`}>{comment.date}</div>
                </div>
              ))}
            </div>
            <div className={`${styles.addCommentGroup} ${styles[theme]}`}>
              <input
                type="text"
                className={`${styles.addCommentInput} ${styles[theme]}`}
                placeholder="Adicione um comentário..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={handleCommentKeyPress}
                style={{
                  '--focus-color': emphasisColor || '#667eea'
                }}
              />
              <button 
                className={`${styles.addCommentBtn} ${styles[theme]}`} 
                onClick={addComment}
                style={{
                  background: `linear-gradient(135deg, ${emphasisColor || '#667eea'} 0%, ${emphasisColor || '#764ba2'} 100%)`
                }}
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
        {showFooter && (
          <div className={`${styles.modalFooter} ${styles[theme]}`}>
            <button 
              className={`${styles.btnSecondary} ${styles[theme]}`} 
              onClick={closeModal}
            >
              Cancelar
            </button>
            <button 
              className={`${styles.btnPrimary} ${styles[theme]}`} 
              onClick={saveActivity}
              style={{
                background: `linear-gradient(135deg, ${emphasisColor || '#667eea'} 0%, ${emphasisColor || '#764ba2'} 100%)`,
                '--hover-shadow-color': emphasisColor || '#667eea'
              }}
            >
              Salvar Anotação
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateModalNote;