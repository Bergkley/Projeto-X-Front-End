import { User } from 'lucide-react';
import styles from '../../../components/modal/SettingsModal.module.css';
import { useForm, Controller } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import useFlashMessage from '../../../hooks/userFlashMessage';
import { Button } from 'reactstrap';

const ProfileSection = () => {
  const { setFlashMessage } = useFlashMessage();
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      bio: ''
    }
  });

  const onSubmit = (data) => {
    try {
      console.log('Profile data submitted:', data);
      setFlashMessage('Perfil atualizado com sucesso!', 'success');
    } catch (error) {
      setFlashMessage('Erro ao atualizar perfil', 'error');
    }
  };

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

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Nome</label>
          <Controller
            name="name"
            control={control}
            rules={{ 
              required: 'Nome é obrigatório',
              minLength: {
                value: 2,
                message: 'Nome deve ter pelo menos 2 caracteres'
              }
            }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className={styles.input}
                placeholder="Seu nome"
              />
            )}
          />
          <ErrorMessage
            errors={errors}
            name="name"
            render={({ message }) => <span className={styles.error}>{message}</span>}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Bio</label>
          <Controller
            name="bio"
            control={control}
            rules={{ 
              maxLength: {
                value: 200,
                message: 'Bio não pode exceder 200 caracteres'
              }
            }}
            render={({ field }) => (
              <textarea
                {...field}
                className={styles.textarea}
                placeholder="Conte um pouco sobre você"
                rows={4}
              />
            )}
          />
          <ErrorMessage
            errors={errors}
            name="bio"
            render={({ message }) => <span className={styles.error}>{message}</span>}
          />
        </div>

        <Button type="submit" className={styles.saveButton}>Salvar alterações</Button>
      </form>
    </div>
  );
};

export default ProfileSection;