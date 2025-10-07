import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Register.module.css';
import Button from './../../components/button/Button';
import SecurityQuestions from './../../components/securityQuestions/SecurityQuestions';
import Logo from '../../assets/logo.svg';


const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    login: '',
    email: '',
    password: '',
    confirmPassword: '',
    securityQuestions: [{ question: null, answer: '' }]
  });

 

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSecurityQuestionsChange = (questions) => {
    setFormData({
      ...formData,
      securityQuestions: questions
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    const validQuestions = formData.securityQuestions.filter(
      q => q.question && q.answer.trim() !== ''
    );

    if (validQuestions.length === 0) {
      alert('Adicione pelo menos uma pergunta de segurança!');
      return;
    }

    console.log('Register:', { ...formData, securityQuestions: validQuestions });
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Left Section */}
        <div className={styles.leftSection}>
          <div className={styles.decorativeCircle1}></div>
          <div className={styles.decorativeCircle2}></div>

          <h1 className={styles.title}>Junte-se a nós!</h1>
          
          <div className={styles.logoWrapper}>
            <img 
              src={Logo}
              alt="SyncTime Logo" 
              className={styles.logo}
            />
          </div>
          
          <p className={styles.description}>
            Crie sua conta e comece a organizar seu tempo de forma inteligente.
          </p>

          
        </div>

        <div className={styles.rightSection}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Criar Conta</h2>
            <p className={styles.formSubtitle}>
              Preencha os dados para começar
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="name" className={styles.label}>
                Nome Completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={styles.input}
                placeholder="João Silva"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="login" className={styles.label}>
                Nome de Usuário
              </label>
              <input
                type="text"
                id="login"
                name="login"
                value={formData.login}
                onChange={handleChange}
                className={styles.input}
                placeholder="joaosilva"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                E-mail
              </label>
              <input
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
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={styles.input}
                placeholder="••••••••"
                required
                minLength="6"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirmar Senha
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={styles.input}
                placeholder="••••••••"
                required
                minLength="6"
              />
            </div>

            <SecurityQuestions
              value={formData.securityQuestions}
              onChange={handleSecurityQuestionsChange}
            />

            <Button 
              label="Criar Conta" 
              variant="animated"
              type="submit"
              className={styles.submitButton}
            />
          </form>

          <div className={styles.footer}>
            <p>
              Já tem uma conta?{' '}
              <Link to="/login" className={styles.loginLink}>
                Faça Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;