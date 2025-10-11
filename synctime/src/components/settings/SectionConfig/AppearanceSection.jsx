import { useForm, Controller } from 'react-hook-form';
import styles from '../../../components/modal/SettingsModal.module.css';
import { ErrorMessage } from '@hookform/error-message';
import useFlashMessage from '../../../hooks/userFlashMessage';
import {
  POSSIBLE_FILTERS_ENTITIES,
  useMemorizeFilters
} from '../../../hooks/useMemorizeInputsFilters';

const AppearanceSection = () => {
  const { setFlashMessage } = useFlashMessage();
  const { getMemorizedFilters, memorizeFilters } = useMemorizeFilters(
    POSSIBLE_FILTERS_ENTITIES.SYSTEM_CONFIG
  );

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      theme: getMemorizedFilters()?.theme || 'dark',
      emphasisColor: getMemorizedFilters()?.emphasisColor || 'rgb(20, 18, 129)'
    }
  });

  const onSubmit = (data) => {
    try {
      const currentConfig = getMemorizedFilters() || {};

      const updatedConfig = {
        ...currentConfig,
        theme: data.theme || currentConfig.theme || 'dark',
        emphasisColor:
          data.emphasisColor ||
          currentConfig.emphasisColor ||
          'rgb(20, 18, 129)'
      };

      memorizeFilters(updatedConfig);

      console.log('Appearance settings submitted:', updatedConfig);
      setFlashMessage(
        'Configurações de aparência salvas com sucesso!',
        'success'
      );
    } catch (error) {
      console.error('Error saving appearance settings:', error);
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
                      background:
                        'linear-gradient(90deg, #fff 50%, #1a1a1a 50%)'
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
            render={({ message }) => (
              <span className={styles.error}>{message}</span>
            )}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Cor de ênfase</label>
          <Controller
            name="emphasisColor"
            control={control}
            rules={{ required: 'Cor de ênfase é obrigatória' }}
            render={({ field }) => (
              <div className={styles.colorOptions}>
                {[
                  { name: 'default', color: '#141281' },
                  { name: 'blue', color: '#3b82f6' },
                  { name: 'green', color: '#10b981' },
                  { name: 'purple', color: '#8b5cf6' },
                  { name: 'red', color: '#ef4444' }
                ].map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    className={`${styles.colorOption} ${
                      field.value === item.color ? styles.selected : ''
                    }`}
                    onClick={() => field.onChange(item.color)}
                    style={{
                      background: item.color
                    }}
                  >
                    {field.value === item.color && (
                      <span className={styles.checkmark}>✓</span>
                    )}
                  </button>
                ))}
                <div className={styles.customColorWrapper}>
                  <input
                    type="color"
                    className={styles.colorInput}
                    value={
                      field.value?.startsWith('#') ? field.value : '#141281'
                    }
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  <div
                    className={`${styles.colorOption} ${
                      ![
                        '#141281',
                        '#3b82f6',
                        '#10b981',
                        '#8b5cf6',
                        '#ef4444'
                      ].includes(field.value)
                        ? styles.selected
                        : ''
                    }`}
                    style={{
                      background: field.value?.startsWith('#')
                        ? field.value
                        : '#141281'
                    }}
                  >
                    {![
                      '#141281',
                      '#3b82f6',
                      '#10b981',
                      '#8b5cf6',
                      '#ef4444'
                    ].includes(field.value) && (
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
            render={({ message }) => (
              <span className={styles.error}>{message}</span>
            )}
          />
        </div>

        <button type="submit" className={styles.saveButton}>
          Salvar alterações
        </button>
      </form>
    </div>
  );
};

export default AppearanceSection;
