import { useTheme } from '../../../../hooks/useTheme';
import styles from './NoteList.module.css';

const NoteList = ({ isOpen, onClose, selectedDate, notes, onDeleteNote }) => {
  const { theme } = useTheme();
  if (!isOpen) return null;

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`${styles.noteListOverlay} ${styles[theme]}`} onClick={onClose}>
      <div className={`${styles.noteListContent} ${styles[theme]}`} onClick={(e) => e.stopPropagation()}>
        <div className={`${styles.noteListHeader} ${styles[theme]}`}>
          <h2 className={`${styles.noteListTitle} ${styles[theme]}`}>
            Anotações para {formatDate(selectedDate)}
          </h2>
          <button className={`${styles.noteListClose} ${styles[theme]}`} onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className={`${styles.notesList} ${styles[theme]}`}>
          {notes.length === 0 ? (
            <p className={`${styles.noNotes} ${styles[theme]}`}>Nenhuma anotação encontrada para este dia.</p>
          ) : (
            notes.map((note) => (
              <div key={note.id} className={`${styles.noteItem} ${styles[theme]}`}>
                <div className={`${styles.noteHeader} ${styles[theme]}`}>
                  <h3 className={`${styles.noteTitle} ${styles[theme]}`}>{note.title}</h3>
                  <span className={`${styles.noteTime} ${styles[theme]}`}>{note.time}</span>
                </div>
                <p className={`${styles.noteContent} ${styles[theme]}`}>{note.content}</p>
                <div className={`${styles.noteActions} ${styles[theme]}`}>
                  <button 
                    className={`${styles.editButton} ${styles[theme]}`} 
                    onClick={() => {
                      console.log('Editar anotação:', note.id);
                    }}
                  >
                    Editar
                  </button>
                  <button 
                    className={`${styles.deleteButton} ${styles[theme]}`} 
                    onClick={() => onDeleteNote(note.id)}
                  >
                    Deletar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className={`${styles.noteListFooter} ${styles[theme]}`}>
          <button className={`${styles.closeButton} ${styles[theme]}`} onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteList;