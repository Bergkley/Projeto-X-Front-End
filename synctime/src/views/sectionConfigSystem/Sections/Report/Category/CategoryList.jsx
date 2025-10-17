// ⚙️ Bibliotecas externas
import { useState } from "react";
import { Edit2 } from "lucide-react";

// 💅 Estilos
import styles from './CategoryList.module.css';

// 🧩 Componentes
import TableHeader from "../../../../../components/header/TableHeader/TableHeader";
import ActionHeader from "../../../../../components/header/ActionHeader/ActionHeader";
import Table from "../../../../../components/table/Table";
import Pagination from "../../../../../components/pagination/Pagination";


const CategoryList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDisabled, setShowDisabled] = useState(false);
  const itemsPerPage = 6;

  const usersData = [
    { id: 1, name: 'teste', role: 'Admin', login: 'teste', code: '000001', profile: 'A', enabled: true },
    { id: 5, name: 'Bergkley Ferreira Brasil', role: 'Admin', login: 'bergkley', code: '000002', profile: 'A', enabled: true },
    { id: 5, name: 'Bergkley Ferreira Brasil', role: 'Admin', login: 'bergkley', code: '000002', profile: 'A', enabled: true },
    { id: 5, name: 'Bergkley Ferreira Brasil', role: 'Admin', login: 'bergkley', code: '000002', profile: 'A', enabled: true },
    { id: 5, name: 'Bergkley Ferreira Brasil', role: 'Admin', login: 'bergkley', code: '000002', profile: 'A', enabled: true },
    { id: 5, name: 'Bergkley Ferreira Brasil', role: 'Admin', login: 'bergkley', code: '000002', profile: 'A', enabled: true },
    { id: 5, name: 'Bergkley Ferreira Brasil', role: 'Admin', login: 'bergkley', code: '000002', profile: 'A', enabled: true },
    { id: 5, name: 'Bergkley Ferreira Brasil', role: 'Admin', login: 'bergkley', code: '000002', profile: 'A', enabled: true },
    { id: 5, name: 'Bergkley Ferreira Brasil', role: 'Admin', login: 'bergkley', code: '000002', profile: 'A', enabled: true },
    { id: 5, name: 'Bergkley Ferreira Brasil', role: 'Admin', login: 'bergkley', code: '000002', profile: 'A', enabled: true },
  ];

  const columns = [
    {
      key: 'name',
      label: 'Nome',
      render: (row) => (
        <div className={styles.nameCell}>
          <div className={styles.avatar}>{row.name.charAt(0)}</div>
          <div>
            <div className={styles.userName}>{row.name}</div>
            <div className={styles.userRole}>{row.role}</div>
          </div>
        </div>
      )
    },
    { key: 'login', label: 'Login' },
    { key: 'code', label: 'Código do Agente' },
    {
      key: 'profile',
      label: 'Perfil',
      render: (row) => (
        <div className={styles.profileBadge}>{row.profile}</div>
      )
    },
    {
      key: 'enabled',
      label: 'Habilitar',
      render: (row, idx, { onToggleStatus }) => (
        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={row.enabled}
            onChange={() => onToggleStatus(row.id)}
          />
          <span className={styles.slider}></span>
        </label>
      )
    },
    {
      key: 'actions',
      label: 'Editar',
      render: (row, idx, { onEdit }) => (
        <button className={styles.editButton} onClick={() => onEdit(row.id)}>
          <Edit2 size={16} />
        </button>
      )
    }
  ];

  const filteredData = usersData.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.login.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEnabled = showDisabled ? true : user.enabled;
    return matchesSearch && matchesEnabled;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleToggleStatus = (userId) => {
    console.log('Toggle status for user:', userId);
  };

  const handleEdit = (userId) => {
    console.log('Edit user:', userId);
  };

  const handleBack = () => {
    console.log('Voltar');
    // Implementar navegação para voltar
  };

  const handleCreate = () => {
    console.log('Criar novo usuário');
    // Implementar navegação para criar novo usuário
  };

  const handleSelectionChange = (selectedItems) => {
    console.log('Selected items:', selectedItems);
  };

  return (
    <div className={styles.container}>
      <ActionHeader
        onBack={handleBack}
        onCreate={handleCreate}
        backButtonLabel="Voltar"
        createButtonLabel="Criar"
      />

      <TableHeader
        title="Usuários"
        searchPlaceholder="Insira seu nome de usuário ou login"
        onSearch={setSearchTerm}
        showDisabledToggle={true}
        showDisabled={showDisabled}
        onToggleDisabled={() => setShowDisabled(!showDisabled)}
      />

      <Table
        columns={columns}
        data={paginatedData}
        selectable={false}
        reorderable={true}
        onSelectionChange={handleSelectionChange}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredData.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default CategoryList;