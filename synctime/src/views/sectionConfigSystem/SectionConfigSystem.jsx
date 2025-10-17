// ⚙️ Bibliotecas externas
import { User, Settings, PaintBucket, ClipboardList } from 'lucide-react';

// 💅 Estilos
import styles from './SectionConfigSystem.module.css';

// 🧠 Hooks customizados
import { useTheme } from '../../hooks/useTheme';
import { useEmphasisColor } from '../../hooks/useEmphasisColor';

const SectionConfigSystem = () => {
  const { theme } = useTheme();
  const { emphasisColor } = useEmphasisColor();

  const configSections = [
    {
      id: 'geral',
      title: 'Geral',
      icon: Settings,
      items: ['Configuração geral', 'Campos Customizados', 'Privacidade'],
      subtitle: 'Definições básicas do sistema'
    },
    {
      id: 'Aparencia',
      title: 'Aparencia',
      icon: PaintBucket,
      items: ['Temas'],
      subtitle: 'Personalize a aparência do sistema'
    },
    {
      id: 'Relatorios',
      title: 'Relatorios',
      icon: ClipboardList,
      items: ['Categoria'],
      subtitle: 'Configurações de relatórios e análises'
    },
    {
      id: 'conta',
      title: 'Conta',
      icon: User,
      items: ['Configuração da conta', 'Alterar senha', 'Esqueceu senha'],
      subtitle: 'Gerencie as informações da sua conta'
    },
  ];

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Configurações</h1>
        <p className={styles.description}>Gerencie as configurações do sistema</p>
      </div>

      <div className={styles.grid}>
        {configSections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div 
                  className={styles.iconWrapper}
                  style={{
                    background: `linear-gradient(135deg, ${emphasisColor || '#ff6fa3'} 0%, ${emphasisColor || '#e91e63'} 100%)`,
                    boxShadow: `0 2px 6px ${emphasisColor ? `${emphasisColor}40` : 'rgba(233, 30, 99, 0.25)'}`
                  }}
                >
                  <Icon size={20} />
                </div>
                <h3 className={styles.cardTitle}>{section.title}</h3>
              </div>
              
              {section.items.length > 0 && (
                <ul className={styles.itemList}>
                  {section.items.map((item, index) => (
                    <li 
                      key={index} 
                      className={styles.item}
                      style={{
                        '--hover-color': emphasisColor || '#e91e63',
                        '--hover-bg-opacity': theme === 'dark' ? '0.1' : '0.05'
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              
              {section.subtitle && (
                <div className={styles.subtitle}>
                  <span className={styles.subtitleIcon}>ⓘ</span>
                  <span>{section.subtitle}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SectionConfigSystem;