import { useState} from 'react';
import { Link } from 'react-router-dom';
import styles from './Login.module.css';
import Button from './../../components/button/Button';
import Input from './../../components/Input/input';
import Logo from '../../assets/logo.svg';


const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

 

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login:', formData);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.leftSection}>
          <div className={styles.decorativeCircle1}></div>
          <div className={styles.decorativeCircle2}></div>

          <h1 className={styles.title}>Bem-vindo de volta!</h1>
          
          <div className={styles.logoWrapper}>
            <img 
              src={Logo}
              alt="SyncTime Logo" 
              className={styles.logo}
            />
          </div>
          
          <p className={styles.description}>
            Acesse sua conta e continue organizando seu tempo de forma eficiente.
          </p>
          
        </div>

        <div className={styles.rightSection}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Login</h2>
            <p className={styles.formSubtitle}>
              Entre com suas credenciais
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                E-mail
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Senha
              </label>
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={styles.input}
                placeholder="••••••••"
                required
              />
            </div>

            <div className={styles.options}>
              <Link to="/forgot-password" className={styles.forgotLink}>
                Esqueceu a senha?
              </Link>
            </div>

            <Button 
              label="Entrar" 
              variant="animated"
              type="submit"
              className={styles.submitButton}
            />
          </form>

          <div className={styles.footer}>
            <p>
              Não tem uma conta?{' '}
              <Link to="/register" className={styles.registerLink}>
                Registre-se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;