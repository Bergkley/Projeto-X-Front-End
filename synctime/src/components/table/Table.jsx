// ⚙️ React e bibliotecas externas
import { useState, useMemo } from 'react';
import { Filter, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';

// 💅 Estilos
import styles from './Table.module.css';

// 🧠 Hooks customizados
import { useTheme } from '../../hooks/useTheme';
import { useEmphasisColor } from '../../hooks/useEmphasisColor';


const Table = ({ 
  columns, 
  data, 
  selectable = false,
  reorderable = false,
  onSelectionChange,
  onEdit,
  onToggleStatus
}) => {
  const { theme } = useTheme();
  const { emphasisColor } = useEmphasisColor();
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [visibleColumns, setVisibleColumns] = useState(
    columns.map(col => col.key)
  );
  const [columnOrder, setColumnOrder] = useState(columns.map(col => col.key));
  const [showColumnFilter, setShowColumnFilter] = useState(false);
  const [draggedColumn, setDraggedColumn] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

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
    setVisibleColumns(prev =>
      prev.includes(columnKey)
        ? prev.filter(k => k !== columnKey)
        : [...prev, columnKey]
    );
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      if (aVal == null) aVal = '';
      if (bVal == null) bVal = '';
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
    setDraggedColumn(null);
  };

  const orderedColumns = columnOrder
    .map(key => columns.find(col => col.key === key))
    .filter(col => col && visibleColumns.includes(col.key));

  return (
    <div className={`${styles.tableContainer} ${styles[theme]}`}>
      <div className={styles.tableToolbar}>
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
            {columns.map(column => (
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
                    checked={selectedRows.size === data.length && data.length > 0}
                    onChange={handleSelectAll}
                    className={styles.checkbox}
                    style={{
                      accentColor: emphasisColor || '#0ea5e9'
                    }}
                  />
                </th>
              )}
              {orderedColumns.map(column => (
                <th
                  key={column.key}
                  className={styles.tableHeaderCell}
                  draggable={reorderable}
                  onDragStart={(e) => handleDragStart(e, column.key)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, column.key)}
                >
                  <div className={styles.headerCellContent}>
                    {reorderable && <GripVertical size={14} className={styles.dragHandle} />}
                    <div 
                      className={`${styles.sortableHeader} ${sortConfig.key === column.key ? styles.sortedHeader : ''}`} 
                      onClick={() => handleSort(column.key)}
                    >
                      {column.label}
                      <div className={styles.sortIcons}>
                        <ChevronUp 
                          size={12} 
                          className={`${styles.sortIcon} ${sortConfig.key === column.key && sortConfig.direction === 'asc' ? styles.active : ''}`}
                          style={sortConfig.key === column.key && sortConfig.direction === 'asc' ? {
                            color: emphasisColor || '#ec1109'
                          } : {}}
                        />
                        <ChevronDown 
                          size={12} 
                          className={`${styles.sortIcon} ${sortConfig.key === column.key && sortConfig.direction === 'desc' ? styles.active : ''}`}
                          style={sortConfig.key === column.key && sortConfig.direction === 'desc' ? {
                            color: emphasisColor || '#ec1109'
                          } : {}}
                        />
                      </div>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, rowIdx) => (
              <tr key={rowIdx} className={styles.tableRow}>
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
                {orderedColumns.map(column => (
                  <td key={column.key} className={styles.tableCell}>
                    {column.render ? column.render(row, rowIdx, { onEdit, onToggleStatus }) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;