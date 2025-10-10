import { Zap, X } from 'lucide-react';
import styles from './Streak.module.css';

const Streak = ({
  streakDays,
  weekDays,
  weekProgress,
  completedDaysThisWeek,
  onClose,
  getFlameColor,
}) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
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
                    className={index === 4 ? styles.dayActive : styles.day} // Highlight Thursday as current day
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
                style={{ width: `${(completedDaysThisWeek / 7) * 100}%` }} // 5/7 = 71.43%
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
                        ? styles.dayCurrent // Highlight the next incomplete day if it's the current count
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