import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import styles from './TransactionModal.module.css';
import { Button } from 'reactstrap';

const TransactionModal = ({ 
  isOpen, 
  onClose, 
  record, 
  onSave 
}) => {
  const isEditMode = !!record;
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    goal: '',
    status: '',
    initial_balance: '',
    month: '',
    year: '',
    category_id: '',
    user_id: ''
  });

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && record) {
        setFormData({
          title: record.title || '',
          description: record.description || '',
          goal: record.goal || '',
          status: record.status || '',
          initial_balance: record.initial_balance || '',
          month: record.month || '',
          year: record.year || '',
          category_id: record.category_id || '',
          user_id: record.user_id || ''
        });
      } else {
        setFormData({
          title: '',
          description: '',
          goal: '',
          status: '',
          initial_balance: '',
          month: '',
          year: '',
          category_id: '',
          user_id: ''
        });
      }
    }
  }, [isOpen, record, isEditMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave?.(formData);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {isEditMode ? 'Editar Registro Mensal' : 'Novo Registro Mensal'}
          </h2>
          <button className={styles.closeBtn} onClick={handleClose}>
            <X size={24} />
          </button>
        </div>
        <form className={styles.modalBody} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.formLabel}>Título</label>
            <input
              type="text"
              id="title"
              name="title"
              className={styles.formInput}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Ex: Orçamento de Outubro"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.formLabel}>Descrição (Opcional)</label>
            <textarea
              id="description"
              name="description"
              className={styles.formTextarea}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva detalhes do registro..."
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="goal" className={styles.formLabel}>Meta</label>
            <input
              type="number"
              id="goal"
              name="goal"
              className={styles.formInput}
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              required
              placeholder="Ex: 5000"
              step="0.01"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="status" className={styles.formLabel}>Status</label>
            <select
              id="status"
              name="status"
              className={styles.formSelect}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              required
            >
              <option value="">Selecione o status</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
              <option value="completed">Concluído</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="initial_balance" className={styles.formLabel}>Saldo Inicial (Opcional)</label>
            <input
              type="number"
              id="initial_balance"
              name="initial_balance"
              className={styles.formInput}
              value={formData.initial_balance}
              onChange={(e) => setFormData({ ...formData, initial_balance: e.target.value })}
              placeholder="Ex: 1000"
              step="0.01"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="month" className={styles.formLabel}>Mês</label>
            <select
              id="month"
              name="month"
              className={styles.formSelect}
              value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: e.target.value })}
              required
            >
              <option value="">Selecione o mês</option>
              <option value="1">Janeiro</option>
              <option value="2">Fevereiro</option>
              <option value="3">Março</option>
              <option value="4">Abril</option>
              <option value="5">Maio</option>
              <option value="6">Junho</option>
              <option value="7">Julho</option>
              <option value="8">Agosto</option>
              <option value="9">Setembro</option>
              <option value="10">Outubro</option>
              <option value="11">Novembro</option>
              <option value="12">Dezembro</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="year" className={styles.formLabel}>Ano</label>
            <input
              type="number"
              id="year"
              name="year"
              className={styles.formInput}
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              required
              placeholder="Ex: 2025"
              min="2000"
              max="2100"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="categoryId" className={styles.formLabel}>ID da Categoria</label>
            <input
              type="text"
              id="categoryId"
              name="category_id"
              className={styles.formInput}
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              required
              placeholder="Ex: 123"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="userId" className={styles.formLabel}>ID do Usuário</label>
            <input
              type="text"
              id="userId"
              name="user_id"
              className={styles.formInput}
              value={formData.user_id}
              onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
              required
              placeholder="Ex: 456"
            />
          </div>
        </form>
        <div className={styles.modalFooter}>
          <Button type="button"className={styles.btnCancel} onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" className={styles.btnSave}>
            {isEditMode ? 'Salvar' : 'Criar'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;