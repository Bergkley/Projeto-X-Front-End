import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useParams, useHistory } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, Row, Col } from 'reactstrap';
import { ErrorMessage } from '@hookform/error-message';
import { Edit2, Trash2, Plus } from 'lucide-react';

// 💅 Estilos
import styles from './CustomFieldForm.module.css';

// 🧩 Componentes
import SingleSelect from '../../../../../../components/select/SingleSelect';
import MultiSelect from '../../../../../../components/select/MultiSelect';
import ActionHeader from '../../../../../../components/header/ActionHeader/ActionHeader';

// 🔧 Utils e Hooks
import errorFormMessage from '../../../../../../utils/errorFormMessage';
import { useTheme } from '../../../../../../hooks/useTheme';
import useFlashMessage from '../../../../../../hooks/userFlashMessage';
import ServiceCategory from '../../../Report/Category/services/ServiceCategory';
import ServiceRecordType from '../../RecordType/services/ServiceRecordType';
import ServiceCustomFields from '../services/ServiceCustomFields';

// 📡 Services

const CustomFieldForm = () => {
  const { id } = useParams();
  const history = useHistory();
  const { theme } = useTheme();
  const { setFlashMessage } = useFlashMessage();

  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(!!id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [editingOption, setEditingOption] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [recordTypeOptions, setRecordTypeOptions] = useState([]);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      type: null,
      label: '',
      name: '',
      description: '',
      categoryId: null,
      recordTypeId: null,
      required: false
    }
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const categoriesResponse = await ServiceCategory.getByAllCategory(
          1,
          '',
          '',
          ''
        );
        if (categoriesResponse.data.status === 'OK') {
          const categories = categoriesResponse.data.data.map((cat) => ({
            value: cat.id,
            label: cat.name
          }));
          setCategoryOptions(categories);
        }

        const recordTypesResponse = await ServiceRecordType.getByAllRecordType(
          1,
          '',
          '',
          ''
        );
        if (recordTypesResponse.data.status === 'OK') {
          const recordTypes = recordTypesResponse.data.data.map((rt) => ({
            value: rt.id,
            label: rt.name
          }));
          setRecordTypeOptions(recordTypes);
        }
      } catch (error) {
        console.error('Erro ao buscar opções:', error);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    const fetchCustomFieldData = async () => {
      if (!id) return;

      try {
        setIsLoadingData(true);
        const [responseCustomFields, responseRecordTypes, responseCategories] =
          await Promise.all([
            ServiceCustomFields.getByIdCustomFields(id),
            ServiceRecordType.getByAllRecordType(1, '', '', ''),
            ServiceCategory.getByAllCategory(1, '', '', '')
          ]);

        if (responseCustomFields.data.status === 'OK') {

          const fieldData = responseCustomFields.data.data;
          if (!fieldData) {
            throw new Error('Campo personalizado não encontrado');
          }

          const recordTypeMap = {};
          if (responseRecordTypes.data.status === 'OK') {
            responseRecordTypes.data.data.forEach((rt) => {
              recordTypeMap[rt.id] = rt.name;
            });
          }


          let categoryName = '';
          if (
            responseCategories.data.status === 'OK' &&
            fieldData?.category_id
          ) {
            const category = responseCategories.data.data.find(
              (cat) => cat.id === fieldData?.category_id
            );
            categoryName = category ? category.name : '';
          }

          const recordTypeIdArray = (fieldData?.record_type_id || []).map(
            (rtId) => ({
              value: rtId,
              label: recordTypeMap[rtId] || `Tipo de Registro ${rtId}`
            })
          );

          const transformedOptions = (fieldData.options || []).map(
            (option) => ({
              id: option._id || Date.now() + Math.random(),
              name: option.value,
              recordTypes: (option.recordTypeIds || []).map((rtId) => ({
                value: rtId,
                label: recordTypeMap[rtId] || `Tipo de Registro ${rtId}`
              }))
            })
          );

          reset({
            type: fieldData.type
              ? {
                  value: fieldData.type,
                  label:
                    fieldTypeOptions.find((t) => t.value === fieldData.type)
                      ?.label || fieldData.type
                }
              : null,
            label: fieldData.label || '',
            description: fieldData.description || '',
            categoryId: fieldData.category_id
              ? { value: fieldData.category_id, label: categoryName }
              : null,
            recordTypeId: recordTypeIdArray,
            required: fieldData.required || false
          });
          setOptions(transformedOptions);
        }
      } catch (error) {
        console.error('Erro ao buscar campo personalizado:', error);
        setFlashMessage(
          'Erro ao carregar dados do campo personalizado',
          'error'
        );
        history.push('/custom-fields');
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchCustomFieldData();
  }, [id]);
  const fieldTypeOptions = [
    { value: 'text', label: 'Texto' },
    { value: 'number', label: 'Número' },
    { value: 'date', label: 'Data' },
    { value: 'multiple', label: 'Múltipla Escolha' }
  ];

  const selectedType = watch('type');
  const isMultipleType = selectedType?.value === 'multiple';

  const OptionModal = () => {
    const {
      control: modalControl,
      handleSubmit: handleModalSubmit,
      reset: resetModal,
      formState: { errors: modalErrors }
    } = useForm({
      defaultValues: {
        optionName: editingOption?.name || '',
        recordTypes: editingOption?.recordTypes || []
      }
    });

    const onModalSubmit = (data) => {
      if (editingOption) {
        setOptions(
          options.map((opt) =>
            opt.id === editingOption.id
              ? {
                  ...opt,
                  name: data.optionName,
                  recordTypes: data.recordTypes
                }
              : opt
          )
        );
      } else {
        setOptions([
          ...options,
          {
            id: Date.now(),
            name: data.optionName,
            recordTypes: data.recordTypes
          }
        ]);
      }
      resetModal();
      setEditingOption(null);
      setIsModalOpen(false);
    };

    return (
      <Modal
        isOpen={isModalOpen}
        toggle={() => handleCloseModal()}
        centered
        className={styles[`modal_${theme}`]}
      >
        <ModalHeader
          toggle={() => handleCloseModal()}
          className={styles.modalHeader}
        >
          {editingOption ? 'Editar Opção' : 'Adicionar Opção'}
        </ModalHeader>
        <ModalBody className={styles.modalBody}>
          <form onSubmit={handleModalSubmit(onModalSubmit)}>
            <div className="mb-4">
              <Controller
                name="optionName"
                control={modalControl}
                rules={{ required: 'Nome da opção é obrigatório' }}
                render={({ field }) => (
                  <div>
                    <label className={styles.label}>Nome da Opção *</label>
                    <input
                      {...field}
                      type="text"
                      placeholder="Digite o nome da opção"
                      className={`${styles.input} ${
                        modalErrors.optionName ? styles.error : ''
                      }`}
                    />
                    {modalErrors.optionName && (
                      <div className={styles.errorMessage}>
                        {modalErrors.optionName.message}
                      </div>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="mb-4">
              <Controller
                name="recordTypes"
                control={modalControl}
                rules={{ required: 'Selecione ao menos um tipo de registro' }}
                render={({ field }) => (
                  <div>
                    <label className={styles.label}>Tipos de Registro *</label>
                    <MultiSelect
                      options={recordTypeOptions}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Selecione os tipos de registro..."
                    />
                    {modalErrors.recordTypes && (
                      <div className={styles.errorMessage}>
                        {modalErrors.recordTypes.message}
                      </div>
                    )}
                  </div>
                )}
              />
            </div>

            <div className={styles.modalButtonContainer}>
              <button type="submit" className={styles.buttonSave}>
                Salvar
              </button>
              <button
                type="button"
                onClick={() => handleCloseModal()}
                className={styles.buttonCancel}
              >
                Cancelar
              </button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    );
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingOption(null);
  };

  const handleOpenModal = (option = null) => {
    setEditingOption(option);
    setIsModalOpen(true);
  };

  const handleDeleteOption = (id) => {
    setOptions(options.filter((opt) => opt.id !== id));
  };

  const onSubmit = async (data) => {
    if (isMultipleType && options.length === 0) {
      setFlashMessage(
        'Adicione pelo menos uma opção para campos de múltipla escolha',
        'error'
      );
      return;
    }

    try {
      setLoading(true);

      const payload = {
        type: data.type?.value || data.type,
        label: data.label,
        description: data.description,
        categoryId: data.categoryId?.value || data.categoryId,
        recordTypeId: Array.isArray(data.recordTypeId)
          ? data.recordTypeId.map((rt) => rt.value || rt)
          : [data.recordTypeId?.value || data.recordTypeId],
        required: data.required
      };

      if (isMultipleType) {
        payload.options = options.map((option) => ({
          value: option.name,
          recordTypeIds: option.recordTypes.map((rt) => rt.value || rt)
        }));
      }

      if (id) {
        await ServiceCustomFields.editCustomFields(id, payload);
        setFlashMessage(
          'Campo personalizado atualizado com sucesso',
          'success'
        );
      } else {
        await ServiceCustomFields.createCustomFields(payload);
        setFlashMessage('Campo personalizado criado com sucesso', 'success');
      }

      history.push('/custom-fields');
    } catch (error) {
      console.error('Erro ao salvar campo personalizado:', error);
      const errorMessage = id
        ? 'Erro ao atualizar campo personalizado'
        : 'Erro ao criar campo personalizado';
      setFlashMessage(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    history.push('/custom-fields');
  };

  const handleBack = () => {
    history.push('/custom-fields');
  };

  if (isLoadingData) {
    return (
      <div className={styles.loadingContainer}>
        <p>Carregando dados do campo personalizado...</p>
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
          {id ? 'Editar Campo Personalizado' : 'Novo Campo Personalizado'}
        </h5>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Row className="mb-4">
            <Col md={6}>
              <div className={styles.fieldGroup}>
                <Controller
                  name="label"
                  control={control}
                  rules={{ required: 'Nome é obrigatório' }}
                  render={({ field }) => (
                    <>
                      <label className={styles.label}>Nome *</label>
                      <input
                        {...field}
                        type="text"
                        placeholder="Digite o nome do campo"
                        className={`${styles.input} ${
                          errors.name ? styles.error : ''
                        }`}
                        disabled={loading}
                      />
                      <ErrorMessage
                        errors={errors}
                        name="label"
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

          <Row className="mb-4">
            <Col md={6}>
              <div className={styles.fieldGroup}>
                <Controller
                  name="categoryId"
                  control={control}
                  rules={{ required: 'Categoria é obrigatória' }}
                  render={({ field }) => (
                    <>
                      <label className={styles.label}>Categoria *</label>
                      <SingleSelect
                        options={categoryOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Selecione uma categoria..."
                        isDisabled={loading}
                      />
                      <ErrorMessage
                        errors={errors}
                        name="categoryId"
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
                  name="recordTypeId"
                  control={control}
                  rules={{ required: 'Tipo de Registro é obrigatório' }}
                  render={({ field }) => (
                    <>
                      <label className={styles.label}>Tipo de Registro *</label>
                      <MultiSelect
                        options={recordTypeOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Selecione os tipo de registro..."
                        isDisabled={loading}
                      />
                      <ErrorMessage
                        errors={errors}
                        name="recordTypeId"
                        render={({ message }) => errorFormMessage(message)}
                      />
                    </>
                  )}
                />
              </div>
            </Col>
          </Row>

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
                        options={fieldTypeOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Selecione um tipo..."
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
          </Row>

          <Row>
            <Col md={6}>
              <div className={styles.checkboxGroup}>
                <Controller
                  name="required"
                  control={control}
                  render={({ field }) => (
                    <label className={styles.checkboxLabel}>
                      <input
                        {...field}
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        disabled={loading}
                      />
                      <span>Obrigatório</span>
                    </label>
                  )}
                />
              </div>
            </Col>
          </Row>

          {isMultipleType && (
            <Row className="mb-4">
              <Col md={12}>
                <div className={styles.optionsSection}>
                  <div className={styles.optionsHeader}>
                    <h6 className={styles.optionsTitle}>Opções *</h6>
                    <button
                      type="button"
                      onClick={() => handleOpenModal()}
                      className={styles.buttonAddOption}
                      disabled={loading}
                    >
                      <Plus size={18} />
                      Adicionar Opção
                    </button>
                  </div>

                  {options.length > 0 ? (
                    <div className={styles.optionsTable}>
                      <div className={styles.tableHeader}>
                        <div className={styles.tableCol}>Nome</div>
                        <div className={styles.tableCol}>Tipos de Registro</div>
                        <div className={styles.tableCol}>Ações</div>
                      </div>

                      {options.map((option) => (
                        <div key={option.id} className={styles.tableRow}>
                          <div className={styles.tableCol}>{option.name}</div>
                          <div className={styles.tableCol}>
                            <div className={styles.recordTypeTags}>
                              {option.recordTypes?.map((rt) => (
                                <span key={rt.value} className={styles.tag}>
                                  {rt.label}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className={styles.tableCol}>
                            <button
                              type="button"
                              onClick={() => handleOpenModal(option)}
                              className={styles.buttonEdit}
                              title="Editar"
                              disabled={loading}
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteOption(option.id)}
                              className={styles.buttonDelete}
                              title="Deletar"
                              disabled={loading}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.emptyState}>
                      <p>Nenhuma opção adicionada</p>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          )}

          <div className={styles.buttonContainer}>
            <button
              type="submit"
              className={styles.buttonCreate}
              disabled={loading}
            >
              {loading ? 'Salvando...' : id ? 'Atualizar' : 'Criar'}
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

      <OptionModal />
    </>
  );
};

export default CustomFieldForm;
