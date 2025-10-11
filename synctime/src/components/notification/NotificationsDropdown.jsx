import { useState } from 'react';
import { Filter, Trash2, ExternalLink, X, Check, Bell } from 'lucide-react';
import styles from './NotificationsDropdown.module.css';
import { useTheme } from '../../hooks/useTheme';
import { useEmphasisColor } from '../../hooks/useEmphasisColor';

const NotificationsDropdown = ({ onClose }) => {
  const { theme } = useTheme();
  const { emphasisColor } = useEmphasisColor();
  const [filter, setFilter] = useState('todas');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [typeFilter, setTypeFilter] = useState('todos');
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      text: 'Novo protocolo #1234 atribuído', 
      time: '5 min atrás', 
      read: false, 
      type: 'protocolo',
      link: '/protocolos/1234'
    },
    { 
      id: 2, 
      text: 'Relatório mensal disponível', 
      time: '1 hora atrás', 
      read: false, 
      type: 'relatorio',
      link: '/relatorios/mensal'
    },
    { 
      id: 3, 
      text: 'Atualização de status do ticket #5678', 
      time: '2 horas atrás', 
      read: true, 
      type: 'ticket',
      link: '/tickets/5678'
    },
    { 
      id: 4, 
      text: 'Nova mensagem da equipe', 
      time: '3 horas atrás', 
      read: false, 
      type: 'mensagem',
      link: '/mensagens/1'
    },
    { 
      id: 5, 
      text: 'Tarefa #789 foi concluída', 
      time: '5 horas atrás', 
      read: true, 
      type: 'tarefa',
      link: '/tarefas/789'
    },
    { 
      id: 6, 
      text: 'Relatório semanal pronto para revisão', 
      time: '1 dia atrás', 
      read: false, 
      type: 'relatorio',
      link: '/relatorios/semanal'
    },
  ]);

  const typeOptions = [
    { value: 'todos', label: 'Todos os tipos' },
    { value: 'protocolo', label: 'Protocolos' },
    { value: 'relatorio', label: 'Relatórios' },
    { value: 'ticket', label: 'Tickets' },
    { value: 'mensagem', label: 'Mensagens' },
    { value: 'tarefa', label: 'Tarefas' },
  ];

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const clearReadNotifications = () => {
    setNotifications(notifications.filter(n => !n.read));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'lidas' && !n.read) return false;
    if (filter === 'naoLidas' && n.read) return false;
    if (typeFilter !== 'todos' && n.type !== typeFilter) return false;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const readCount = notifications.filter(n => n.read).length;

  const getTypeColor = (type) => {
    const colors = {
      protocolo: styles.typeProtocolo,
      relatorio: styles.typeRelatorio,
      ticket: styles.typeTicket,
      mensagem: styles.typeMensagem,
      tarefa: styles.typeTarefa,
    };
    return colors[type] || styles.typeDefault;
  };

  const getTypeLabel = (type) => {
    const labels = {
      protocolo: 'Protocolo',
      relatorio: 'Relatório',
      ticket: 'Ticket',
      mensagem: 'Mensagem',
      tarefa: 'Tarefa',
    };
    return labels[type] || type;
  };

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
                        <span className={`${styles.typeBadge} ${getTypeColor(notification.type)}`}>
                          {getTypeLabel(notification.type)}
                        </span>
                        <span className={styles.notificationTime}>{notification.time}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <a
                      href={notification.link}
                      className={styles.actionButton}
                      onClick={(e) => {
                        e.preventDefault();
                        markAsRead(notification.id);
                        alert(`Navegando para: ${notification.link}`);
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