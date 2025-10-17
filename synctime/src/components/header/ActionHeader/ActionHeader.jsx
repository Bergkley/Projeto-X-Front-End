// ⚙️ Bibliotecas externas
import { ChevronLeft } from "lucide-react";

// 💅 Estilos
import styles from './ActionHeader.module.css';

// 🧠 Hooks customizados
import { useEmphasisColor } from "../../../hooks/useEmphasisColor";


const ActionHeader = ({ onBack, onCreate, backButtonLabel = "Voltar", createButtonLabel = "Criar" }) => {
  const { emphasisColor } = useEmphasisColor();

  return (
    <div className={styles.actionBar}>
      <button 
        className={styles.backButton} 
        onClick={onBack}
        aria-label={backButtonLabel}
        style={{
          color: emphasisColor || 'rgb(20, 18, 129)',

        }}
      >
        <ChevronLeft size={20} />
      </button>
      <button 
        className={styles.createButton} 
        onClick={onCreate}
        style={{
          color: emphasisColor || 'rgb(20, 18, 129)',
        }}
      >
        {createButtonLabel}
      </button>
    </div>
  );
};

export default ActionHeader;