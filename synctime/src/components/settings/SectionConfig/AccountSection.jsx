import styles from '../../../components/modal/SettingsModal.module.css';

const AccountSection = () => {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Conta</h3>
      
      <div className={styles.formGroup}>
        <label className={styles.label}>Email</label>
        <input 
          type="email" 
          className={styles.input}
          defaultValue="bergxbergx2@gmail.com"
          disabled
        />
        <span className={styles.helpText}>O email não pode ser alterado</span>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Senha</label>
        <button className={styles.secondaryButton}>
          Alterar senha
        </button>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.dangerZone}>
        <h4 className={styles.dangerTitle}>Zona de perigo</h4>
        <p className={styles.dangerText}>
          Esta ação é irreversível e removerá permanentemente sua conta.
        </p>
        <button className={styles.dangerButton}>Excluir conta</button>
      </div>
    </div>
  );
};
export default AccountSection