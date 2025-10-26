import { Controller } from 'react-hook-form';
import { Row, Col } from 'reactstrap';
import { ErrorMessage } from '@hookform/error-message';

// Componentes
import MultiSelect from '../select/MultiSelect';

// Utils
import errorFormMessage from '../../utils/errorFormMessage';

// Estilos
import styles from '../../views/report/Sections/Category/Transaction/Form/TransactionForm.module.css';

const CustomFieldsRenderer = ({ 
  customFields, 
  control, 
  errors, 
  loading 
}) => {
  
  const renderField = (field) => {
    const fieldName = `customField_${field.id}`;

    switch (field.type) {
      case 'text':
        return (
          <Controller
            key={field.id}
            name={fieldName}
            control={control}
            rules={{
              required: field.required ? `${field.label} é obrigatório` : false
            }}
            render={({ field: formField }) => (
              <>
                <label className={styles.label}>
                  {field.label} {field.required && '*'}
                </label>
                <input
                  {...formField}
                  type="text"
                  placeholder={`Digite ${field.label.toLowerCase()}`}
                  className={`${styles.input} ${
                    errors[fieldName] ? styles.error : ''
                  }`}
                  disabled={loading}
                />
                <ErrorMessage
                  errors={errors}
                  name={fieldName}
                  render={({ message }) => errorFormMessage(message)}
                />
              </>
            )}
          />
        );

      case 'number':
        return (
          <Controller
            key={field.id}
            name={fieldName}
            control={control}
            rules={{
              required: field.required ? `${field.label} é obrigatório` : false
            }}
            render={({ field: formField }) => (
              <>
                <label className={styles.label}>
                  {field.label} {field.required && '*'}
                </label>
                <input
                  {...formField}
                  type="number"
                  step="any"
                  placeholder="0"
                  className={`${styles.input} ${
                    errors[fieldName] ? styles.error : ''
                  }`}
                  disabled={loading}
                />
                <ErrorMessage
                  errors={errors}
                  name={fieldName}
                  render={({ message }) => errorFormMessage(message)}
                />
              </>
            )}
          />
        );

      case 'monetary':
        return (
          <Controller
            key={field.id}
            name={fieldName}
            control={control}
            rules={{
              required: field.required ? `${field.label} é obrigatório` : false,
              min: field.required ? {
                value: 0.01,
                message: 'O valor deve ser maior que zero'
              } : undefined
            }}
            render={({ field: formField }) => (
              <>
                <label className={styles.label}>
                  {field.label} {field.required && '*'}
                </label>                
                <input
                  {...formField}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className={`${styles.input} ${
                    errors[fieldName] ? styles.error : ''
                  }`}
                  disabled={loading}
                />
                <ErrorMessage
                  errors={errors}
                  name={fieldName}
                  render={({ message }) => errorFormMessage(message)}
                />
              </>
            )}
          />
        );

      case 'date':
        return (
          <Controller
            key={field.id}
            name={fieldName}
            control={control}
            rules={{
              required: field.required ? `${field.label} é obrigatório` : false
            }}
            render={({ field: formField }) => (
              <>
                <label className={styles.label}>
                  {field.label} {field.required && '*'}
                </label>
                <input
                  {...formField}
                  type="date"
                  className={`${styles.input} ${
                    errors[fieldName] ? styles.error : ''
                  }`}
                  disabled={loading}
                />
                <ErrorMessage
                  errors={errors}
                  name={fieldName}
                  render={({ message }) => errorFormMessage(message)}
                />
              </>
            )}
          />
        );

      case 'multiple': {
        const options = field.options?.map(opt => ({
          value: opt.value,
          label: opt.value
        })) || [];

        return (
          <Controller
            key={field.id}
            name={fieldName}
            control={control}
            rules={{
              required: field.required ? `${field.label} é obrigatório` : false
            }}
            render={({ field: formField }) => (
              <>
                <label className={styles.label}>
                  {field.label} {field.required && '*'}
                </label>
                <MultiSelect
                  options={options}
                  value={formField.value}
                  onChange={formField.onChange}
                  placeholder="Selecione uma ou mais opções..."
                  isDisabled={loading}
                />
                <ErrorMessage
                  errors={errors}
                  name={fieldName}
                  render={({ message }) => errorFormMessage(message)}
                />
              </>
            )}
          />
        );
      }

      default:
        return null;
    }
  };

  if (!customFields || customFields.length === 0) {
    return null;
  }

  const groupedFields = [];
  for (let i = 0; i < customFields.length; i += 2) {
    groupedFields.push(customFields.slice(i, i + 2));
  }

  return (
    <>
      <Row className="mb-3">
        <Col md={12}>
          <h6 className={styles.sectionTitle}>Campos Customizados</h6>
        </Col>
      </Row>

      {groupedFields.map((group, groupIndex) => (
        <Row key={`group-${groupIndex}`} className="mb-4">
          {group.map((field) => (
            <Col key={field.id} md={6}>
              <div className={styles.fieldGroup}>
                {renderField(field)}
              </div>
            </Col>
          ))}
        </Row>
      ))}
    </>
  );
};

export default CustomFieldsRenderer;