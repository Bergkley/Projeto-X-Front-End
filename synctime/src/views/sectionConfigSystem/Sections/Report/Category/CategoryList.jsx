// ⚙️ Bibliotecas externas
import { useEffect, useState } from "react";
import { Edit2, Trash2 } from "lucide-react";

// 💅 Estilos
import styles from './CategoryList.module.css';

// 🧩 Componentes
import TableHeader from "../../../../../components/header/TableHeader/TableHeader";
import ActionHeader from "../../../../../components/header/ActionHeader/ActionHeader";
import Table from "../../../../../components/table/Table";
import Pagination from "../../../../../components/pagination/Pagination";

// 
import ServiceCategory from "./services/ServiceCategory";

const CategoryList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [order, setOrder] = useState('');
  const itemsPerPage = 10;

  // Debounce the search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page to 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await ServiceCategory.getByAllCategory(
          currentPage,
          debouncedSearchTerm,
          sortBy,
          order
        );
        if (response.data.status === 'OK') {
          setCategories(response.data.data);
          setTotalItems(response.data.totalRegisters);
        }
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [currentPage, debouncedSearchTerm, sortBy, order]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const columns = [
    {
      key: 'name',
      label: 'Nome',
      render: (row) => (
        <div className={styles.nameCell}>
          <div>{row.name}</div>
        </div>
      )
    },
    { key: 'description', label: 'Descrição' },
    { key: 'type', label: 'Tipo' },
    {
      key: 'actions',
      label: 'Ações',
      sortable: false,
      render: (row, idx, { onEdit, onDelete }) => (
        <div className={styles.actionsCell}>
          <button className={styles.editButton} onClick={() => onEdit(row.id)}>
            <Edit2 size={16} />
          </button>
          <button 
            className={styles.deleteButton} 
            onClick={() => onDelete(row.id)}
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

  const handleEdit = (categoryId) => {
    console.log('Editar categoria:', categoryId);
    // Implementar navegação para editar categoria
  };

  const handleDelete = (categoryId) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      console.log('Excluir categoria:', categoryId);
      // Implementar chamada para API de delete
    }
  };

  const handleBack = () => {
    console.log('Voltar');
    // Implementar navegação para voltar
  };

  const handleCreate = () => {
    console.log('Criar nova categoria');
    // Implementar navegação para criar nova categoria
  };

  const handleSelectionChange = (selectedItems) => {
    console.log('Selected items:', selectedItems);
  };

  const sortConfig = sortBy ? { key: sortBy, direction: order } : { key: null, direction: null };

  if (loading && categories.length === 0) {
    return <div>Carregando...</div>; // Show loading only on initial load
  }

  return (
    <div className={styles.container}>
      <ActionHeader
        onBack={handleBack}
        onCreate={handleCreate}
        backButtonLabel="Voltar"
        createButtonLabel="Criar"
      />

      <TableHeader
        title="Categorias"
        searchPlaceholder="Pesquisar por nome"
        onSearch={setSearchTerm}
      />

      <Table
        columns={columns}
        data={categories}
        selectable={false}
        reorderable={true}
        onSelectionChange={handleSelectionChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
        sortConfig={sortConfig}
        onSort={handleSort}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default CategoryList;