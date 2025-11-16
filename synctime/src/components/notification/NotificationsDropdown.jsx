// ⚙️ React e bibliotecas externas
import { useState, useEffect } from 'react';
import { Filter, Trash2, ExternalLink, X, Check, Bell } from 'lucide-react';
import { useHistory } from 'react-router-dom';


// 💅 Estilos
import styles from './NotificationsDropdown.module.css';

// 🧠 Hooks customizados
import { useTheme } from '../../hooks/useTheme';
import { useEmphasisColor } from '../../hooks/useEmphasisColor';
import useFlashMessage from '../../hooks/userFlashMessage';


// 📡 Serviço de notificações
import ServiceNotification from './services/ServiceNotification';


const NotificationsDropdown = ({ onClose }) => {
  const { theme } = useTheme();
  const { emphasisColor } = useEmphasisColor();
  const [filter, setFilter] = useState('todas');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [typeFilter, setTypeFilter] = useState('todos');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const { setFlashMessage } = useFlashMessage();
    


const formatRelativeTime = (dateStr) => {

  const utcDate = new Date(dateStr);

  const brDate = new Date(utcDate.getTime() - 3 * 60 * 60 * 1000);

  const nowUtc = new Date();
  const nowBr = new Date(nowUtc.getTime());

  const diff = nowBr - brDate;

  if (diff < 0) return "Agora";

  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "Agora";
  if (minutes < 60) return `${minutes} min atrás`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours} hora${hours > 1 ? "s" : ""} atrás`;

  const days = Math.floor(hours / 24);

  const result = `${days} dia${days > 1 ? "s" : ""} atrás`;

  return result;
};


  const getTypeColor = (entity) => {
    const colors = {
      'Registro Mensal': styles.typeRelatorio, 
    };
    return colors[entity] || styles.typeDefault; 
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await ServiceNotification.getByAllNotification();
      if (response.data.status === 'OK') {
        const mappedNotifications = response.data.data.map((n) => ({
          id: n.id,
          text: n.title, 
          time: formatRelativeTime(n.created_at),
          read: n.isRead,
          entity: n.entity, 
          link: n.path,
        }));
        setNotifications(mappedNotifications);
      }
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const uniqueEntities = [...new Set(notifications.map(n => n.entity))];
  const typeOptions = [
    { value: 'todos', label: 'Todos os tipos' },
    ...uniqueEntities.map(entity => ({ value: entity, label: entity }))
  ].sort((a, b) => a.label.localeCompare(b.label)); 

  const markAsRead = async (id) => {
    try {
      await ServiceNotification.markReadNotification({ ids: [id] });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  const clearReadNotifications = async () => {
    const readNotifications = notifications.filter((n) => n.read);
    if (readNotifications.length === 0) return;

    const readIds = readNotifications.map((n) => n.id);
    try {
      await ServiceNotification.deleteNotification({ ids: readIds });
      setNotifications((prev) => prev.filter((n) => !n.read));
      setFlashMessage('Notificações lidas limpas com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao limpar notificações lidas:', error);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'lidas' && !n.read) return false;
    if (filter === 'naoLidas' && n.read) return false;
    if (typeFilter !== 'todos' && n.entity !== typeFilter) return false;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;
  const readCount = notifications.filter((n) => n.read).length;

  if (loading) {
    return (
      <div className={`${styles.dropdown} ${styles[theme]}`}>
        <div className={styles.dropdownHeader} style={{ background: emphasisColor || 'rgb(20, 18, 129)' }}>
          <div className={styles.dropdownHeaderInner}>
            <div className={styles.dropdownHeaderLeft}>
              <Bell className={styles.dropdownBellIcon} />
              <h2 className={styles.dropdownTitle}>Notificações</h2>
            </div>
            <button onClick={onClose} className={styles.closeButton}>
              <X className={styles.closeIcon} />
            </button>
          </div>
        </div>
        <div className={styles.notificationsList}>
          <div className={styles.emptyState}>
            <p>Carregando notificações...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className={styles.backdrop}
        onClick={() => {
          onClose();
          setShowFilterMenu(false);
        }}
      />
      
      {/* Dropdown Panel */}
      <div className={`${styles.dropdown} ${styles[theme]}`}>
        {/* Header */}
        <div 
          className={styles.dropdownHeader}
          style={{ background: emphasisColor || 'rgb(20, 18, 129)' }}
        >
          <div className={styles.dropdownHeaderInner}>
            <div className={styles.dropdownHeaderLeft}>
              <Bell className={styles.dropdownBellIcon} />
              <h2 className={styles.dropdownTitle}>Notificações</h2>
            </div>
            <button
              onClick={onClose}
              className={styles.closeButton}
            >
              <X className={styles.closeIcon} />
            </button>
          </div>
          <p className={styles.dropdownSubtitle}>
            {unreadCount} não {unreadCount === 1 ? 'lida' : 'lidas'}
          </p>
        </div>

        {/* Filters */}
        <div className={styles.filtersContainer}>
          <div className={styles.filtersInner}>
            {/* Status Filter */}
            <div className={styles.statusFilter}>
              <button
                onClick={() => setFilter('todas')}
                className={`${styles.filterButton} ${filter === 'todas' ? styles.filterButtonActive : ''}`}
                style={filter === 'todas' ? { 
                  backgroundColor: emphasisColor || 'rgb(20, 18, 129)' 
                } : {}}
              >
                Todas
                <span className={`${styles.filterBadge} ${filter === 'todas' ? styles.filterBadgeActive : ''}`}>
                  {notifications.length}
                </span>
              </button>
              <button
                onClick={() => setFilter('naoLidas')}
                className={`${styles.filterButton} ${filter === 'naoLidas' ? styles.filterButtonActive : ''}`}
                style={filter === 'naoLidas' ? { 
                  backgroundColor: emphasisColor || 'rgb(20, 18, 129)' 
                } : {}}
              >
                Não Lidas
                <span className={`${styles.filterBadge} ${filter === 'naoLidas' ? styles.filterBadgeUnread : ''}`}>
                  {unreadCount}
                </span>
              </button>
              <button
                onClick={() => setFilter('lidas')}
                className={`${styles.filterButton} ${filter === 'lidas' ? styles.filterButtonActive : ''}`}
                style={filter === 'lidas' ? { 
                  backgroundColor: emphasisColor || 'rgb(20, 18, 129)' 
                } : {}}
              >
                Lidas
                <span className={`${styles.filterBadge} ${filter === 'lidas' ? styles.filterBadgeActive : ''}`}>
                  {readCount}
                </span>
              </button>
            </div>

            {/* Type Filter */}
            <div className={styles.typeFilterWrapper}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFilterMenu(!showFilterMenu);
                }}
                className={styles.typeFilterButton}
              >
                <Filter className={styles.filterIcon} />
                Tipo
              </button>

              {showFilterMenu && (
                <div className={styles.typeFilterDropdown}>
                  {typeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={(e) => {
                        e.stopPropagation();
                        setTypeFilter(option.value);
                        setShowFilterMenu(false);
                      }}
                      className={`${styles.typeFilterOption} ${
                        typeFilter === option.value ? styles.typeFilterOptionActive : ''
                      }`}
                    >
                      {option.label}
                      {typeFilter === option.value && (
                        <Check className={styles.checkIcon} />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Clear Read Button */}
            {readCount > 0 && (
              <button
                onClick={clearReadNotifications}
                className={styles.clearButton}
              >
                <Trash2 className={styles.trashIcon} />
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className={styles.notificationsList}>
          {filteredNotifications.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <Bell className={styles.emptyBellIcon} />
              </div>
              <p className={styles.emptyTitle}>Nenhuma notificação</p>
              <p className={styles.emptySubtitle}>Ajuste os filtros</p>
            </div>
          ) : (
            <div className={styles.notificationsItems}>
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`${styles.notificationItem} ${
                    !notification.read ? styles.notificationItemUnread : ''
                  }`}
                >
                  <div className={styles.notificationItemInner}>
                    {/* Unread Indicator */}
                    <div className={styles.indicatorWrapper}>
                      <div 
                        className={`${styles.indicator} ${
                          !notification.read ? styles.indicatorUnread : styles.indicatorRead
                        }`}
                        style={!notification.read ? {
                          backgroundColor: emphasisColor || '#6366f1'
                        } : {}}
                      />
                    </div>

                    {/* Content */}
                    <div 
                      className={styles.notificationContent}
                      onClick={() => !notification.read && markAsRead(notification.id)}
                    >
                      <p className={`${styles.notificationText} ${
                        !notification.read ? styles.notificationTextUnread : ''
                      }`}>
                        {notification.text}
                      </p>
                      
                      <div className={styles.notificationMeta}>
                        <span className={`${styles.typeBadge} ${getTypeColor(notification.entity)}`}>
                          {notification.entity}
                        </span>
                        <span className={styles.notificationTime}>{notification.time}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <a
                      href={notification.link}
                      className={styles.actionButton}
                      onClick={async (e) => {
                        e.preventDefault();
                        if (!notification.read) {
                          await markAsRead(notification.id);
                        }
                        history.push(notification.link);
                        onClose();
                      }}
                    >
                      <ExternalLink className={styles.externalIcon} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.footerStats}>
            <div className={styles.footerStat}>
              <p className={styles.footerStatLabel}>Total</p>
              <p className={styles.footerStatValue}>{notifications.length}</p>
            </div>
            <div className={styles.footerStat}>
              <p className={styles.footerStatLabel}>Não Lidas</p>
              <p 
                className={styles.footerStatValueUnread}
                style={{ color: emphasisColor || '#6366f1' }}
              >
                {unreadCount}
              </p>
            </div>
            <div className={styles.footerStat}>
              <p className={styles.footerStatLabel}>Lidas</p>
              <p className={styles.footerStatValueRead}>{readCount}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationsDropdown;