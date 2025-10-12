import { Zap, X } from 'lucide-react';
import styles from './Streak.module.css';
import { useTheme } from '../../hooks/useTheme'; 

const Streak = ({
  streakDays,
  weekDays,
  weekProgress,
  completedDaysThisWeek,
  onClose,
  getFlameColor,
}) => {
  const { theme } = useTheme();

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div 
        className={`${styles.modalContent} ${styles[theme]}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className={styles.closeButton}>
          <X className={styles.closeIcon} />
        </button>

        <div className={styles.modalBody}>
          {/* Título */}
          <div className={styles.titleContainer}>
            <h2 className={styles.title}>{streakDays} dias de ofensiva</h2>
            <Zap className={styles.titleFlame} color={getFlameColor()} />
          </div>

          {/* Subtítulo */}
          <p className={styles.subtitle}>
            Você aumentou a sua ofensiva antes do meio-dia{' '}
            {completedDaysThisWeek} vezes essa semana!
          </p>

          {/* Calendário Semanal */}
          <div className={styles.calendar}>
            <div className={styles.weekDays}>
              {weekDays.map((day, index) => (
                <div key={index} className={styles.dayColumn}>
                  <span
                    className={index === 4 ? styles.dayActive : styles.day} 
                  >
                    {day}
                  </span>
                </div>
              ))}
            </div>

            {/* Barra de Progresso */}
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${(completedDaysThisWeek / 7) * 100}%` }}
              ></div>

              {/* Indicadores dos dias */}
              <div className={styles.dayIndicators}>
                {weekProgress.map((completed, index) => (
                  <div
                    key={index}
                    className={
                      completed
                        ? styles.dayCompleted
                        : index === completedDaysThisWeek && !completed
                        ? styles.dayCurrent 
                        : styles.dayIncomplete
                    }
                  >
                    {completed && <Zap className={styles.dayFlame} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Streak;