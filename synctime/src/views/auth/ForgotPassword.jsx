import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './ForgotPassword.module.css';
import Button from '../../components/button/Button';
import SecurityQuestionsVerification from './../../components/securityQuestions/SecurityQuestionsVerification';
import Logo from '../../assets/logo.svg';


const ForgotPassword = () => {
  const [step, setStep] = useState(1); 
  const [login, setLogin] = useState('');
  const [userQuestions, setUserQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

 

  // Simula requisição ao backend para buscar perguntas
  const handleFetchQuestions = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Aqui você faria a requisição real ao backend
      // const response = await fetch(`/api/users/${login}/security-questions`);
      // const data = await response.json();
      
      // Simulação de resposta do backend (remover em produção)
      setTimeout(() => {
        const mockQuestions = [
          { id: 1, question: 'Qual o nome do seu primeiro animal de estimação?' },
          { id: 2, question: 'Em qual cidade você nasceu?' }
        ];
        
        setUserQuestions(mockQuestions);
        setStep(2);
        setLoading(false);
      }, 1000);

    } catch (err) {
      setError('Usuário não encontrado. Verifique o login e tente novamente.');
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    // Validação de senha
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem!');
      return;
    }

    if (newPassword.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres!');
      return;
    }

    // Validação de respostas
    const allAnswered = userQuestions.every(q => answers[q.id]?.trim());
    if (!allAnswered) {
      setError('Por favor, responda todas as perguntas de segurança!');
      return;
    }

    setLoading(true);

    try {
      // Aqui você faria a requisição real ao backend
      // const response = await fetch('/api/users/reset-password', {
      //   method: 'POST',
      //   body: JSON.stringify({ login, answers, newPassword })
      // });

      // Simulação (remover em produção)
      setTimeout(() => {
        alert('Senha redefinida com sucesso!');
        setLoading(false);
        // Redirecionar para login
        // navigate('/login');
      }, 1000);

    } catch (err) {
      setError('Erro ao redefinir senha. Verifique suas respostas e tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Left Section */}
        <div className={styles.leftSection}>
          <div className={styles.decorativeCircle1}></div>
          <div className={styles.decorativeCircle2}></div>

          <h1 className={styles.title}>Recuperar Senha</h1>
          
          <div className={styles.logoWrapper}>
            <img 
              src={Logo}
              alt="SyncTime Logo" 
              className={styles.logo}
            />
          </div>
          
          <p className={styles.description}>
            {step === 1 
              ? 'Digite seu login para recuperar sua conta.' 
              : 'Responda as perguntas de segurança e crie uma nova senha.'}
          </p>

          <div className={styles.dots}>
            <div className={`${styles.dot} ${step === 1 ? styles.dotActive : ''}`}></div>
            <div className={`${styles.dot} ${step === 2 ? styles.dotActive : ''}`}></div>
          </div>
        </div>

        {/* Right Section */}
        <div className={styles.rightSection}>
          {/* Step 1: Buscar usuário */}
          {step === 1 && (
            <>
              <div className={styles.formHeader}>
                <h2 className={styles.formTitle}>Encontrar sua Conta</h2>
                <p className={styles.formSubtitle}>
                  Digite seu nome de usuário
                </p>
              </div>

              <form onSubmit={handleFetchQuestions} className={styles.form}>
                {error && (
                  <div className={styles.errorMessage}>
                    {error}
                  </div>
                )}

                <div className={styles.inputGroup}>
                  <label htmlFor="login" className={styles.label}>
                    Nome de Usuário
                  </label>
                  <input
                    type="text"
                    id="login"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    className={styles.input}
                    placeholder="joaosilva"
                    required
                    disabled={loading}
                  />
                </div>

                <Button 
                  label={loading ? "Buscando..." : "Continuar"}
                  variant="animated"
                  type="submit"
                  disabled={loading}
                  className={styles.submitButton}
                />
              </form>
            </>
          )}

          {/* Step 2: Perguntas de Segurança + Nova Senha */}
          {step === 2 && (
            <>
              <div className={styles.formHeader}>
                <h2 className={styles.formTitle}>Verificação de Segurança</h2>
                <p className={styles.formSubtitle}>
                  Responda as perguntas e crie uma nova senha
                </p>
              </div>

              <form onSubmit={handleResetPassword} className={styles.form}>
                {error && (
                  <div className={styles.errorMessage}>
                    {error}
                  </div>
                )}

                <SecurityQuestionsVerification
                  questions={userQuestions}
                  answers={answers}
                  onAnswerChange={handleAnswerChange}
                />

                <div className={styles.passwordSection}>
                  <h3 className={styles.sectionTitle}>Nova Senha</h3>
                  
                  <div className={styles.inputGroup}>
                    <label htmlFor="newPassword" className={styles.label}>
                      Nova Senha
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={styles.input}
                      placeholder="••••••••"
                      required
                      minLength="6"
                      disabled={loading}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="confirmPassword" className={styles.label}>
                      Confirmar Nova Senha
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={styles.input}
                      placeholder="••••••••"
                      required
                      minLength="6"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className={styles.buttonGroup}>
                  <Button 
                    label="Voltar"
                    variant="animated"
                    outline
                    onClick={() => setStep(1)}
                    disabled={loading}
                    type="button"
                  />
                  <Button 
                    label={loading ? "Salvando..." : "Redefinir Senha"}
                    variant="animated"
                    type="submit"
                    disabled={loading}
                  />
                </div>
              </form>
            </>
          )}

          <div className={styles.footer}>
            <p>
              Lembrou sua senha?{' '}
              <Link to="/login" className={styles.loginLink}>
                Fazer Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;