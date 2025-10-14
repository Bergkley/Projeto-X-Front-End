import { User,  Settings, PaintBucket, ClipboardList } from 'lucide-react';
import styles from './SectionConfigSystem.module.css';

const SectionConfigSystem = () => {
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
    <div className={styles.container}>
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
                <div className={styles.iconWrapper}>
                  <Icon size={20} />
                </div>
                <h3 className={styles.cardTitle}>{section.title}</h3>
              </div>
              
              {section.items.length > 0 && (
                <ul className={styles.itemList}>
                  {section.items.map((item, index) => (
                    <li key={index} className={styles.item}>
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