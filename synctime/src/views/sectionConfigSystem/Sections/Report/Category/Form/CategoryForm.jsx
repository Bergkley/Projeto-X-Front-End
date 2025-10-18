import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useParams, useHistory } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import { ErrorMessage } from '@hookform/error-message';

// 💅 Estilos
import styles from './CategoryForm.module.css';

// 🧩 Componentes
import SingleSelect from '../../../../../../components/select/SingleSelect';
import ActionHeader from '../../../../../../components/header/ActionHeader/ActionHeader';

// 🔧 Utils e Hooks
import errorFormMessage from '../../../../../../utils/errorFormMessage';
import { useTheme } from '../../../../../../hooks/useTheme';
import useFlashMessage from '../../../../../../hooks/userFlashMessage';

// 📡 Services
import ServiceCategory from '../services/ServiceCategory';

const CategoryForm = () => {
  const { id } = useParams();
  const history = useHistory();
  const { theme } = useTheme();
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
      name: '',
      description: '',
      type: null,
      recordType: null
    }
  });

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (!id) return;

      try {
        setIsLoadingData(true);
        const response = await ServiceCategory.getByIdCategory(id);
        
        if (response.data.status === 'OK') {
          const categoryData = response.data.data;
          // TODO: AJUSTAR O RECORD TYPE
          reset({
            name: categoryData.name || '',
            description: categoryData.description || '',
            type: categoryData.type ? { value: categoryData.type, label: categoryData.type } : null,
            recordType: categoryData.recordType ? { value: categoryData.recordTypeId, label: categoryData.recordTypeId } : null
          });
        }
      } catch (error) {
        console.error('Erro ao buscar categoria:', error);
        setFlashMessage('Erro ao carregar dados da categoria', 'error');
        history.push('/categoria');
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchCategoryData();
  }, [id]);

  const typeOptions = [
    { value: 'educacao', label: 'Educação' },
    { value: 'financeiro', label: 'Financeiro' },
    { value: 'atividade_domestica', label: 'Atividade Doméstica' },
    { value: 'outros', label: 'Outros' }
  ];

  const recordTypeOptions = [
    { value: 'tipo1', label: 'Tipo 1' },
    { value: '2', label: 'Tipo 2' },
    { value: 'tipo3', label: 'Tipo 3' }
  ];

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const payload = {
        name: data.name,
        description: data.description,
        type: data.type?.value || data.type,
        recordTypeId: data.recordType?.value || data.recordType
      };

      if (id) {
        await ServiceCategory.editCategory(id, payload);
        setFlashMessage('Categoria atualizada com sucesso', 'success');
      } else {
        await ServiceCategory.createCategory(payload);
        setFlashMessage('Categoria criada com sucesso', 'success');
      }

      history.push('/categoria');
      
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      const errorMessage = id 
        ? 'Erro ao atualizar categoria' 
        : 'Erro ao criar categoria';
      setFlashMessage(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    history.push('/categoria');
  };

  const handleBack = () => {
    history.push('/categoria');
  };

  if (isLoadingData) {
    return (
      <div className={styles.loadingContainer}>
        <p>Carregando dados da categoria...</p>
      </div>
    );
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
          {id ? 'Editar Categoria' : 'Nova Categoria'}
        </h5>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
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
                        disabled={loading}
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
                        disabled={loading}
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
                        isDisabled={loading}
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
                        isDisabled={loading}
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
            <button 
              type="submit" 
              className={styles.buttonCreate}
              disabled={loading}
            >
              {loading ? 'Salvando...' : (id ? 'Atualizar' : 'Criar')}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className={styles.buttonCancel}
              disabled={loading}
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