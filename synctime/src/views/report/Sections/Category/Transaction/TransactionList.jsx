// ⚙️ Bibliotecas externas
import { useEffect, useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { useHistory, useLocation } from 'react-router-dom';
import useFlashMessage from '../../../../../hooks/userFlashMessage';
import { useTheme } from '../../../../../hooks/useTheme';
import { useEmphasisColor } from '../../../../../hooks/useEmphasisColor';
import LoadingSpinner from '../../../../../components/loading/LoadingSpinner';
import ActionHeader from '../../../../../components/header/ActionHeader/ActionHeader';
import TableHeaderWithFilter from '../../../../../components/header/TableHeaderWithFilter/TableHeaderWithFilter';
import ConfirmModal from '../../../../../components/modal/ConfirmModal';
import styles from './TransactionList.module.css';
import TableWithDate from '../../../../../components/table/TableWithDate';
import ServiceTransactionsRecord from '../services/ServiceTransactionsRecord';

// 💅 Estilos

// 🔧 Services e Hooks

// 🧩 Componentes

const TransactionList = () => {
  const location = useLocation();
  const { monthlyRecordId, month, year } = location.state || {};
  const history = useHistory();
  const { setFlashMessage } = useFlashMessage();
  const { theme } = useTheme();
  const { emphasisColor } = useEmphasisColor();

  const [transactionRecords, setTransactionRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [activeFilters, setActiveFilters] = useState([]);
  const [status, setStatus] = useState('');
  const [recordTypeId, setRecordTypeId] = useState(null);
  const [categoryId, setCategoryId] = useState(null);

  const [sortBy, setSortBy] = useState('');
  const [order, setOrder] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const dados = { categoryId, recordTypeId, monthlyRecordId, month, year };

  const filterColumns = [
    { id: 'title', label: 'Título', type: 'text' },
    { id: 'description', label: 'Descrição', type: 'text' },
    { id: 'goal', label: 'Meta', type: 'number' },
    { id: 'initial_balance', label: 'Saldo Inicial', type: 'number' },
    { id: 'month', label: 'Mês', type: 'number' },
    { id: 'year', label: 'Ano', type: 'number' },
    { id: 'status', label: 'Status', type: 'text' },
    { id: 'category.name', label: 'Categoria', type: 'text' },
    { id: 'created_at', label: 'Data de Criação', type: 'date' },
    { id: 'updated_at', label: 'Última Atualização', type: 'date' }
  ];

  useEffect(() => {
    const fetchTransactionsRecord = async () => {
      setLoading(true);
      try {
        const filtersToSend = activeFilters
          .filter((filter) => filter.value && filter.value.trim() !== '')
          .map((filter) => ({
            field: filter.column,
            operator: filter.operator,
            value: filter.value,
            value2: filter.value2 || null
          }));

        const response =
          await ServiceTransactionsRecord.getByAllTransactionsRecord(
            sortBy,
            order,
            filtersToSend,
            monthlyRecordId
          );

        if (response.data.status === 'OK') {
          setStatus(response.data.status);
          setTransactionRecords(
            response.data.data.map((item) => {return { ...item.transaction, customFields: item.customFields };})
          );
          if (response.data.data.length > 0) {
            setRecordTypeId(response.data.data[0].recordTypeId);
            setCategoryId(response.data.data[0].transaction.category_id);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar registros dos registros mensais:', error);
        setFlashMessage('Erro ao buscar registros dos registros mensais', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionsRecord();
  }, [sortBy, order, activeFilters, monthlyRecordId, refreshTrigger]);

  const formatCurrency = (value) => {
    if (value === null) return '0,00';
    return (
      new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value || 0) || '0,00'
    );
  };

  const columns = [
    {
      key: 'title',
      label: 'Título',
      render: (row) => (
        <div className={styles.nameCell}>
          <div className={styles.title}>{row.title}</div>
        </div>
      )
    },
    {
      key: 'description',
      label: 'Descrição',
      render: (row) => row.description || '-'
    },

    {
      key: 'amount',
      label: 'Saldo Inicial',
      render: (row) => formatCurrency(row.amount)
    },
    {
      key: 'actions',
      label: 'Ações',
      sortable: false,
      render: (row, idx, { onEdit, onDelete }) => (
        <div className={styles.actionsCell}>
          <button
            className={styles.editButton}
            onClick={() => onEdit(row.id)}
            title="Editar registro"
            style={{
              backgroundColor: emphasisColor || '#0ea5e9'
            }}
          >
            <Edit2 size={16} />
          </button>
          <button
            className={styles.deleteButton}
            onClick={() => onDelete(row.id)}
            title="Excluir registro"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  const handleSort = (key, direction) => {
    setSortBy(direction ? key : '');
    setOrder(direction || '');
  };

  const handleEdit = (recordId) => {
    history.push(`/relatorios/categoria/transações/form/${recordId}`, {
      dados
    });
  };

  const handleDeleteRecord = async () => {
    if (!transactionToDelete) return;

    try {
      setIsDeleting(true);
      await ServiceTransactionsRecord.deleteTransactionsRecord(
        transactionToDelete
      );
      setFlashMessage('Registro mensal excluído com sucesso', 'success');

      const filtersToSend = activeFilters
        .filter((filter) => filter.value && filter.value.trim() !== '')
        .map((filter) => ({
          field: filter.column,
          operator: filter.operator,
          value: filter.value,
          value2: filter.value2 || null
        }));

      const response =
        await ServiceTransactionsRecord.getByAllTransactionsRecord(
          sortBy,
          order,
          filtersToSend,
          monthlyRecordId
        );

      if (response.data.status === 'OK') {
        setTransactionRecords(
            response.data.data.map((item) => {return { ...item.transaction, customFields: item.customFields };})
          );
        if (response.data.data.length > 0) {
          setRecordTypeId(response.data.data[0].recordTypeId);
          setCategoryId(response.data.data[0].transaction.category_id);
        }
      }
    } catch (error) {
      console.error('Erro ao excluir registro mensal:', error);
      setFlashMessage('Erro ao excluir registro mensal', 'error');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setTransactionToDelete(null);
    }
  };

  const handleDelete = (recordId) => {
    setTransactionToDelete(recordId);
    setShowDeleteModal(true);
  };

  const handleBack = () => {
    history.push(`/relatorios/categoria/relatorio-mesal/${categoryId}`);
  };

  const handleCreate = () => {
    history.push('/relatorios/categoria/transações/form', { dados });
  };

  const handleSelectionChange = (selectedItems) => {
    console.log('Itens selecionados:', selectedItems);
  };

  const handleFiltersChange = (filters) => {
    setActiveFilters(filters);
  };

  const createTransactionRecord = async (data) => {
    try {
      await ServiceTransactionsRecord.createTransactionsRecord(data);
      setFlashMessage('Transação criada com sucesso', 'success');
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      setFlashMessage('Erro ao criar transação', 'error');
      throw error;
    }
  };

  const editTransactionRecord = async (id, data) => {
    try {
      await ServiceTransactionsRecord.editTransactionsRecord(id, data);
      setFlashMessage('Transação atualizada com sucesso', 'success');
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error('Erro ao editar transação:', error);
      setFlashMessage('Erro ao editar transação', 'error');
      throw error;
    }
  };

  const sortConfig = sortBy
    ? { key: sortBy, direction: order }
    : { key: null, direction: null };

  if (loading && transactionRecords.length === 0 && !status) {
    return <LoadingSpinner message="Carregando registros dos registros mensais..." />;
  }

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <ActionHeader
        onBack={handleBack}
        onCreate={handleCreate}
        backButtonLabel="Voltar"
        createButtonLabel="Novo Registro"
      />

      <TableHeaderWithFilter
        title="Registros Mensais"
        columns={filterColumns}
        onFiltersChange={handleFiltersChange}
      />

      {transactionRecords.length === 0 && !loading ? (
        <div className={`${styles.emptyState} ${styles[theme]}`}>
          <p>Nenhum registros dos registro mensal encontrado.</p>
          <button
            onClick={handleCreate}
            className={styles.emptyStateButton}
            style={{
              backgroundColor:
                emphasisColor ||
                (theme === 'dark' ? 'rgb(20, 18, 129)' : '#007bff')
            }}
          >
            Criar primeiro registro
          </button>
        </div>
      ) : (
        <>
          <TableWithDate
            columns={columns}
            data={transactionRecords}
            selectable={false}
            reorderable={true}
            onSelectionChange={handleSelectionChange}
            onEdit={handleEdit}
            onDelete={handleDelete}
            sortConfig={sortConfig}
            onSort={handleSort}
            groupBy="date"
            month={month}
            year={year}
            dados={dados}
            onCreateRecord={createTransactionRecord}
            onUpdateRecord={editTransactionRecord}
          />
        </>
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setTransactionToDelete(null);
        }}
        onConfirm={handleDeleteRecord}
        title="Confirmar exclusão"
        message="Tem certeza que deseja excluir este registro dos registro mensal? Esta ação não pode ser desfeita e todas as transações associadas também serão removidas."
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        danger={true}
        loading={isDeleting}
      />
    </div>
  );
};

export default TransactionList;