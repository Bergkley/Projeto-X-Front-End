import  { useState, useEffect } from 'react';
import DashboardCategory from './dashboard/dashboardCategory'; 
import ServiceDashboard from '../services/ServiceDashboard';
import ServiceCategory from '../../sectionConfigSystem/Sections/Report/Category/services/ServiceCategory';
import TableHeaderWithFilterDashboard from '../../../components/header/TableHeaderWithFilter/TableHeaderWithFilterDashboard';

const DashboardCategoryManager = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await ServiceCategory.getByAllCategory();
        setCategories(response.data.data || []);
      } catch (err) {
        console.error("Erro ao carregar categorias", err);
      }
    };
    loadCategories();
  }, []);

  const loadDashboard = async (appliedFilters) => {
    setLoading(true);
    try {
      const params = {
        startDate: filters.startDate,
        endDate: filters.endDate,
        groupBy: filters.groupBy,
        categoryId: filters.categoryId,
      };


      Object.assign(params, appliedFilters);

      const response = await ServiceDashboard.getDashboardCategory(1, '', '',  params.categoryId, params.groupBy, params.startDate, params.endDate);
      
      if (response.data.status === 'OK') {
        setDashboardData(response.data.data);
      }
    } catch (err) {
      console.error("Erro ao carregar dashboard", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleFiltersChange = (appliedFilters) => {
    const newFilters = { ...filters };

    appliedFilters.forEach(f => {
      if (f.column === 'categoryId' && f.value) newFilters.categoryId = f.value;
      if (f.column === 'startDate') newFilters.startDate = f.value;
      if (f.column === 'endDate') newFilters.endDate = f.value;
      if (f.column === 'groupBy') newFilters.groupBy = f.value;
    });

    if (!appliedFilters.some(f => f.column === 'categoryId')) {
      newFilters.categoryId = '';
    }

    setFilters(newFilters);
    loadDashboard(newFilters);
  };

  const filterColumns = [
  {
    id: 'categoryId',
    label: 'Categoria',
    type: 'selectSimple', 
    options: [
      { value: '', label: 'Todas' },
      ...categories.map(category => ({ value: category.id, label: category.name }))
    ],
  },
  { id: 'startDate', label: 'Data Inicial', type: 'date' },
  { id: 'endDate', label: 'Data Final', type: 'date' },
  {
    id: 'groupBy',
    label: 'Agrupar por',
    type: 'selectSimple',
    options: [
      { value: 'day', label: 'Dia' },
      { value: 'week', label: 'Semana' },
      { value: 'month', label: 'Mês' },
      { value: 'year', label: 'Ano' },
    ],
  },
];

  return (
    <div>
      <TableHeaderWithFilterDashboard
        title="Dashboard de Categorias"
        columns={filterColumns}
        onFiltersChange={handleFiltersChange}
        isExportacao={true}
        onExport={(format) => alert(`Exportar como ${format.toUpperCase()} (em breve!)`)}
      />

      <DashboardCategory
        data={dashboardData}
        loading={loading}
        filters={filters}
      />
    </div>
  );
};

export default DashboardCategoryManager;