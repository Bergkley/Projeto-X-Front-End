import { useState } from 'react';
import { useTheme } from '../../../../hooks/useTheme';
import { useEmphasisColor } from '../../../../hooks/useEmphasisColor';
import styles from './NoteList.module.css';

const NoteList = ({ isOpen, onClose, selectedDate, notes, onDeleteNote, onAddNote }) => {
  const { theme } = useTheme();
  const { emphasisColor } = useEmphasisColor();
  const [activeTab, setActiveTab] = useState('todas');

  if (!isOpen) return null;

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const tabs = [
    { id: 'todas', label: 'Todas' },
    { id: 'emAndamento', label: 'Em Andamento' },
    { id: 'feito', label: 'Feito' },
    { id: 'naoRealizado', label: 'Não Realizado' },
    { id: 'resumo', label: `Resumo` }
  ];

  const getFilteredNotes = () => {
    if (activeTab === 'todas') {
      return notes;
    }
    return notes.filter(note => note.status === activeTab);
  };

  const filteredNotes = getFilteredNotes();

  return (
    <div className={`${styles.noteListOverlay} ${styles[theme]}`} onClick={onClose}>
      <div className={`${styles.noteListContent} ${styles[theme]}`} onClick={(e) => e.stopPropagation()}>
        <div 
          className={`${styles.noteListHeader} ${styles[theme]}`}
          style={{
            background: `linear-gradient(135deg, ${emphasisColor || '#667eea'} 0%, ${emphasisColor || '#764ba2'} 100%)`
          }}
        >
          <h2 className={`${styles.noteListTitle} ${styles[theme]}`}>
            Anotações para {formatDate(selectedDate)}
          </h2>
          <button className={`${styles.noteListClose} ${styles[theme]}`} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={`${styles.tabsContainer} ${styles[theme]}`}>
          <div className={styles.tabs}>
             {tabs.map(tab => (
              <button
                key={tab.id}
                className={`${styles.tabButton} ${activeTab === tab.id ? `${styles.active} active` : ''} ${styles[theme]}`}
                onClick={() => setActiveTab(tab.id)}
                style={activeTab === tab.id ? {
                  '--active-border-color': emphasisColor || '#667eea'
                } : {}}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className={`${styles.notesList} ${styles[theme]}`}>
          {filteredNotes.length === 0 ? (
            <p className={`${styles.noNotes} ${styles[theme]}`}>
              Nenhuma anotação encontrada para este status.
            </p>
          ) : (
            filteredNotes.map((note) => (
              <div 
                key={note.id} 
                className={`${styles.noteItem} ${styles[theme]}`}
                style={{
                  borderLeftColor: emphasisColor || '#667eea'
                }}
              >
                <div className={`${styles.noteHeader} ${styles[theme]}`}>
                  <h3 className={`${styles.noteTitle} ${styles[theme]}`}>
                    {note.title}
                    {note.status && (
                      <span className={`${styles.noteStatus} ${styles[note.status.toLowerCase().replace(/\s+/g, '')]} ${styles[theme]}`}>
                        {note.status}
                      </span>
                    )}
                  </h3>
                  <span className={`${styles.noteTime} ${styles[theme]}`}>{note.time}</span>
                </div>
                <p className={`${styles.noteContent} ${styles[theme]}`}>{note.content}</p>
                <div className={`${styles.noteActions} ${styles[theme]}`}>
                  <button 
                    className={`${styles.editButton} ${styles[theme]}`} 
                    onClick={() => {
                      console.log('Editar anotação:', note.id);
                    }}
                    style={{
                      backgroundColor: emphasisColor || '#667eea'
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
          <button 
            className={`${styles.addButton} ${styles[theme]}`} 
            onClick={() => onAddNote(selectedDate)}
            style={{
              backgroundColor: emphasisColor || '#667eea'
            }}
          >
            + Nova Anotação
          </button>
          <button 
            className={`${styles.closeButton} ${styles[theme]}`} 
            onClick={onClose}
            style={{
              backgroundColor: emphasisColor || '#667eea'
            }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteList;