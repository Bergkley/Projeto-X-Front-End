import { useState } from 'react';
import styles from '../../../components/modal/SettingsModal.module.css';

const AppearanceSection = () => {
  const [theme, setTheme] = useState('dark');
  const [emphasisColor, setEmphasisColor] = useState('default');

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Aparência</h3>

      <div className={styles.formGroup}>
        <label className={styles.label}>Tema</label>
        <div className={styles.themeOptions}>
          <button
            className={`${styles.themeOption} ${
              theme === 'light' ? styles.selected : ''
            }`}
            onClick={() => setTheme('light')}
          >
            <div
              className={styles.themePreview}
              style={{ background: '#fff' }}
            ></div>
            <span>Claro</span>
          </button>
          <button
            className={`${styles.themeOption} ${
              theme === 'dark' ? styles.selected : ''
            }`}
            onClick={() => setTheme('dark')}
          >
            <div
              className={styles.themePreview}
              style={{ background: '#1a1a1a' }}
            ></div>
            <span>Escuro</span>
          </button>
          <button
            className={`${styles.themeOption} ${
              theme === 'auto' ? styles.selected : ''
            }`}
            onClick={() => setTheme('auto')}
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
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Cor de ênfase</label>
        <div className={styles.colorOptions}>
          {['default', 'blue', 'green', 'purple', 'red'].map((color) => (
            <button
              key={color}
              className={`${styles.colorOption} ${
                emphasisColor === color ? styles.selected : ''
              }`}
              onClick={() => setEmphasisColor(color)}
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
              {emphasisColor === color && (
                <span className={styles.checkmark}>✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <button className={styles.saveButton}>Salvar alterações</button>
    </div>
  );
};
export default AppearanceSection;
