import { useState } from 'react';
import styles from './Header.module.css';
import { Bell, Zap } from 'lucide-react';
import Streak from '../streak/Streak';
import NotificationsDropdown from '../notification/NotificationsDropdown';

const Header = () => {
  const [notificationCount, setNotificationCount] = useState(3);
  const [streakDays, setStreakDays] = useState(30);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);

  const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  const weekProgress = [true, true, true, true, true, true, true];
  const completedDaysThisWeek = weekProgress.filter((d) => d).length;

  const notifications = [
    { id: 1, text: 'Novo protocolo atribuído', time: '5 min atrás' },
    { id: 2, text: 'Atualização de status', time: '1 hora atrás' },
    { id: 3, text: 'Mensagem da equipe', time: '2 horas atrás' }
  ];

  const getFlameColor = () => {
    if (streakDays >= 30) return '#ff0000';
    if (streakDays >= 14) return '#ff6b00';
    if (streakDays >= 7) return '#ffa500';
    if (streakDays >= 3) return '#ffd700';
    return '#fed7aa';
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.content}>
            <span className={styles.brandName}></span>

            {/* Right Side Actions */}
            <div className={styles.actions}>
              {/* Streak Counter */}
              <div className={styles.streakContainer}>
                <button
                  onClick={() => setShowStreakModal(true)}
                  className={styles.streakButton}
                >
                  <Zap
                    className={styles.flameIcon}
                    style={{ color: getFlameColor() }}
                  />
                  <span
                    className={styles.streakNumber}
                    style={{ color: getFlameColor() }}
                  >
                    {streakDays}
                  </span>
                </button>
              </div>

              {/* Notifications */}
              <div className={styles.notificationWrapper}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={styles.notificationButton}
                >
                  <Bell className={styles.bellIcon} />
                  {notificationCount > 0 && (
                    <span className={styles.badge}>{notificationCount}</span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <NotificationsDropdown
                    onClose={() => setShowNotifications(false)}
                  />
                )}
              </div>

              {/* User Profile */}
              <div className={styles.profileContainer}>
                <img
                  src="https://img.freepik.com/fotos-gratis/retrato-de-homem-branco-isolado_53876-40306.jpg?semt=ais_hybrid&w=740&q=80"
                  alt="User Avatar"
                  className={styles.avatar}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Render Steak Modal */}
      {showStreakModal && (
        <Streak
          streakDays={streakDays}
          weekDays={weekDays}
          weekProgress={weekProgress}
          completedDaysThisWeek={completedDaysThisWeek}
          onClose={() => setShowStreakModal(false)}
          getFlameColor={getFlameColor}
        />
      )}
    </>
  );
};

export default Header;
