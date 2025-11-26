import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import { ErrorMessage } from '@hookform/error-message';


// 💅 Estilos
import styles from './ReportMonthlyRecordForm.module.css';

// 🧩 Componentes
import LoadingSpinner from '../../../../../components/loading/LoadingSpinner';
import ActionHeader from '../../../../../components/header/ActionHeader/ActionHeader';
import SingleSelect from '../../../../../components/select/SingleSelect';

// 🔧 Utils e Hooks
import useFlashMessage from '../../../../../hooks/userFlashMessage';
import { useTheme } from '../../../../../hooks/useTheme';
import { useButtonColors } from '../../../../../hooks/useButtonColors'; // Adicionado o hook para cores dos botões
import errorFormMessage from '../../../../../utils/errorFormMessage'
;

// 📡 Services
import ServiceMonthlyRecord from '../services/ServiceMonthlyRecord';

const ReportMonthlyRecordForm = () => {
  const { id } = useParams();
  const location = useLocation();
  const { dados } = location.state || {};
  const history = useHistory();
  const { theme } = useTheme();
  const { 
    primaryButtonColor,
    secondaryButtonColor 
  } = useButtonColors(); 
  const { setFlashMessage } = useFlashMessage();

  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(!!id);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      goal: '',
      status: null,
      initial_balance: '',
      month: null,
      year: null
    }
  });

  // Opções de status
  const statusOptions = [
    { value: 'concluido', label: 'Concluído' },
    { value: 'pendente', label: 'Pendente' },
    { value: 'em_andamento', label: 'Em Andamento' },
    { value: 'pausado', label: 'Pausado' },
    { value: 'cancelado', label: 'Cancelado' }
  ];

  // Opções de meses
  const monthOptions = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' }
  ];

  // Opções de anos (últimos 5 anos e próximos 2)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 8 }, (_, i) => {
    const year = currentYear - 5 + i;
    return { value: year, label: year.toString() };
  });

  useEffect(() => {
    const fetchMonthlyRecordData = async () => {
      if (!id) return;

      try {
        setIsLoadingData(true);
        const response = await ServiceMonthlyRecord.getByIdMonthlyRecord(id);

        if (response.data.status === 'OK') {
          const recordData = response.data.data;
          if (!recordData) {
            throw new Error('Registro mensal não encontrado');
          }

          reset({
            title: recordData.title || '',
            description: recordData.description || '',
            goal: recordData.goal || '',
            status: recordData.status
              ? {
                  value: recordData.status,
                  label:
                    statusOptions.find((s) => s.value === recordData.status)
                      ?.label || recordData.status
                }
              : null,
            initial_balance: recordData.initial_balance?.toString() || '',
            month: recordData.month
              ? {
                  value: recordData.month,
                  label:
                    monthOptions.find((m) => m.value === recordData.month)
                      ?.label || recordData.month.toString()
                }
              : null,
            year: recordData.year
              ? {
                  value: recordData.year,
                  label: recordData.year.toString()
                }
              : null
          });
        }
      } catch (error) {
        console.error('Erro ao buscar registro mensal:', error);
        setFlashMessage('Erro ao carregar dados do registro mensal', 'error');
        history.push('/relatorios/categoria/relatorio-mesal');
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchMonthlyRecordData();
  }, [id]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const payload = {
        title: data.title,
        description: data.description || undefined,
        goal: data.goal,
        status: data.status?.value || data.status,
        initial_balance: data.initial_balance
          ? parseFloat(data.initial_balance)
          : undefined,
        month: data.month?.value || data.month,
        year: data.year?.value || data.year,
        categoryId: dados.categoryId
      };

      if (id) {
        await ServiceMonthlyRecord.editMonthlyRecord(id, payload);
        setFlashMessage('Registro mensal atualizado com sucesso', 'success');
      } else {
        await ServiceMonthlyRecord.createMonthlyRecord(payload);
        setFlashMessage('Registro mensal criado com sucesso', 'success');
      }

      history.push(`/relatorios/categoria/relatorio-mesal/${dados.categoryId}`);
    } catch (error) {
      console.error('Erro ao salvar registro mensal:', error);
      const errorMessage = id
        ? 'Erro ao atualizar registro mensal'
        : 'Erro ao criar registro mensal';
      setFlashMessage(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if(dados.categoryId) {
      return history.push(`/relatorios/categoria/relatorio-mesal/${dados.categoryId}`)
    };
    history.push('/inicio');
  };

  const handleBack = () => {
    if(dados.categoryId) {
      return history.push(`/relatorios/categoria/relatorio-mesal/${dados.categoryId}`)
    };
    history.push('/inicio');
  };

  if (isLoadingData) {
    return <LoadingSpinner message="Carregando os dados do registro mensal." />;
  }

  return (
    <>
      <ActionHeader
        onBack={handleBack}
        backButtonLabel="Voltar"
        isOnlyBack={true}
      />
      <div className={`${styles.container} ${styles[theme]}`}>
        <h5 className={styles.title}>
          {id ? 'Editar Registro Mensal' : 'Novo Registro Mensal'}
        </h5>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {/* Primeira Linha */}
          <Row className="mb-4">
            <Col md={8}>
              <div className={styles.fieldGroup}>
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: 'Título é obrigatório' }}
                  render={({ field }) => (
                    <>
                      <label className={styles.label}>Título *</label>
                      <input
                        {...field}
                        type="text"
                        placeholder="Digite o título do registro"
                        className={`${styles.input} ${
                          errors.title ? styles.error : ''
                        }`}
                        disabled={loading}
                      />
                      <ErrorMessage
                        errors={errors}
                        name="title"
                        render={({ message }) => errorFormMessage(message)}
                      />
                    </>
                  )}
                />
              </div>
            </Col>

            <Col md={4}>
              <div className={styles.fieldGroup}>
                <Controller
                  name="status"
                  control={control}
                  rules={{ required: 'Status é obrigatório' }}
                  render={({ field }) => (
                    <>
                      <label className={styles.label}>Status *</label>
                      <SingleSelect
                        options={statusOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Selecione..."
                        isDisabled={loading}
                      />
                      <ErrorMessage
                        errors={errors}
                        name="status"
                        render={({ message }) => errorFormMessage(message)}
                      />
                    </>
                  )}
                />
              </div>
            </Col>
          </Row>

          {/* Segunda Linha */}
          <Row className="mb-4">
            <Col md={12}>
              <div className={styles.fieldGroup}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <>
                      <label className={styles.label}>Descrição</label>
                      <input
                        {...field}
                        type="text"
                        placeholder="Digite uma descrição"
                        className={styles.input}
                        disabled={loading}
                      />
                    </>
                  )}
                />
              </div>
            </Col>
          </Row>

          {/* Terceira Linha */}
          <Row className="mb-4">
            <Col md={6}>
              <div className={styles.fieldGroup}>
                <Controller
                  name="goal"
                  control={control}
                  rules={{ required: 'Meta é obrigatória' }}
                  render={({ field }) => (
                    <>
                      <label className={styles.label}>Meta *</label>
                      <input
                        {...field}
                        type="text"
                        placeholder="Digite a meta do registro"
                        className={`${styles.input} ${
                          errors.goal ? styles.error : ''
                        }`}
                        disabled={loading}
                      />
                      <ErrorMessage
                        errors={errors}
                        name="goal"
                        render={({ message }) => errorFormMessage(message)}
                      />
                    </>
                  )}
                />
              </div>
            </Col>

            <Col md={6}>
              <div className={styles.fieldGroup}>
                <Controller
                  name="initial_balance"
                  control={control}
                  render={({ field }) => (
                    <>
                      <label className={styles.label}>Saldo Inicial</label>
                      <input
                        {...field}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className={styles.input}
                        disabled={loading}
                      />
                    </>
                  )}
                />
              </div>
            </Col>
          </Row>

          {/* Quarta Linha */}
          <Row className="mb-4">
            <Col md={6}>
              <div className={styles.fieldGroup}>
                <Controller
                  name="month"
                  control={control}
                  rules={{ required: 'Mês é obrigatório' }}
                  render={({ field }) => (
                    <>
                      <label className={styles.label}>Mês *</label>
                      <SingleSelect
                        options={monthOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Selecione..."
                        isDisabled={loading}
                      />
                      <ErrorMessage
                        errors={errors}
                        name="month"
                        render={({ message }) => errorFormMessage(message)}
                      />
                    </>
                  )}
                />
              </div>
            </Col>

            <Col md={6}>
              <div className={styles.fieldGroup}>
                <Controller
                  name="year"
                  control={control}
                  rules={{ required: 'Ano é obrigatório' }}
                  render={({ field }) => (
                    <>
                      <label className={styles.label}>Ano *</label>
                      <SingleSelect
                        options={yearOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Selecione..."
                        isDisabled={loading}
                      />
                      <ErrorMessage
                        errors={errors}
                        name="year"
                        render={({ message }) => errorFormMessage(message)}
                      />
                    </>
                  )}
                />
              </div>
            </Col>
          </Row>

          {/* Botões */}
          <div className={styles.buttonContainer}>
            <button
              type="submit"
              className={styles.buttonCreate}
              disabled={loading}
              style={{ backgroundColor: primaryButtonColor }} 
            >
              {loading ? 'Salvando...' : id ? 'Atualizar' : 'Criar'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className={styles.buttonCancel}
              disabled={loading}
              style={{ backgroundColor: secondaryButtonColor }} 
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ReportMonthlyRecordForm;