import { useForm, Controller } from 'react-hook-form';
import styles from '../../../components/modal/SettingsModal.module.css';
import { ErrorMessage } from '@hookform/error-message';
import useFlashMessage from '../../../hooks/userFlashMessage';

const AppearanceSection = () => {
  const { setFlashMessage } = useFlashMessage();
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      theme: 'dark',
      emphasisColor: 'default'
    }
  });

  const onSubmit = (data) => {
    try {
      console.log('Appearance settings submitted:', data);
      setFlashMessage('Configurações de aparência salvas com sucesso!', 'success');
    } catch (error) {
      setFlashMessage('Erro ao salvar configurações de aparência', 'error');
    }
  };

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Aparência</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Tema</label>
          <Controller
            name="theme"
            control={control}
            rules={{ required: 'Tema é obrigatório' }}
            render={({ field }) => (
              <div className={styles.themeOptions}>
                <button
                  type="button"
                  className={`${styles.themeOption} ${
                    field.value === 'light' ? styles.selected : ''
                  }`}
                  onClick={() => field.onChange('light')}
                >
                  <div
                    className={styles.themePreview}
                    style={{ background: '#fff' }}
                  ></div>
                  <span>Claro</span>
                </button>
                <button
                  type="button"
                  className={`${styles.themeOption} ${
                    field.value === 'dark' ? styles.selected : ''
                  }`}
                  onClick={() => field.onChange('dark')}
                >
                  <div
                    className={styles.themePreview}
                    style={{ background: '#1a1a1a' }}
                  ></div>
                  <span>Escuro</span>
                </button>
                <button
                  type="button"
                  className={`${styles.themeOption} ${
                    field.value === 'auto' ? styles.selected : ''
                  }`}
                  onClick={() => field.onChange('auto')}
                >
                  <div
                    className={styles.themePreview}
                    style={{
                      background: 'linear-gradient(90deg, #fff 50%, #1a1a1a 50%)'
                    }}
                  ></div>
                  <span>Auto</span>
                </button>
              </div>
            )}
          />
          <ErrorMessage
            errors={errors}
            name="theme"
            render={({ message }) => <span className={styles.error}>{message}</span>}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Cor do Tema</label>
          <Controller
            name="emphasisColor"
            control={control}
            rules={{ required: 'Cor de ênfase é obrigatória' }}
            render={({ field }) => (
              <div className={styles.colorOptions}>
                {['default', 'blue', 'green', 'purple', 'red'].map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`${styles.colorOption} ${
                      field.value === color ? styles.selected : ''
                    }`}
                    onClick={() => field.onChange(color)}
                    style={{
                      background: {
                        default: '#666',
                        blue: '#3b82f6',
                        green: '#10b981',
                        purple: '#8b5cf6',
                        red: '#ef4444'
                      }[color]
                    }}
                  >
                    {field.value === color && (
                      <span className={styles.checkmark}>✓</span>
                    )}
                  </button>
                ))}
                <div className={styles.customColorWrapper}>
                  <input
                    type="color"
                    className={styles.colorInput}
                    value={typeof field.value === 'string' && field.value.startsWith('#') ? field.value : '#666666'}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  <div 
                    className={`${styles.colorOption} ${
                      typeof field.value === 'string' && field.value.startsWith('#') ? styles.selected : ''
                    }`}
                    style={{
                      background: typeof field.value === 'string' && field.value.startsWith('#') ? field.value : '#666666'
                    }}
                  >
                    {typeof field.value === 'string' && field.value.startsWith('#') && (
                      <span className={styles.checkmark}>✓</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          />
          <ErrorMessage
            errors={errors}
            name="emphasisColor"
            render={({ message }) => <span className={styles.error}>{message}</span>}
          />
        </div>

        <button type="submit" className={styles.saveButton}>Salvar alterações</button>
      </form>
    </div>
  );
};

export default AppearanceSection;