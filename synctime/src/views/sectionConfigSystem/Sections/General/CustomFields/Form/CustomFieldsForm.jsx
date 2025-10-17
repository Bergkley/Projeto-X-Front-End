import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import styles from './CustomFieldForm.module.css';
import SingleSelect from '../../../../../../components/select/SingleSelect';
import MultiSelect from '../../../../../../components/select/MultiSelect';
import ActionHeader from '../../../../../../components/header/ActionHeader/ActionHeader';
import errorFormMessage from '../../../../../../utils/errorFormMessage';
import { ErrorMessage } from '@hookform/error-message';
import { Row, Col } from 'reactstrap';
import { Edit2, Trash2, Plus } from 'lucide-react';

const CustomFieldForm = ({ initialData = null, onSubmit = () => {}, categoryOptions = [], recordTypeOptions = [] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [options, setOptions] = useState(initialData?.options || []);
  const [editingOption, setEditingOption] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      type: initialData?.type || null,
      label: initialData?.label || '',
      name: initialData?.name || '',
      description: initialData?.description || '',
      categoryId: initialData?.categoryId || null,
      recordTypeId: initialData?.recordTypeId || null,
      required: initialData?.required || false
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        type: initialData.type || null,
        label: initialData.label || '',
        name: initialData.name || '',
        description: initialData.description || '',
        categoryId: initialData.categoryId || null,
        recordTypeId: initialData.recordTypeId || null,
        required: initialData.required || false
      });
      setOptions(initialData.options || []);
    }
  }, [initialData, reset]);

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
      <Modal isOpen={isModalOpen} toggle={() => handleCloseModal()} centered>
        <ModalHeader toggle={() => handleCloseModal()} className={styles.modalHeader}>
          {editingOption ? 'Editar Opção' : 'Adicionar Opção'}
        </ModalHeader>
        <ModalBody>
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

  const handleFormSubmit = (data) => {
    if (isMultipleType && options.length === 0) {
      alert('Adicione pelo menos uma opção para campos de múltipla escolha');
      return;
    }
    console.log('Dados do formulário:', { ...data, options });
    onSubmit({ ...data, options });
  };

  const handleCancel = () => {
    reset();
    setOptions([]);
  };

  const handleBack = () => {
    console.log('Voltar');
  };

  return (
    <>
      <ActionHeader
        onBack={handleBack}
        backButtonLabel="Voltar"
        isOnlyBack={true}
      />
      <div className={styles.container}>
        <h5 className={styles.title}>Campo Personalizado</h5>

        <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
          <Row className="mb-4">
            <Col md={6}>
              <div className={styles.fieldGroup}>
                <Controller
                  name="name"
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
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteOption(option.id)}
                              className={styles.buttonDelete}
                              title="Deletar"
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

      <OptionModal />
    </>
  );
};

export default CustomFieldForm;