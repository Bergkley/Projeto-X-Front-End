import { Settings, Key, LogOut } from 'lucide-react';
import styles from './ProfileDropdown.module.css';
import SettingsModal from '../modal/SettingsModal';
import { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import NewPassword from '../newPassword/newPassword';
import useAuth from '../../hooks/userAuth';

const ProfileDropdown = ({ onClose }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showAlterPassword, setShowAlterPassword] = useState(false);
  const { theme } = useTheme();
  const {logout} = useAuth();

  const handleItemClick = (action) => {
    if (action === 'configuracoes') {
      setShowSettings(true);
    } else if (action === 'alterar-senha') {
      setShowAlterPassword(true);
    } else if (action === 'sair'){
      logout();
    }
    else {
      console.error(`Ação selecionada: ${action}`);
      onClose();
    }
  };

  return (
    <div className={styles.dropdownOverlay} onClick={onClose}>
      <div 
        className={`${styles.dropdown} ${styles[theme]}`} 
        onClick={(e) => e.stopPropagation()}
      >
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
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
      <NewPassword
        isOpen={showAlterPassword}
        onClose={() => setShowAlterPassword(false)}
      />
    </div>
  );
};

export default ProfileDropdown;