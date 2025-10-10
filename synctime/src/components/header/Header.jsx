import { useState } from 'react';
import styles from './Header.module.css';
import { Bell, Zap } from 'lucide-react';
import Streak from '../streak/Streak';
import NotificationsDropdown from '../notification/NotificationsDropdown';
import ProfileDropdown from '../settings/ProfileDropdown';

const Header = () => {
  const [notificationCount, setNotificationCount] = useState(3);
  const [streakDays, setStreakDays] = useState(30);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  const weekProgress = [true, true, true, true, true, true, true];
  const completedDaysThisWeek = weekProgress.filter((d) => d).length;

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
                  aria-label="Ver progresso de sequência"
                >
                  <div
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Zap
                      className={styles.flameIcon}
                      style={{
                        color: getFlameColor(),
                        filter:
                          streakDays >= 7
                            ? 'drop-shadow(0 0 8px currentColor)'
                            : 'none'
                      }}
                      fill={streakDays >= 3 ? getFlameColor() : 'none'}
                    />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: '0.125rem'
                    }}
                  >
                    <span
                      className={styles.streakNumber}
                      style={{
                        color: getFlameColor(),
                        textShadow:
                          streakDays >= 7
                            ? `0 0 10px ${getFlameColor()}40`
                            : 'none',
                        lineHeight: '1'
                      }}
                    >
                      {streakDays}
                    </span>
                    <span
                      style={{
                        fontSize: '0.625rem',
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontWeight: '500',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        lineHeight: '1'
                      }}
                    >
                      dias
                    </span>
                  </div>
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
                  src="https://img.freepik.com/fotos-gratis/retrato-de-homem-branco-isolado_53876-40306.jpg"
                  alt="User Avatar"
                  className={styles.avatar}
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  style={{ cursor: 'pointer' }}
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

      {/* Render Profile Dropdown */}
      {showProfileDropdown && (
        <ProfileDropdown onClose={() => setShowProfileDropdown(false)} />
      )}
    </>
  );
};

export default Header;
