// ⚙️ React e bibliotecas externas
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { Button } from 'reactstrap';
import { User } from 'lucide-react';

// 💅 Estilos
import styles from '../../../components/modal/SettingsModal.module.css';

// 🧠 Hooks customizados
import useFlashMessage from '../../../hooks/userFlashMessage';
import { useMemorizeFilters, POSSIBLE_FILTERS_ENTITIES } from '../../../hooks/useMemorizeInputsFilters';

// 🔐 Serviços / API
import ServiceUsers from '../../../services/ServiceUsers';

// 🧰 Utilitários
import errorFormMessage from '../../../utils/errorFormMessage';


const ProfileSection = () => {
  const { setFlashMessage } = useFlashMessage();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      name: '',
      bio: ''
    }
  });
  const { getMemorizedFilters, memorizeFilters } = useMemorizeFilters(
    POSSIBLE_FILTERS_ENTITIES.USERS
  );

  useEffect(() => {
    async function fetchUser() {
      const response = await ServiceUsers.getByUser(getMemorizedFilters()?.id);
      memorizeFilters({
        ...getMemorizedFilters(),
        name: response.data.data.user.name
      });
      reset({
        name: response.data.data.user.name || '',
        bio: response.data.data.user.bio || ''
      });
    }
    fetchUser();
  }, []);

  const onSubmit = async (data) => {
    try {
      const currentUser = getMemorizedFilters();

      

      const formatData = {
        name: data.name,
        bio: data.bio || ''
      };

      await ServiceUsers.editUser(currentUser.id, formatData);

      memorizeFilters({
        ...currentUser,
        name: data.name
      });

      setFlashMessage('Perfil atualizado com sucesso!', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      setFlashMessage('Erro ao atualizar perfil', 'error');
    }
  };
// TODO: LIDAR COM FOTO
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
            render={({ message }) => errorFormMessage(message)}
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
            render={({ message }) => errorFormMessage(message)}
          />
        </div>

        <Button type="submit" className={styles.saveButton}>
          Salvar alterações
        </Button>
      </form>
    </div>
  );
};

export default ProfileSection;
