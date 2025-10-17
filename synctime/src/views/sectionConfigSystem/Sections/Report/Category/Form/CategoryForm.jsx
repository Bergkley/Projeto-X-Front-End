import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import styles from './CategoryForm.module.css';
import SingleSelect from '../../../../../../components/select/SingleSelect';
import ActionHeader from '../../../../../../components/header/ActionHeader/ActionHeader';
import errorFormMessage from '../../../../../../utils/errorFormMessage';
import { ErrorMessage } from '@hookform/error-message';
import { Row, Col } from 'reactstrap';
import { useTheme } from '../../../../../../hooks/useTheme'; 

const CategoryForm = ({ initialData = null, onSubmit = () => {} }) => {
  const { theme } = useTheme();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      type: initialData?.type || null,
      recordType: initialData?.recordType || null
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        description: initialData.description || '',
        type: initialData.type || null,
        recordType: initialData.recordType || null
      });
    }
  }, [initialData, reset]);

  const typeOptions = [
    { value: 'educacao', label: 'Educação' },
    { value: 'financeiro', label: 'Financeiro' },
    { value: 'atividade_domestica', label: 'Atividade Doméstica' },
    { value: 'outros', label: 'Outros' }
  ];

  const recordTypeOptions = [
    { value: 'tipo1', label: 'Tipo 1' },
    { value: 'tipo2', label: 'Tipo 2' },
    { value: 'tipo3', label: 'Tipo 3' }
  ];

  const handleFormSubmit = (data) => {
    console.log('Dados do formulário:', data);
    onSubmit(data);
  };

  const handleCancel = () => {
    reset();
  };

  const handleBack = () => {
    console.log('Voltar');
    // Implementar navegação para voltar
  };

  return (
    <>
      <ActionHeader
        onBack={handleBack}
        backButtonLabel="Voltar"
        isOnlyBack={true}
      />
      <div className={`${styles.container} ${styles[theme]}`}>
        <h5 className={styles.title}>Categoria</h5>

        <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
          {/* Primeira Linha */}
          <Row className="mb-4">
            <Col md={6}>
              <div className={styles.fieldGroup}>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: 'Nome da categoria é obrigatório' }}
                  render={({ field }) => (
                    <>
                      <label className={styles.label}>Nome da Categoria *</label>
                      <input
                        {...field}
                        type="text"
                        placeholder="Digite o nome da categoria"
                        className={`${styles.input} ${
                          errors.name ? styles.error : ''
                        }`}
                      />
                      <ErrorMessage
                        errors={errors}
                        name="name"
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
                      />
                    </>
                  )}
                />
              </div>
            </Col>
          </Row>

          {/* Segunda Linha */}
          <Row className="mb-4">
            <Col md={6}>
              <div className={styles.fieldGroup}>
                <Controller
                  name="type"
                  control={control}
                  rules={{ required: 'Tipo é obrigatório' }}
                  render={({ field }) => (
                    <>
                      <label className={styles.label}>Tipo *</label>
                      <SingleSelect
                        options={typeOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Selecione..."
                      />
                      <ErrorMessage
                        errors={errors}
                        name="type"
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
                  name="recordType"
                  control={control}
                  rules={{ required: 'Tipo de Registro é obrigatório' }}
                  render={({ field }) => (
                    <>
                      <label className={styles.label}>Tipo de Registro *</label>
                      <SingleSelect
                        options={recordTypeOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Selecione..."
                      />
                      <ErrorMessage
                        errors={errors}
                        name="recordType"
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
            <button type="submit" className={styles.buttonCreate}>
              Criar
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className={styles.buttonCancel}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CategoryForm;