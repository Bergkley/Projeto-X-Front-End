import { User } from 'lucide-react';
import styles from '../../../components/modal/SettingsModal.module.css';
const ProfileSection = () => {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Perfil</h3>
      
      <div className={styles.formGroup}>
        <label className={styles.label}>Foto de perfil</label>
        <div className={styles.avatarContainer}>
          <div className={styles.avatar}>
            <User size={40} />
          </div>
          <button className={styles.changeAvatarBtn}>Alterar foto</button>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Nome</label>
        <input 
          type="text" 
          className={styles.input}
          placeholder="Seu nome"
          defaultValue="bergxbergx2@gmail.com"
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Bio</label>
        <textarea 
          className={styles.textarea}
          placeholder="Conte um pouco sobre você"
          rows={4}
        />
      </div>

      <button className={styles.saveButton}>Salvar alterações</button>
    </div>
  );
};

export default ProfileSection;