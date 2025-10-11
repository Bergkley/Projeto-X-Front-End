import { useState } from 'react';
import styles from '../../../components/modal/SettingsModal.module.css';

const PrivacySection = () => {
  const [settings, setSettings] = useState({
    showProfile: true,
    allowMessages: true,
    showActivity: false,
    dataCollection: true
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Privacidade</h3>
      
      <div className={styles.settingItem}>
        <div className={styles.settingInfo}>
          <label className={styles.settingLabel}>Perfil público</label>
          <span className={styles.settingDescription}>
            Permite que outros usuários vejam seu perfil
          </span>
        </div>
        <label className={styles.switch}>
          <input 
            type="checkbox" 
            checked={settings.showProfile}
            onChange={() => toggleSetting('showProfile')}
          />
          <span className={styles.slider}></span>
        </label>
      </div>

      <div className={styles.settingItem}>
        <div className={styles.settingInfo}>
          <label className={styles.settingLabel}>Permitir mensagens</label>
          <span className={styles.settingDescription}>
            Outros usuários podem enviar mensagens para você
          </span>
        </div>
        <label className={styles.switch}>
          <input 
            type="checkbox" 
            checked={settings.allowMessages}
            onChange={() => toggleSetting('allowMessages')}
          />
          <span className={styles.slider}></span>
        </label>
      </div>

      <div className={styles.settingItem}>
        <div className={styles.settingInfo}>
          <label className={styles.settingLabel}>Mostrar atividade</label>
          <span className={styles.settingDescription}>
            Exibir quando você está online
          </span>
        </div>
        <label className={styles.switch}>
          <input 
            type="checkbox" 
            checked={settings.showActivity}
            onChange={() => toggleSetting('showActivity')}
          />
          <span className={styles.slider}></span>
        </label>
      </div>

      <div className={styles.settingItem}>
        <div className={styles.settingInfo}>
          <label className={styles.settingLabel}>Coleta de dados</label>
          <span className={styles.settingDescription}>
            Permitir coleta de dados para melhorar a experiência
          </span>
        </div>
        <label className={styles.switch}>
          <input 
            type="checkbox" 
            checked={settings.dataCollection}
            onChange={() => toggleSetting('dataCollection')}
          />
          <span className={styles.slider}></span>
        </label>
      </div>

      <button className={styles.saveButton}>Salvar alterações</button>
    </div>
  );
};
export default PrivacySection;