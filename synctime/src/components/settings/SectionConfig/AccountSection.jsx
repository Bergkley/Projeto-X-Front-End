import { useState } from 'react';
import styles from '../../../components/modal/SettingsModal.module.css';
import useFlashMessage from '../../../hooks/userFlashMessage';
import NewPassword from '../../newPassword/newPassword';

const AccountSection = () => {
  const { setFlashMessage } = useFlashMessage();
    const [showAlterPassword, setShowAlterPassword] = useState(false);
  
  

  const onSubmit = (data) => {
    try {
      if (data.password !== data.confirmPassword) {
        setFlashMessage('As senhas não coincidem', 'error');
        return;
      }
      console.log('Password change submitted:', data);
      setFlashMessage('Senha atualizada com sucesso!', 'success');
    } catch (error) {
      setFlashMessage('Erro ao atualizar senha', 'error');
    }
  };

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
        <label className={styles.label}>Login</label>
        <input 
          type="login" 
          className={styles.input}
          defaultValue=""
          disabled
        />
        <span className={styles.helpText}>O email não pode ser alterado</span>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Alterar senha</label>
        <button className={styles.dangerButton} onClick={() => setShowAlterPassword(true)}>Alterar senha</button> 
      </div>

      

      <div className={styles.divider}></div>

      <div className={styles.dangerZone}>
        <h4 className={styles.dangerTitle}>Zona de perigo</h4>
        <p className={styles.dangerText}>
          Esta ação é irreversível e removerá permanentemente sua conta.
        </p>
        <button className={styles.dangerButton}>Excluir conta</button>
      </div>
      <NewPassword
        isOpen={showAlterPassword}
        onClose={() => setShowAlterPassword(false)}
      />
    </div>
  );
};

export default AccountSection;