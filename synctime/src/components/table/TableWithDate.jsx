import React, { useState, useEffect } from 'react';
import {
  Filter,
  GripVertical,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  Plus
} from 'lucide-react';

// 💅 Estilos
import styles from './TableWithDate.module.css';

// 🧠 Hooks customizados
import { useTheme } from '../../hooks/useTheme';
import { useEmphasisColor } from '../../hooks/useEmphasisColor';
import {
  useMemorizeTableColumns,
  TABLE_CONFIG_KEYS
} from '../../hooks/useMemorizeTableColumns';
import TransactionModal from '../modal/TransactionModal';

const TableWithDate = ({
  columns,
  data,
  selectable = false,
  reorderable = false,
  onSelectionChange,
  onEdit,
  onToggleStatus,
  onDelete,
  sortConfig,
  onSort,
  groupBy = null,
  month,
  year,
  onUpdateRecord,
  onCreateRecord,
  tableKey = TABLE_CONFIG_KEYS.TRANSACTIONS_RECORDS,
  dados
}) => {
  const { theme } = useTheme();
  const { emphasisColor } = useEmphasisColor();
  const { getMemorizedConfig, memorizeVisibleColumns, memorizeColumnOrder } =
    useMemorizeTableColumns(tableKey);

  const [selectedRows, setSelectedRows] = useState(new Set());
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [columnOrder, setColumnOrder] = useState([]);
  const [showColumnFilter, setShowColumnFilter] = useState(false);
  const [draggedColumn, setDraggedColumn] = useState(null);
  const [expandedDays, setExpandedDays] = useState(new Set());
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [currentGroupBy, setCurrentGroupBy] = useState(groupBy || null);
  const [showGroupByDropdown, setShowGroupByDropdown] = useState(false);

  const monthNames = [
    'JAN',
    'FEV',
    'MAR',
    'ABR',
    'MAI',
    'JUN',
    'JUL',
    'AGO',
    'SET',
    'OUT',
    'NOV',
    'DEZ'
  ];
  const dayNames = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];

  useEffect(() => {
    setCurrentGroupBy(groupBy || null);
  }, [groupBy]);

  useEffect(() => {
    const memorizedConfig = getMemorizedConfig();

    if (memorizedConfig) {
      const validVisibleColumns =
        memorizedConfig.visibleColumns?.filter((key) =>
          columns.some((col) => col.key === key)
        ) || columns.map((col) => col.key);

      const validColumnOrder =
        memorizedConfig.columnOrder?.filter((key) =>
          columns.some((col) => col.key === key)
        ) || columns.map((col) => col.key);

      const newColumns = columns
        .filter((col) => !validColumnOrder.includes(col.key))
        .map((col) => col.key);

      setVisibleColumns(validVisibleColumns.concat(newColumns));
      setColumnOrder(validColumnOrder.concat(newColumns));
    } else {
      const allColumnKeys = columns.map((col) => col.key);
      setVisibleColumns(allColumnKeys);
      setColumnOrder(allColumnKeys);
    }
  }, [columns, getMemorizedConfig]);

  const getValue = (row, key) => {
    if (key.startsWith('custom_')) {
      const fieldName = key.slice(7);
      return row.customFields?.[fieldName] || '';
    }
    return row[key];
  };

  const openModal = (record = null, partialData = {}) => {
    setSelectedRecord(record ? record : { ...partialData, id: null });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRecord(null);
  };

  const handleModalSave = async (updatedData) => {
    if (selectedRecord && selectedRecord.id) {
      await onUpdateRecord?.(selectedRecord.id, updatedData);
    } else {
      await onCreateRecord?.(updatedData);
    }
  };

  const toggleDay = (groupKey) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(groupKey)) {
      newExpanded.delete(groupKey);
    } else {
      newExpanded.add(groupKey);
    }
    setExpandedDays(newExpanded);
  };

  const getAllGroupKeys = () => {
    if (!groupedData || !currentGroupBy) return [];
    if (currentGroupBy === 'date') {
      return Object.keys(groupedData).map(Number);
    } else if (currentGroupBy === 'week') {
      const daysInMonth = new Date(year, month, 0).getDate();
      return Array.from({ length: Math.ceil(daysInMonth / 7) }, (_, i) => i + 1);
    }
    return [];
  };

  const expandAll = () => {
    const allGroups = getAllGroupKeys();
    setExpandedDays(new Set(allGroups));
  };

  const collapseAll = () => {
    setExpandedDays(new Set());
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allRows = new Set(data);
      setSelectedRows(allRows);
      onSelectionChange?.(Array.from(allRows));
    } else {
      setSelectedRows(new Set());
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (row) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(row)) {
      newSelected.delete(row);
    } else {
      newSelected.add(row);
    }
    setSelectedRows(newSelected);
    onSelectionChange?.(Array.from(newSelected));
  };

  const toggleColumnVisibility = (columnKey) => {
    if (columnKey === 'actions') return;

    const newVisibleColumns = visibleColumns.includes(columnKey)
      ? visibleColumns.filter((k) => k !== columnKey)
      : [...visibleColumns, columnKey];

    setVisibleColumns(newVisibleColumns);
    memorizeVisibleColumns(newVisibleColumns);
  };

  const handleSortAsc = (key) => {
    if (!onSort) return;
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      onSort(key, null);
    } else {
      onSort(key, 'asc');
    }
  };

  const handleSortDesc = (key) => {
    if (!onSort) return;
    if (sortConfig?.key === key && sortConfig?.direction === 'desc') {
      onSort(key, null);
    } else {
      onSort(key, 'desc');
    }
  };

  // Lógica de ordenação
  const sortedData = React.useMemo(() => {
    if (!sortConfig?.key) return data;
    return [...data].sort((a, b) => {
      const aVal = getValue(a, sortConfig.key);
      const bVal = getValue(b, sortConfig.key);
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const handleDragStart = (e, columnKey) => {
    setDraggedColumn(columnKey);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetColumnKey) => {
    e.preventDefault();
    if (!draggedColumn || draggedColumn === targetColumnKey) return;

    const newOrder = [...columnOrder];
    const draggedIdx = newOrder.indexOf(draggedColumn);
    const targetIdx = newOrder.indexOf(targetColumnKey);

    newOrder.splice(draggedIdx, 1);
    newOrder.splice(targetIdx, 0, draggedColumn);

    setColumnOrder(newOrder);
    memorizeColumnOrder(newOrder);
    setDraggedColumn(null);
  };

  const orderedColumns = columnOrder
    .map((key) => columns.find((col) => col.key === key))
    .filter((col) => col && visibleColumns.includes(col.key));

  const groupedData = React.useMemo(() => {
    if (!currentGroupBy || !sortedData.length) return null;

    const result = sortedData.reduce((acc, row) => {
      const [yearStr, monthStr, dayStr] = row.transaction_date.split('-');
      const yearNum = parseInt(yearStr, 10);
      const monthNum = parseInt(monthStr, 10);
      const dayNum = parseInt(dayStr, 10);

      if (monthNum === month && yearNum === year) {
        let groupKey;
        if (currentGroupBy === 'date') {
          groupKey = dayNum;
        } else if (currentGroupBy === 'week') {
          groupKey = Math.ceil(dayNum / 7);
        }

        if (groupKey && !acc[groupKey]) {
          acc[groupKey] = [];
        }
        if (groupKey) {
          acc[groupKey].push(row);
        }
      }
      return acc;
    }, {});

    return result;
  }, [sortedData, currentGroupBy, month, year]);

  const renderGroupedRows = () => {
    if (!groupedData) {
      return sortedData.map((row) => (
        <tr key={row.id} className={styles.tableRow}>
          {selectable && (
            <td className={styles.tableCell}>
              <input
                type="checkbox"
                checked={selectedRows.has(row)}
                onChange={() => handleSelectRow(row)}
                className={styles.checkbox}
                style={{
                  accentColor: emphasisColor || '#0ea5e9'
                }}
              />
            </td>
          )}
          {orderedColumns.map((column) => (
            <td key={column.key} className={styles.tableCell}>
              {column.render
                ? column.render(row, row.id, {
                    onEdit,
                    onToggleStatus,
                    onDelete
                  })
                : (getValue(row, column.key) || '-')}
            </td>
          ))}
        </tr>
      ));
    }

    const monthAbbr = monthNames[month - 1];
    const daysInMonth = new Date(year, month, 0).getDate();
    const allGroups = [];

    if (currentGroupBy === 'date') {
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day);
        const dayAbbr = dayNames[date.getDay()];
        const headerText = `${day.toString().padStart(2, '0')} ${monthAbbr}/${year
          .toString()
          .slice(-2)} ${dayAbbr}`;
        const groupRows = groupedData[day] || [];

        allGroups.push({ groupKey: day, headerText, rows: groupRows });
      }
    } else if (currentGroupBy === 'week') {
      const numWeeks = Math.ceil(daysInMonth / 7);
      for (let week = 1; week <= numWeeks; week++) {
        const startDay = (week - 1) * 7 + 1;
        const endDay = Math.min(week * 7, daysInMonth);
        const headerText = `Semana ${week} (${startDay.toString().padStart(2, '0')}-${endDay.toString().padStart(2, '0')} ${monthAbbr}/${year.toString().slice(-2)})`;
        const groupRows = groupedData[week] || [];

        allGroups.push({ groupKey: week, headerText, rows: groupRows, startDay });
      }
    }

    return allGroups.map(({ groupKey, headerText, rows, startDay }) => (
      <React.Fragment key={groupKey}>
        <tr
          className={`${styles.tableRow} ${styles.groupHeaderRow} ${
            expandedDays.has(groupKey) ? styles.expanded : ''
          }`}
          onClick={() => toggleDay(groupKey)}
          style={{ cursor: 'pointer' }}
        >
          <td
            colSpan={orderedColumns.length + (selectable ? 1 : 0)}
            className={`${styles.tableCell} ${styles.groupHeaderCell}`}
          >
            <div className={styles.groupHeaderContent}>
              <ChevronRight
                size={16}
                className={`${styles.expandIcon} ${
                  expandedDays.has(groupKey) ? styles.expanded : ''
                }`}
              />
              <span>{headerText}</span>
              <span className={styles.recordCount}>
                {rows.length > 0
                  ? `${rows.length} ${
                      rows.length === 1 ? 'registro' : 'registros'
                    }`
                  : 'Sem registros'}
              </span>
            </div>
          </td>
        </tr>
        {expandedDays.has(groupKey) && (
          <tr className={styles.cardsContainerRow}>
            <td
              colSpan={orderedColumns.length + (selectable ? 1 : 0)}
              className={styles.cardsContainerCell}
            >
              {rows.length === 0 ? (
                <div className={styles.emptyState}>
                  <span className={styles.emptyStateText}>
                    Nenhum registro neste {currentGroupBy === 'date' ? 'dia' : 'semana'}
                  </span>
                </div>
              ) : (
                <div className={styles.cardsGrid}>
                  {rows.map((row) => (
                    <div
                      key={row.id}
                      className={styles.recordCard}
                      onClick={() => openModal(row)}
                      style={{ cursor: 'pointer' }}
                    >
                      {selectable && (
                        <div className={styles.cardCheckbox}>
                          <input
                            type="checkbox"
                            checked={selectedRows.has(row)}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleSelectRow(row);
                            }}
                            className={styles.checkbox}
                            style={{
                              accentColor: emphasisColor || '#0ea5e9'
                            }}
                          />
                        </div>
                      )}
                      <div className={styles.cardContent}>
                        {orderedColumns.map((column) => (
                          <div key={column.key} className={styles.cardField}>
                            <span className={styles.cardLabel}>
                              {column.label}:
                            </span>
                            <span className={styles.cardValue}>
                              {column.render
                                ? column.render(row, row.id, {
                                    onEdit,
                                    onToggleStatus,
                                    onDelete
                                  })
                                : (getValue(row, column.key) || '-')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div
                className={`${styles.recordCard} ${styles.addCard}`}
                onClick={() => openModal(null, { month, year, day: startDay || groupKey })}
              >
                <div className={styles.addCardContent}>
                  <Plus size={24} className={styles.addIcon} />
                  <span className={styles.addText}>
                    Adicionar Novo Registro
                  </span>
                </div>
              </div>
            </td>
          </tr>
        )}
      </React.Fragment>
    ));
  };

  const handleGroupBySelect = (groupByOption) => {
    setCurrentGroupBy(groupByOption);
    setShowGroupByDropdown(false);
  };

  return (
    <div className={`${styles.tableContainer} ${styles[theme]}`}>
      <div className={styles.tableToolbar}>
        <div className={styles.toolbarLeft}>
          <div className={styles.groupBySelector}>
            <button
              className={styles.groupByButton}
              onClick={() => setShowGroupByDropdown(!showGroupByDropdown)}
              style={{
                '--hover-border-color': emphasisColor || '#0ea5e9'
              }}
            >
              {currentGroupBy === 'date' ? 'Por Dia' : currentGroupBy === 'week' ? 'Por Semana' : 'Agrupar por...'}
              <ChevronDown size={12} className={styles.dropdownIcon} />
            </button>
            {showGroupByDropdown && (
              <div className={styles.groupByDropdown}>
                <label className={styles.dropdownItem}>
                  <input
                    type="radio"
                    name="groupBy"
                    checked={currentGroupBy === 'date'}
                    onChange={() => handleGroupBySelect('date')}
                    className={styles.radio}
                    style={{
                      accentColor: emphasisColor || '#0ea5e9'
                    }}
                  />
                  Por Dia
                </label>
                <label className={styles.dropdownItem}>
                  <input
                    type="radio"
                    name="groupBy"
                    checked={currentGroupBy === 'week'}
                    onChange={() => handleGroupBySelect('week')}
                    className={styles.radio}
                    style={{
                      accentColor: emphasisColor || '#0ea5e9'
                    }}
                  />
                  Por Semana
                </label>
              </div>
            )}
          </div>
          {currentGroupBy && (
            <>
              <button
                className={styles.expandButton}
                onClick={expandAll}
                style={{
                  '--hover-border-color': emphasisColor || '#0ea5e9'
                }}
              >
                Expandir Todos
              </button>
              <button
                className={styles.expandButton}
                onClick={collapseAll}
                style={{
                  '--hover-border-color': emphasisColor || '#0ea5e9'
                }}
              >
                Recolher Todos
              </button>
            </>
          )}
        </div>

        <button
          className={styles.filterButton}
          onClick={() => setShowColumnFilter(!showColumnFilter)}
          style={{
            '--hover-border-color': emphasisColor || '#0ea5e9'
          }}
        >
          <Filter size={16} />
          Colunas
        </button>

        {showColumnFilter && (
          <div className={styles.columnFilterDropdown}>
            {columns
              .filter((column) => column.key !== 'actions')
              .map((column) => (
                <label key={column.key} className={styles.columnFilterItem}>
                  <input
                    type="checkbox"
                    checked={visibleColumns.includes(column.key)}
                    onChange={() => toggleColumnVisibility(column.key)}
                    className={styles.checkbox}
                    style={{
                      accentColor: emphasisColor || '#0ea5e9'
                    }}
                  />
                  {column.label}
                </label>
              ))}
          </div>
        )}
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeaderRow}>
              {selectable && (
                <th className={styles.tableHeaderCell}>
                  <input
                    type="checkbox"
                    checked={
                      selectedRows.size === data.length && data.length > 0
                    }
                    onChange={handleSelectAll}
                    className={styles.checkbox}
                    style={{
                      accentColor: emphasisColor || '#0ea5e9'
                    }}
                  />
                </th>
              )}
              {orderedColumns.map((column) => {
                const isSortable = column.sortable !== false;
                return (
                  <th
                    key={column.key}
                    className={styles.tableHeaderCell}
                    draggable={reorderable}
                    onDragStart={(e) =>
                      reorderable && handleDragStart(e, column.key)
                    }
                    onDragOver={reorderable ? handleDragOver : undefined}
                    onDrop={
                      reorderable ? (e) => handleDrop(e, column.key) : undefined
                    }
                  >
                    <div className={styles.headerCellContent}>
                      {reorderable && (
                        <GripVertical size={14} className={styles.dragHandle} />
                      )}
                      {!isSortable ? (
                        <div className={styles.unsortableHeader}>
                          {column.label}
                        </div>
                      ) : (
                        <div
                          className={`${styles.sortableHeader} ${
                            sortConfig?.key === column.key
                              ? styles.sortedHeader
                              : ''
                          }`}
                        >
                          {column.label}
                          <div className={styles.sortIcons}>
                            <ChevronUp
                              size={12}
                              className={`${styles.sortIcon} ${
                                sortConfig?.key === column.key &&
                                sortConfig?.direction === 'asc'
                                  ? styles.active
                                  : ''
                              }`}
                              style={
                                sortConfig?.key === column.key &&
                                sortConfig?.direction === 'asc'
                                  ? {
                                      color: emphasisColor || '#ec1109'
                                    }
                                  : {}
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSortAsc(column.key);
                              }}
                            />
                            <ChevronDown
                              size={12}
                              className={`${styles.sortIcon} ${
                                sortConfig?.key === column.key &&
                                sortConfig?.direction === 'desc'
                                  ? styles.active
                                  : ''
                              }`}
                              style={
                                sortConfig?.key === column.key &&
                                sortConfig?.direction === 'desc'
                                  ? {
                                      color: emphasisColor || '#ec1109'
                                    }
                                  : {}
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSortDesc(column.key);
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>{renderGroupedRows()}</tbody>
        </table>
      </div>

      <TransactionModal
        isOpen={showModal}
        onClose={closeModal}
        record={selectedRecord}
        onSave={handleModalSave}
        dados={dados}
      />
    </div>
  );
};

export default TableWithDate;