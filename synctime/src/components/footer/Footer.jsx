import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} <strong>SynTime</strong>. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;