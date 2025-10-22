// ⚙️ Bibliotecas externas
import { useEffect, useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { useHistory } from 'react-router-dom';
import useFlashMessage from '../../../../../hooks/userFlashMessage';
import ServiceMonthlyRecord from '../services/ServiceMonthlyRecord';
import LoadingSpinner from '../../../../../components/loading/LoadingSpinner';
import ActionHeader from '../../../../../components/header/ActionHeader/ActionHeader';
import TableHeaderWithFilter from '../../../../../components/header/TableHeaderWithFilter/TableHeaderWithFilter';
import Pagination from '../../../../../components/pagination/Pagination';
import ConfirmModal from '../../../../../components/modal/ConfirmModal';
import styles from './TransactionList.module.css';
import TableWithDate from '../../../../../components/table/TableWithDate';


// 💅 Estilos

// 🔧 Services e Hooks

// 🧩 Componentes


const TransactionList = () => {
  const history = useHistory();
  const { setFlashMessage } = useFlashMessage();

  const [currentPage, setCurrentPage] = useState(1);
  const [monthlyRecords, setMonthlyRecords] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [activeFilters, setActiveFilters] = useState([]);
  const [status, setStatus] = useState('');

  const [sortBy, setSortBy] = useState('');
  const [order, setOrder] = useState('');
  const itemsPerPage = 10;


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
    setCurrentPage(1);
  }, [activeFilters]);

  useEffect(() => {
    const fetchMonthlyRecords = async () => {
      setLoading(true);
      try {
        const filtersToSend = activeFilters
          .filter(filter => filter.value && filter.value.trim() !== '')
          .map(filter => ({
            field: filter.column,
            operator: filter.operator,
            value: filter.value,
            value2: filter.value2 || null
          }));

        const response = await ServiceMonthlyRecord.getByAllMonthlyRecord(
          currentPage,
          sortBy,
          order,
          filtersToSend 
        );

        if (response.data.status === 'OK') {
          setStatus(response.data.status);
          setMonthlyRecords(response.data.data);
          setTotalItems(response.data.totalRegisters);
        }
      } catch (error) {
        console.error('Erro ao buscar registros mensais:', error);
        setFlashMessage('Erro ao buscar registros mensais', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyRecords();
  }, [currentPage, sortBy, order, activeFilters]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const formatMonthYear = (month, year) => {
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `${monthNames[month - 1]} ${year}`;
  };

  const formatCurrency = (value) => {
    if(value === null) return '0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0) || '0,00';
  };

  const formatStatus = (status) => {
    const statusMap = {
      'active': 'Ativo',
      'completed': 'Completo',
      'cancelled': 'Cancelado',
      'pending': 'Pendente'
    };
    return statusMap[status] || status;
  };

  const columns = [
    {
      key: 'title',
      label: 'Título',
      render: (row) => (
        <div className={styles.nameCell}>
          <div className={styles.title}>{row.title}</div>
          {row.description && (
            <div className={styles.subtitle}>{row.description}</div>
          )}
        </div>
      )
    },
    {
      key: 'category',
      label: 'Categoria',
      render: (row) => row.category?.name || '-'
    },
    {
      key: 'month',
      label: 'Período',
      render: (row) => formatMonthYear(row.month, row.year)
    },
    {
      key: 'goal',
      label: 'Meta',
      render: (row) => {return row.goal}
    },
    {
      key: 'initial_balance',
      label: 'Saldo Inicial',
      render: (row) => formatCurrency(row.initial_balance)
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={styles[`status-${row.status}`]}>
          {formatStatus(row.status)}
        </span>
      )
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
    setCurrentPage(1);
  };

  const handleEdit = (recordId) => {
    history.push(`/registro-mensal/form/${recordId}`);
  };

  const handleDeleteRecord = async () => {
    if (!recordToDelete) return;

    try {
      setIsDeleting(true);
      await ServiceMonthlyRecord.deleteMonthlyRecord(recordToDelete);
      setFlashMessage('Registro mensal excluído com sucesso', 'success');

      const filtersToSend = activeFilters
        .filter(filter => filter.value && filter.value.trim() !== '')
        .map(filter => ({
          field: filter.column,
          operator: filter.operator,
          value: filter.value,
          value2: filter.value2 || null
        }));

      const response = await ServiceMonthlyRecord.getByAllMonthlyRecord(
        currentPage,
        sortBy,
        order,
        filtersToSend
      );

      if (response.data.status === 'OK') {
        setMonthlyRecords(response.data.data);
        setTotalItems(response.data.totalRegisters);
        
        if (response.data.data.length === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      }
    } catch (error) {
      console.error('Erro ao excluir registro mensal:', error);
      setFlashMessage('Erro ao excluir registro mensal', 'error');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setRecordToDelete(null);
    }
  };

  const handleDelete = (recordId) => {
    setRecordToDelete(recordId);
    setShowDeleteModal(true);
  };

  const handleBack = () => {
    history.push('/dashboard');
  };

  const handleCreate = () => {
    history.push('/registro-mensal/form');
  };

  const handleSelectionChange = (selectedItems) => {
    console.log('Itens selecionados:', selectedItems);
  };

  const handleFiltersChange = (filters) => {
    console.log('Filtros aplicados:', filters);
    setActiveFilters(filters);
  };

  const sortConfig = sortBy
    ? { key: sortBy, direction: order }
    : { key: null, direction: null };

  if (loading && monthlyRecords.length === 0 && !status ) {
    return <LoadingSpinner message="Carregando registros mensais..." />;
  }

  return (
    <div className={styles.container}>
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

      {monthlyRecords.length === 0 && !loading ? (
        <div className={styles.emptyState}>
          <p>Nenhum registro mensal encontrado.</p>
          <button onClick={handleCreate} className={styles.emptyStateButton}>
            Criar primeiro registro
          </button>
        </div>
      ) : (
        <>
          <TableWithDate
            columns={columns}
            data={monthlyRecords}
            selectable={false}
            reorderable={true}
            onSelectionChange={handleSelectionChange}
            onEdit={handleEdit}
            onDelete={handleDelete}
            sortConfig={sortConfig}
            onSort={handleSort}
            groupBy='date'
            month={10}
            year={2025}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setRecordToDelete(null);
        }}
        onConfirm={handleDeleteRecord}
        title="Confirmar exclusão"
        message="Tem certeza que deseja excluir este registro mensal? Esta ação não pode ser desfeita e todas as transações associadas também serão removidas."
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        danger={true}
        loading={isDeleting}
      />
    </div>
  );
};

export default TransactionList;