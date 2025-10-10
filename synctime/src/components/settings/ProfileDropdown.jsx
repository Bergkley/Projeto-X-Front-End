import { Settings, Key, LogOut } from 'lucide-react';
import styles from './ProfileDropdown.module.css';

const ProfileDropdown = ({ onClose }) => {
  const handleItemClick = (action) => {
    console.log(`Ação selecionada: ${action}`);
    onClose();
  };

  return (
    <div className={styles.dropdownOverlay} onClick={onClose}>
      <div className={styles.dropdown} onClick={(e) => e.stopPropagation()}>
        <div className={styles.userInfo}>
          <span className={styles.name}>bergxbergx2@gmail.com</span>
        </div>

        <div className={styles.menuItems}>
          <button 
            className={styles.menuItem}
            onClick={() => handleItemClick('configuracoes')}
          >
            <Settings className={styles.icon} size={18} />
            <span>Configurações</span>
          </button>

          <button 
            className={styles.menuItem}
            onClick={() => handleItemClick('alterar-senha')}
          >
            <Key className={styles.icon} size={18} />
            <span>Alterar a senha</span>
          </button>

          <div className={styles.divider}></div>

          <button 
            className={styles.menuItem}
            onClick={() => handleItemClick('sair')}
          >
            <LogOut className={styles.icon} size={18} />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDropdown;