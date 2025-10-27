import  { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import styles from './TransactionModal.module.css';
import { Button } from 'reactstrap';
import { useTheme } from '../../hooks/useTheme';
import { useEmphasisColor } from '../../hooks/useEmphasisColor';
import ServiceCustomFields from '../../views/sectionConfigSystem/Sections/General/CustomFields/services/ServiceCustomFields';
import errorFormMessage from '../../utils/errorFormMessage';
import CustomFieldsRenderModal from '../customFields/CustomFieldsRenderModal';


const TransactionModal = ({ 
  isOpen, 
  onClose, 
  record, 
  onSave,
  dados 
}) => {
  const { theme } = useTheme();
  const { emphasisColor } = useEmphasisColor();
  const isEditMode = !!record;
  const [customFields, setCustomFields] = useState([]);
  const [isLoadingCustomFields, setIsLoadingCustomFields] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      amount: '',
      transactionDate: ''
    }
  });

  useEffect(() => {
    const fetchCustomFields = async () => {
      if (!dados?.categoryId || !dados?.recordTypeId || !isOpen) return;

      try {
        setIsLoadingCustomFields(true);
        const response = await ServiceCustomFields.getByAllByRecordType(
          dados.categoryId,
          dados.recordTypeId
        );

        if (response.data.status === 'OK') {
          setCustomFields(response.data.data || []);
        }
      } catch (error) {
        console.error('Erro ao buscar campos customizados:', error);
      } finally {
        setIsLoadingCustomFields(false);
      }
    };

    fetchCustomFields();
  }, [isOpen, dados?.categoryId, dados?.recordTypeId]);

  useEffect(() => {
    if (!isOpen) return;

    const formData = {
      title: '',
      description: '',
      amount: '',
      transactionDate: ''
    };

    if (isEditMode && record) {
      formData.title = record.title || '';
      formData.description = record.description || '';
      formData.amount = record.amount?.toString() || '';
      formData.transactionDate = record.transaction_date || '';

      const customFieldsData = record.customFieldsResult || [];
      console.log('customFieldsData', customFieldsData)
      if (customFieldsData && Array.isArray(customFieldsData)) {
        customFieldsData.forEach((cf) => {
          const fieldName = `customField_${cf.custom_field_id}`;

          if (Array.isArray(cf.value)) {
            formData[fieldName] = cf.value.map((v) => ({
              value: v,
              label: v
            }));
          } else {
            formData[fieldName] = cf.value;
          }
        });
      }
    }

    reset(formData);
  }, [isOpen, record, isEditMode, reset]);

  const onSubmit = async (data) => {
    const payload = {
      title: data.title,
      description: data.description || undefined,
      amount: data.amount ? parseFloat(data.amount) : undefined,
      transactionDate: data.transactionDate,
      recordTypeId: dados.recordTypeId,
      monthlyRecordId: dados.monthlyRecordId,
      categoryId: dados.categoryId
    };

    const customFieldsData = [];
    customFields.forEach((field) => {
      const fieldName = `customField_${field.id}`;
      const fieldValue = data[fieldName];

      if (
        fieldValue !== undefined &&
        fieldValue !== null &&
        fieldValue !== ''
      ) {
        let processedValue;

        switch (field.type) {
          case 'text':
          case 'date':
            processedValue = fieldValue.toString();
            break;

          case 'number':
            processedValue = parseInt(fieldValue, 10);
            break;

          case 'monetary':
            processedValue = parseFloat(fieldValue);
            break;

          case 'multiple':
            if (Array.isArray(fieldValue)) {
              processedValue = fieldValue.map((item) =>
                typeof item === 'object' ? item.value : item
              );
            } else {
              processedValue = [fieldValue];
            }
            break;

          default:
            processedValue = fieldValue;
        }

        customFieldsData.push({
          custom_field_id: field.id,
          value: processedValue
        });
      }
    });

    if (customFieldsData.length > 0) {
      payload.customFields = customFieldsData;
    }

    if (isEditMode && record?.id) {
      payload.id = record.id;
    }

    onSave?.(payload);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={`${styles.modalBackdrop} ${styles[theme]}`} onClick={handleClose}>
      <div className={`${styles.modalContent} ${styles[theme]}`} onClick={(e) => e.stopPropagation()}>
        <div className={`${styles.modalHeader} ${styles[theme]}`}>
          <h2 className={`${styles.modalTitle} ${styles[theme]}`}>
            {isEditMode ? 'Editar Transação' : 'Nova Transação'}
          </h2>
          <button className={`${styles.closeBtn} ${styles[theme]}`} onClick={handleClose}>
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={`${styles.modalBody} ${styles[theme]}`}>
            <div className={styles.sectionHeader}>
              <label className={`${styles.formLabel} ${styles[theme]}`}>Informações Básicas</label>
            </div>

            {/* Título - Coluna 1 */}
            <div className={styles.formGroup}>
              <label htmlFor="title" className={`${styles.formLabel} ${styles[theme]}`}>Título *</label>
              <Controller
                name="title"
                control={control}
                rules={{ required: 'Título é obrigatório' }}
                render={({ field }) => (
                  <>
                    <input
                      {...field}
                      type="text"
                      id="title"
                      className={`${styles.formInput} ${styles[theme]} ${errors.title ? styles.error : ''}`}
                      placeholder="Digite o título da transação"
                      style={{
                        '--focus-border-color': emphasisColor || 'rgb(20, 18, 129)',
                        '--focus-shadow-color': emphasisColor ? `${emphasisColor}26` : 'rgba(102, 126, 234, 0.15)'
                      }}
                    />
                    <div className={styles.errorMessage}>
                      {errors.title && errorFormMessage(errors.title.message)}
                    </div>
                  </>
                )}
              />
            </div>

            {/* Valor - Coluna 2 */}
            <div className={styles.formGroup}>
              <label htmlFor="amount" className={`${styles.formLabel} ${styles[theme]}`}>Valor (R$) *</label>
              <Controller
                name="amount"
                control={control}
                rules={{
                  required: 'Valor é obrigatório',
                  min: {
                    value: 0.01,
                    message: 'O valor deve ser maior que zero'
                  }
                }}
                render={({ field }) => (
                  <>
                    <input
                      {...field}
                      type="number"
                      id="amount"
                      className={`${styles.formInput} ${styles[theme]} ${errors.amount ? styles.error : ''}`}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      style={{
                        '--focus-border-color': emphasisColor || 'rgb(20, 18, 129)',
                        '--focus-shadow-color': emphasisColor ? `${emphasisColor}26` : 'rgba(102, 126, 234, 0.15)'
                      }}
                    />
                    <div className={styles.errorMessage}>
                      {errors.amount && errorFormMessage(errors.amount.message)}
                    </div>
                  </>
                )}
              />
            </div>

            {/* Descrição - Coluna 1 */}
            <div className={styles.formGroup}>
              <label htmlFor="description" className={`${styles.formLabel} ${styles[theme]}`}>Descrição</label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    id="description"
                    className={`${styles.formTextarea} ${styles[theme]}`}
                    placeholder="Digite uma descrição para a transação..."
                    rows={3}
                    style={{
                      '--focus-border-color': emphasisColor || 'rgb(20, 18, 129)',
                      '--focus-shadow-color': emphasisColor ? `${emphasisColor}26` : 'rgba(102, 126, 234, 0.15)'
                    }}
                  />
                )}
              />
            </div>

            {/* Data - Coluna 2 */}
            <div className={styles.formGroup}>
              <label htmlFor="transactionDate" className={`${styles.formLabel} ${styles[theme]}`}>Data da Transação *</label>
              <Controller
                name="transactionDate"
                control={control}
                rules={{ required: 'Data é obrigatória' }}
                render={({ field }) => (
                  <>
                    <input
                      {...field}
                      type="date"
                      id="transactionDate"
                      className={`${styles.formInput} ${styles[theme]} ${errors.transactionDate ? styles.error : ''}`}
                      style={{
                        '--focus-border-color': emphasisColor || 'rgb(20, 18, 129)',
                        '--focus-shadow-color': emphasisColor ? `${emphasisColor}26` : 'rgba(102, 126, 234, 0.15)'
                      }}
                    />
                    <div className={styles.errorMessage}>
                      {errors.transactionDate && errorFormMessage(errors.transactionDate.message)}
                    </div>
                  </>
                )}
              />
            </div>

            {/* Campos Customizados - Ocupam toda a largura */}
            {isLoadingCustomFields ? (
              <div className={styles.customFieldsSection}>
                <div className={styles.formGroup}>Carregando campos customizados...</div>
              </div>
            ) : customFields.length > 0 ? (
              <div className={styles.customFieldsSection}>
                <CustomFieldsRenderModal
                  customFields={customFields}
                  control={control}
                  errors={errors}
                />
              </div>
            ) : null}
          </div>

          <div className={`${styles.modalFooter} ${styles[theme]}`}>
            <Button type="button" className={`${styles.btnCancel} ${styles[theme]}`} onClick={handleClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className={`${styles.btnSave} ${styles[theme]}`}
              style={{
                background: `linear-gradient(135deg, ${emphasisColor || '#667eea'} 0%, ${emphasisColor || '#764ba2'} 100%)`
              }}
            >
              {isEditMode ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;