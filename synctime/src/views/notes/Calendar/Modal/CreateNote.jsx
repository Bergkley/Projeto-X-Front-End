import { Plus, X } from 'lucide-react';
import styles from './CreateNote.module.css'; 
import { useTheme } from '../../../../hooks/useTheme';
import { useEmphasisColor } from '../../../../hooks/useEmphasisColor';

const CreateNote = ({
  isOpen,
  onClose,
  selectedDate,
  noteType,
  onNoteTypeChange,
  selectedPeriod,
  onSelectedPeriodChange,
  onAddNote,
  selectedDateNotes,
  onDeleteNote,
  onGenerateSummary
}) => {
  const { theme } = useTheme();
  const { emphasisColor } = useEmphasisColor();
  if (!isOpen) return null;

  const isPeriodType = noteType === 'periodo';
  const hasPeriodSelected = selectedPeriod && selectedDateNotes.find(note => note.title === selectedPeriod);
  const hasSummary = selectedDateNotes.find(note => note.title === 'Resumo do Dia');

  return (
    <div className={`${styles.modalOverlay} ${styles[theme]}`}>
      <div className={`${styles.modal} ${styles[theme]}`}>
        <div 
          className={`${styles.modalHeader} ${styles[theme]}`}
          style={{
            background: `linear-gradient(135deg, ${emphasisColor || '#667eea'} 0%, ${emphasisColor || '#764ba2'} 100%)`
          }}
        >
          <h2 className={`${styles.modalTitle} ${styles[theme]}`}>
            {selectedDate?.toLocaleDateString('pt-BR', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </h2>
          <button onClick={onClose} className={`${styles.closeButton} ${styles[theme]}`}>
            <X size={20} />
          </button>
        </div>

        <div className={`${styles.modalContent} ${styles[theme]}`}>
          <div className={`${styles.newNoteBox} ${styles[theme]}`}>
            <label className={`${styles.typeLabel} ${styles[theme]}`}>Tipo de anotação:</label>
            <select
              value={noteType}
              onChange={(e) => {
                onNoteTypeChange(e.target.value);
                if (e.target.value !== 'periodo') {
                  onSelectedPeriodChange('');
                }
              }}
              className={`${styles.typeSelect} ${styles[theme]}`}
              style={{
                '--focus-color': emphasisColor || '#667eea'
              }}
            >
              <option value="">-- Escolha um tipo --</option>
              <option value="periodo">Anotação por período</option>
              <option value="resumo">Resumo do dia</option>
            </select>

            {isPeriodType && (
              <>
                <label className={`${styles.periodLabel} ${styles[theme]}`}>Selecione o período:</label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => onSelectedPeriodChange(e.target.value)}
                  className={`${styles.periodSelect} ${styles[theme]}`}
                  disabled={!isPeriodType}
                  style={{
                    '--focus-color': emphasisColor || '#667eea'
                  }}
                >
                  <option value="">-- Escolha um período --</option>
                  <option value="Manhã">Manhã</option>
                  <option value="Tarde">Tarde</option>
                  <option value="Noite">Noite</option>
                </select>
                {hasPeriodSelected && (
                  <p className={`${styles.periodWarning} ${styles[theme]}`}>Já existe uma anotação para este período.</p>
                )}
                <button 
                  onClick={onAddNote} 
                  disabled={!selectedPeriod || hasPeriodSelected}
                  className={`${styles.addButton} ${(!selectedPeriod || hasPeriodSelected) ? styles.addButtonDisabled : ''}`}
                  style={{
                    background: `linear-gradient(135deg, ${emphasisColor || '#667eea'} 0%, ${emphasisColor || '#764ba2'} 100%)`
                  }}
                >
                  <Plus size={18} />
                  Adicionar Período
                </button>
              </>
            )}

            {noteType === 'resumo' && (
              <>
                {hasSummary && (
                  <p className={`${styles.periodWarning} ${styles[theme]}`}>Já existe um resumo do dia.</p>
                )}
                <button 
                  onClick={onGenerateSummary} 
                  disabled={hasSummary}
                  className={`${styles.generateButton} ${hasSummary ? styles.addButtonDisabled : ''}`}
                  style={{
                    background: `linear-gradient(135deg, ${emphasisColor || '#667eea'} 0%, ${emphasisColor || '#764ba2'} 100%)`
                  }}
                >
                  Gerar anotação para resumo do dia
                </button>
              </>
            )}
          </div>

          <div>
            {selectedDateNotes.length === 0 ? (
              <div className={`${styles.emptyState} ${styles[theme]}`}>
                <div className={styles.emptyIcon}>📅</div>
                <p className={`${styles.emptyText} ${styles[theme]}`}>Nenhuma anotação para este dia</p>
              </div>
            ) : (
              <div className={`${styles.notesList} ${styles[theme]}`}>
                {selectedDateNotes.map(note => (
                  <div 
                    key={note.id} 
                    className={`${styles.noteCard} ${styles[theme]}`}
                    style={{
                      '--border-color': emphasisColor || '#667eea'
                    }}
                  >
                    <div className={`${styles.noteCardHeader} ${styles[theme]}`}>
                      <h3 className={`${styles.noteCardTitle} ${styles[theme]}`}>{note.title}</h3>
                      <button onClick={() => onDeleteNote(note.id)} className={`${styles.deleteButton} ${styles[theme]}`}>
                        <X size={18} />
                      </button>
                    </div>
                    {note.content && <p className={`${styles.noteCardContent} ${styles[theme]}`}>{note.content}</p>}
                    <span className={`${styles.noteCardTime} ${styles[theme]}`}>{note.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNote;