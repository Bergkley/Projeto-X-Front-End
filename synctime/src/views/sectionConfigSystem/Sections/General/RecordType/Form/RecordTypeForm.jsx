import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import styles from './RecordTypeForm.module.css';
import SingleSelect from '../../../../../../components/select/SingleSelect';
import ActionHeader from '../../../../../../components/header/ActionHeader/ActionHeader';
import errorFormMessage from '../../../../../../utils/errorFormMessage';
import { ErrorMessage } from '@hookform/error-message';
import { Row, Col } from 'reactstrap';
import {
  Home,
  FileText,
  DollarSign,
  Users,
  Calendar,
  CheckCircle,
  AlertCircle,
  Star,
  Heart,
  Inbox,
  Archive,
  Trash2,
  Settings,
  Briefcase,
  ShoppingCart
} from 'lucide-react';

const RecordTypeForm = ({ initialData = null, onSubmit = () => {} }) => {
  const iconLabels = {
    Home: 'Início',
    FileText: 'Arquivo',
    DollarSign: 'Dinheiro',
    Users: 'Usuários',
    Calendar: 'Calendário',
    CheckCircle: 'Concluído',
    AlertCircle: 'Alerta',
    Star: 'Favorito',
    Heart: 'Coração',
    Inbox: 'Entrada',
    Archive: 'Arquivo',
    Trash2: 'Lixeira',
    Settings: 'Configurações',
    Briefcase: 'Pasta',
    ShoppingCart: 'Carrinho'
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: initialData?.name || '',
      icon: initialData?.icon || null
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        icon: initialData.icon || null
      });
    }
  }, [initialData, reset]);

  const iconMap = {
    Home,
    FileText,
    DollarSign,
    Users,
    Calendar,
    CheckCircle,
    AlertCircle,
    Star,
    Heart,
    Inbox,
    Archive,
    Trash2,
    Settings,
    Briefcase,
    ShoppingCart
  };

  const iconOptions = Object.keys(iconMap).map((iconName) => ({
    value: iconName,
    label: iconLabels[iconName],
    icon: iconName
  }));

  const IconOption = (props) => {
    const { data, innerProps, innerRef } = props;
    const IconComponent = iconMap[data.value];

    return (
      <div
        {...innerProps}
        ref={innerRef}
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <IconComponent size={20} style={{ marginRight: '8px' }} />
        <span>{iconLabels[data.value]}</span>
      </div>
    );
  };

  const IconValueContainer = (props) => {
    const { children, getValue } = props;
    const value = getValue();
    const selectedIcon = value[0];

    if (!selectedIcon) {
      return <div>Selecione um ícone.</div>;
    }

    const IconComponent = iconMap[selectedIcon.value];

    return (
      <div
        {...props.innerProps}
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <IconComponent size={20} style={{ marginRight: '8px' }} />
        <span>{iconLabels[selectedIcon.value]}</span>
      </div>
    );
  };

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
      <div className={styles.container}>
        <h5 className={styles.title}>Tipo de Registro</h5>

        <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
          {/* Primeira Linha */}
          <Row className="mb-4">
            <Col md={6}>
              <div className={styles.fieldGroup}>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: 'Nome do tipo de registro é obrigatório' }}
                  render={({ field }) => (
                    <>
                      <label className={styles.label}>Nome do Tipo *</label>
                      <input
                        {...field}
                        type="text"
                        placeholder="Digite o nome do tipo de registro"
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
                  name="icon"
                  control={control}
                  rules={{ required: 'Ícone é obrigatório' }}
                  render={({ field }) => (
                    <>
                      <label className={styles.label}>Ícone *</label>
                      <SingleSelect
                        options={iconOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Selecione um ícone..."
                        components={{
                          Option: IconOption,
                          ValueContainer: IconValueContainer
                        }}
                        styles={{
                          control: (base) => ({
                            ...base,
                            minHeight: '50px',
                            height: '50px'
                          })
                        }}
                      />
                      <ErrorMessage
                        errors={errors}
                        name="icon"
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

export default RecordTypeForm;