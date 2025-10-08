// ⚙️ React e bibliotecas externas
import { useContext, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { Link } from 'react-router-dom';
import { Form } from 'reactstrap';

// 💅 Estilos
import styles from './Register.module.css';

// 🧩 Componentes
import Button from '../../components/button/Button';
import Input from '../../components/Input/input';
import SecurityQuestions from '../../components/securityQuestions/SecurityQuestions';

// 🖼️ Assets
import Logo from '../../assets/logo.svg';

// 🌐 Contexto
import { Context } from '../../context/UserContext';

// 🧰 Utilitários
import errorFormMessage from '../../utils/errorFormMessage';


const Register = () => {
  const { register: registerUser } = useContext(Context);
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch
  } = useForm({
    defaultValues: {
      name: '',
      login: '',
      email: '',
      password: '',
      confirmPassword: '',
      securityQuestions: [{ question: null, answer: '' }]
    }
  });
 
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = (data) => {
    const userData = {
      name: data.name,
      login: data.login,
      email: data.email,
      password: data.password,
      confirmpassword: data.confirmPassword,
      securityQuestions: data.securityQuestions.map((q) => ({
        question: q.question ? q.question.value : null,
        answer: q.answer
      }))
    };
    console.log('userData', userData);
    registerUser(userData);
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
            <img src={Logo} alt="SyncTime Logo" className={styles.logo} />
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

          <Form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="name" className={styles.label}>
                Nome
              </label>
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Nome é obrigatório' }}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="name"
                    {...field}
                    className={`${styles.input} ${
                      errors.name ? styles.errorInput : ''
                    }`}
                    placeholder="João Silva"
                  />
                )}
              />
              <ErrorMessage
                errors={errors}
                name="name"
                render={({ message }) => errorFormMessage(message)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="login" className={styles.label}>
                Nome de Usuário
              </label>
              <Controller
                name="login"
                control={control}
                rules={{ required: 'Nome de usuário é obrigatório' }}
                render={({ field }) => (
                  <input
                    type="text"
                    id="login"
                    {...field}
                    className={`${styles.input} ${
                      errors.login ? styles.errorInput : ''
                    }`}
                    placeholder="joaosilva"
                  />
                )}
              />
              <ErrorMessage
                errors={errors}
                name="login"
                render={({ message }) => errorFormMessage(message)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                E-mail
              </label>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: 'E-mail é obrigatório',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'E-mail inválido'
                  }
                }}
                render={({ field }) => (
                  <input
                    type="email"
                    id="email"
                    {...field}
                    className={`${styles.input} ${
                      errors.email ? styles.errorInput : ''
                    }`}
                    placeholder="seu@email.com"
                  />
                )}
              />
              <ErrorMessage
                errors={errors}
                name="email"
                render={({ message }) => errorFormMessage(message)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Senha
              </label>
              <div className={styles.passwordWrapper}>
                <Controller
                  name="password"
                  control={control}
                  rules={{
                    required: 'Senha é obrigatória',
                    minLength: {
                      value: 6,
                      message: 'Senha deve ter pelo menos 6 caracteres'
                    }
                  }}
                  render={({ field }) => (
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      {...field}
                      className={`${styles.input} ${
                        errors.password ? styles.errorInput : ''
                      }`}
                      placeholder="••••••••"
                    />
                  )}
                />
                <span
                  className={styles.eyeIcon}
                  onClick={() => setShowPassword(!showPassword)}
                ></span>
              </div>
              <ErrorMessage
                errors={errors}
                name="password"
                render={({ message }) => errorFormMessage(message)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirmar Senha
              </label>
              <div className={styles.passwordWrapper}>
                <Controller
                  name="confirmPassword"
                  control={control}
                  rules={{
                    required: 'Confirmação de senha é obrigatória',
                    validate: (value) =>
                      value === watch('password') || 'As senhas não coincidem'
                  }}
                  render={({ field }) => (
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      {...field}
                      className={`${styles.input} ${
                        errors.confirmPassword ? styles.errorInput : ''
                      }`}
                      placeholder="••••••••"
                    />
                  )}
                />
                <span
                  className={styles.eyeIcon}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                ></span>
              </div>
              <ErrorMessage
                errors={errors}
                name="confirmPassword"
                render={({ message }) => errorFormMessage(message)}
              />
            </div>

            <Controller
              name="securityQuestions"
              control={control}
              rules={{
                validate: {
                  atLeastOne: (value) =>
                    value.length > 0 ||
                    'Pelo menos uma pergunta de segurança é obrigatória',
                  uniqueQuestions: (value) => {
                    const questionValues = value
                      .map((q) => q.question?.value)
                      .filter(Boolean);
                    const uniqueValues = new Set(questionValues);
                    return (
                      uniqueValues.size === questionValues.length ||
                      'As perguntas de segurança não podem ser duplicadas'
                    );
                  }
                }
              }}
              render={({ field }) => (
                <SecurityQuestions
                  control={control}
                  errors={errors}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <ErrorMessage
              errors={errors}
              name="securityQuestions"
              render={({ message }) => errorFormMessage(message)}
            />

            <Button
              label="Criar Conta"
              variant="animated"
              type="submit"
              className={styles.submitButton}
            />
          </Form>

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
