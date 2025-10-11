import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { useTheme } from '../../hooks/useTheme';
import styles from './NewPassword.module.css';
import useFlashMessage from '../../hooks/userFlashMessage';
import errorFormMessage from '../../utils/errorFormMessage';

const NewPassword = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const { setFlashMessage } = useFlashMessage();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Simulating API call
      // await apiChangePassword(data);
      setFlashMessage('Senha alterada com sucesso!', 'success');
      reset();
      onClose();
    } catch (error) {
      setFlashMessage(error.message || 'Erro ao alterar senha', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div
        className={`${styles.modal} ${styles[theme]}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2>Alterar Senha</h2>
          <button
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.inputGroup}>
            <label htmlFor="oldPassword">Senha Atual</label>
            <div className={styles.passwordWrapper}>
              <Controller
                name="oldPassword"
                control={control}
                rules={{ required: 'Senha atual é obrigatória' }}
                render={({ field }) => (
                  <input
                    type='password'
                    id="oldPassword"
                    {...field}
                    className={errors.oldPassword ? styles.inputError : ''}
                    disabled={isLoading}
                  />
                )}
              />
            </div>
            <ErrorMessage
              errors={errors}
              name="oldPassword"
              render={({ message }) => errorFormMessage(message)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="newPassword">Nova Senha</label>
            <div className={styles.passwordWrapper}>
              <Controller
                name="newPassword"
                control={control}
                rules={{ required: 'Nova senha é obrigatória' }}
                render={({ field }) => (
                  <input
                    type='password'
                    id="newPassword"
                    {...field}
                    className={errors.newPassword ? styles.inputError : ''}
                    disabled={isLoading}
                  />
                )}
              />
            </div>
            <ErrorMessage
              errors={errors}
              name="newPassword"
              render={({ message }) => errorFormMessage(message)}
            />
            <small className={styles.hint}>Mínimo de 8 caracteres</small>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
            <div className={styles.passwordWrapper}>
              <Controller
                name="confirmPassword"
                control={control}
                rules={{ required: 'Confirmação de senha é obrigatória' }}
                render={({ field }) => (
                  <input
                    type='password'
                    id="confirmPassword"
                    {...field}
                    className={errors.confirmPassword ? styles.inputError : ''}
                    disabled={isLoading}
                  />
                )}
              />
            </div>
            <ErrorMessage
              errors={errors}
              name="confirmPassword"
              render={({ message }) => errorFormMessage(message)}
            />
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={handleClose}
              className={styles.cancelButton}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? 'Alterando...' : 'Alterar Senha'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPassword;
