// LoadingSpinner.jsx
import styles from './LoadingSpinner.module.css';

const LoadingSpinner = ({ message = 'Carregando...' }) => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}>
        <div className={styles.spinnerInner}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <p className={styles.loadingMessage}>{message}</p>
    </div>
  );
};

export default LoadingSpinner;