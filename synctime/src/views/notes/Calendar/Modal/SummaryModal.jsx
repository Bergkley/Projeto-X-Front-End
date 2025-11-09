import { X } from 'lucide-react';
import { useTheme } from '../../../../hooks/useTheme';
import { useEmphasisColor } from '../../../../hooks/useEmphasisColor';
import ReactMarkdown from 'react-markdown'; 
import styles from './SummaryModal.module.css';

const SummaryModal = ({ isOpen, onClose, content }) => {
  const { theme } = useTheme();
  const { emphasisColor } = useEmphasisColor();

  if (!isOpen) return null;

  return (
    <div className={`${styles.modalOverlay} ${styles[theme]}`}>
      <div className={`${styles.modal} ${styles[theme]}`}>
        <div 
          className={`${styles.modalHeader} ${styles[theme]}`}
          style={{
            background: `linear-gradient(135deg, ${emphasisColor || '#667eea'} 0%, ${emphasisColor || '#764ba2'} 100%)`
          }}
        >
          <h2 className={`${styles.modalTitle} ${styles[theme]}`}>Resumo do Dia</h2>
          <button onClick={onClose} className={`${styles.closeButton} ${styles[theme]}`}>
            <X size={20} />
          </button>
        </div>

        <div className={`${styles.modalContent} ${styles[theme]}`}>
          <div className={`${styles.summaryText} ${styles[theme]}`}>
            {content ? (
              <ReactMarkdown
                components={{
                  h2: ({ children }) => <h2 className={styles.markdownH2}>{children}</h2>,
                  h3: ({ children }) => <h3 className={styles.markdownH3}>{children}</h3>,
                  strong: ({ children }) => <strong className={styles.markdownStrong}>{children}</strong>,
                  p: ({ children }) => <p className={styles.markdownP}>{children}</p>,
                  ul: ({ children }) => <ul className={styles.markdownUl}>{children}</ul>,
                  li: ({ children }) => <li className={styles.markdownLi}>{children}</li>,
                  em: ({ children }) => <em className={styles.markdownEm}>{children}</em>,
                }}
              >
                {content}
              </ReactMarkdown>
            ) : (
              <p>Nenhum conteúdo gerado ainda.</p>
            )}
          </div>
        </div>

        <div className={`${styles.modalFooter} ${styles[theme]}`}>
          <button
            onClick={onClose}
            className={`${styles.closeButtonFooter} ${styles[theme]}`}
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

export default SummaryModal;