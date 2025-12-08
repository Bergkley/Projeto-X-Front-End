import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  ZAxis,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import styles from './dashboardCategory.module.css';
import { useTheme } from './../../../../hooks/useTheme';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import CustomChartModal from './modal/customChartModal';

const COLORS = [
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#06b6d4'
];

const DashboardCategory = forwardRef(
  ({ data, loading, filters, chartRefs, onChartsRendered, setChartsReady }, ref) => {
    const { theme } = useTheme();

    const registeredCharts = useRef(0);
    const totalExpectedCharts = useRef(0);
    const hasCalledReady = useRef(false);

    const [showModal, setShowModal] = useState(false);
    const [currentSection, setCurrentSection] = useState('');
    const [customCharts, setCustomCharts] = useState({});

    useEffect(() => {
      chartRefs.current = [];
      registeredCharts.current = 0;
      totalExpectedCharts.current = 0;
      hasCalledReady.current = false;
    }, [data, chartRefs]);

    useEffect(() => {
      if (data) {
        let count = 3; // categorias
        count += (customCharts['categorias']?.length || 0);
        count += (data.customFieldValueCounts?.length || 0);
        count += (customCharts['camposCustomizados']?.length || 0);
        count += 4; // transacoes
        count += (customCharts['transacoes']?.length || 0);
        count += 2; // evolucao
        count += (customCharts['evolucao']?.length || 0);
        count += 1; // progresso
        count += (customCharts['progresso']?.length || 0);

        totalExpectedCharts.current = count;
        
        
        const fallbackTimer = setTimeout(() => {
          if (!hasCalledReady.current && onChartsRendered) {
            console.warn('⚠️ FALLBACK: Forçando onChartsRendered após timeout');
            hasCalledReady.current = true;
            onChartsRendered();
          }
        }, 5000);
        
        return () => clearTimeout(fallbackTimer);
      }
    }, [data, customCharts, onChartsRendered]);

    const addChartRef = (el) => {
      if (!el || chartRefs.current.includes(el)) {
        if (el) {
          console.log('⚠️ Elemento já registrado, ignorando duplicata');
        }
        return;
      }

      chartRefs.current.push(el);
      registeredCharts.current += 1;

      

      if (
        totalExpectedCharts.current > 0 &&
        registeredCharts.current >= totalExpectedCharts.current &&
        !hasCalledReady.current &&
        onChartsRendered
      ) {
        hasCalledReady.current = true;
        setTimeout(() => {
          onChartsRendered();
        }, 1500);
      }
    };

    const handleOpenModal = (section) => {
      setCurrentSection(section);
      setShowModal(true);
    };

    const handleCloseModal = () => {
      setShowModal(false);
    };

    const handleSubmit = (config) => {
      if (!config.dataSource || !config.xAxis || !config.yAxis || !config.title) {
        alert('Preencha todos os campos obrigatórios.');
        return;
      }
      setChartsReady(false);
      setCustomCharts((prev) => ({
        ...prev,
        [currentSection]: [
          ...(prev[currentSection] || []),
          { ...config, id: Date.now() },
        ],
      }));
      setShowModal(false);
      setTimeout(() => {
        setChartsReady(true);
      }, 1500);
    };

    const handleRemoveChart = (id, section) => {
      setChartsReady(false);
      setCustomCharts((prev) => ({
        ...prev,
        [section]: prev[section].filter((c) => c.id !== id),
      }));
      // Após a atualização de estado, limpar refs obsoletas
      setTimeout(() => {
        chartRefs.current = chartRefs.current.filter(node => node && document.body.contains(node));
        setChartsReady(true);
      }, 500);
    };

    const getDataOptions = (section) => {
      switch (section) {
        case 'categorias':
          return [
            { value: 'distributionRecordType', label: 'Distribuição de Categorias por Record Type', fields: ['name', 'value'] },
            { value: 'transactionCount', label: 'Distribuição de Contagem de Transações por Categoria', fields: ['name', 'count'] },
            { value: 'categoryType', label: 'Contagem por Tipo de Categoria', fields: ['type', 'transactionCount', 'categoryCount'] },
          ];
        case 'camposCustomizados':
          return data.customFieldValueCounts?.map((field) => ({
            value: field.label,
            label: `Contagem: ${field.label}`,
            fields: ['name', 'count'],
          })) || [];
        case 'transacoes':
          return [
            { value: 'transactionsByCategory', label: 'Transações por Categoria', fields: ['category', 'transactions'] },
            { value: 'statusDistribution', label: 'Distribuição de Status', fields: ['name', 'count', 'percentage'] },
            { value: 'dateHistogram', label: 'Histograma de Datas', fields: ['periodLabel', 'totalTransactions'] },
            { value: 'valueHistogram', label: 'Histograma de Valores', fields: ['bin', 'count', 'totalAmount'] },
          ];
        case 'evolucao':
          return [
            { value: 'timeEvolution', label: 'Evolução Temporal', fields: ['periodLabel', 'totalAmount', 'totalTransactions'] },
            { value: 'recordsVsAverage', label: 'Relação: Nº de Registros × Valor Médio', fields: ['recordsCount', 'averageAmount', 'totalAmount'] },
          ];
        case 'progresso':
          return [
            { value: 'progressByRecord', label: 'Progresso por Registro', fields: ['title', 'initialBalance', 'currentTotal'] },
          ];
        default:
          return [];
      }
    };

    const renderCustomChart = (section, chart) => {
      let chartData = [];
      let chartProps = {};

      if (section === 'categorias') {
        const { summary, transactionCountPieChart, categoryTypeBarChart } = data;

        if (chart.dataSource === 'distributionRecordType') {
          chartData = Object.entries(
            (summary?.categoryBreakdown || []).reduce((acc, cat) => {
              if (!cat) return acc;
              if (!acc[cat.recordTypeName])
                acc[cat.recordTypeName] = {
                  name: cat.recordTypeName,
                  value: 0,
                  categories: []
                };
              acc[cat.recordTypeName].value += 1;
              acc[cat.recordTypeName].categories.push(cat.categoryName);
              return acc;
            }, {})
          ).map(([name, d]) => ({
            name,
            value: d.value,
            categories: d.categories
          }));
          chartProps = {
            dataKey: 'value',
            nameKey: 'name',
            innerRadius: 85,
            outerRadius: 130,
            paddingAngle: 3,
            cornerRadius: 12,
          };
        } else if (chart.dataSource === 'transactionCount') {
          chartData = (transactionCountPieChart || []).filter((d) => d.count > 0);
          chartProps = {
            dataKey: 'count',
            nameKey: 'name',
            innerRadius: 85,
            outerRadius: 130,
            paddingAngle: 3,
            cornerRadius: 12,
          };
        } else if (chart.dataSource === 'categoryType') {
          chartData = categoryTypeBarChart || [];
          chartProps = {
            xDataKey: 'type',
            bars: [
              { dataKey: 'transactionCount', fill: '#10b981', name: 'Transações' },
              { dataKey: 'categoryCount', fill: '#3b82f6', name: 'Categorias' },
            ],
          };
        }
      } else if (section === 'camposCustomizados') {
        const field = (data?.customFieldValueCounts || []).find((f) => f.label === chart.dataSource);
        if (field) {
          chartData = (field.data || []).filter((d) => d.count > 0);
          chartProps = {
            xDataKey: 'name',
            bars: [
              { dataKey: 'count', fill: '#8b5cf6', name: 'Contagem' },
            ],
          };
        }
      } else if (section === 'transacoes') {
        if (chart.dataSource === 'transactionsByCategory') {
          chartData = (data?.barChartData || []).filter((d) => d.amount > 0 || d.transactions > 0);
          chartProps = {
            xDataKey: 'category',
            bars: [
              { dataKey: 'transactions', fill: '#10b981', name: 'Nº de Transações' },
            ],
          };
        } else if (chart.dataSource === 'statusDistribution') {
          chartData = (data?.statusDistribution || []).filter((d) => d.count > 0);
          chartProps = {
            dataKey: 'count',
            nameKey: 'name',
            innerRadius: 85,
            outerRadius: 130,
            paddingAngle: 3,
            cornerRadius: 12,
          };
        } else if (chart.dataSource === 'dateHistogram') {
          chartData = data?.transactionDateHistogram || [];
          chartProps = {
            xDataKey: 'periodLabel',
            bars: [
              { dataKey: 'totalTransactions', fill: '#ec4899', name: 'Transações' },
            ],
          };
        } else if (chart.dataSource === 'valueHistogram') {
          chartData = (data?.transactionHistogram || []).filter((d) => d.count > 0);
          chartProps = {
            xDataKey: 'bin',
            bars: [
              { dataKey: 'count', fill: '#f59e0b', name: 'Contagem' },
              { dataKey: 'totalAmount', fill: '#ef4444', name: 'Valor Total' },
            ],
          };
        }
      } else if (section === 'evolucao') {
        if (chart.dataSource === 'timeEvolution') {
          chartData = data?.timeSeriesData || [];
          chartProps = {
            xDataKey: 'periodLabel',
            lines: [
              { dataKey: 'totalAmount', stroke: '#3b82f6', name: 'Valor Total', area: true },
              { dataKey: 'totalTransactions', stroke: '#10b981', name: 'Transações' },
            ],
          };
        } else if (chart.dataSource === 'recordsVsAverage') {
          chartData = (data?.scatterData || []).filter((d) => d.totalAmount > 0);
          chartProps = {
            xDataKey: 'recordsCount',
            yDataKey: 'averageAmount',
            zDataKey: 'totalAmount',
            scatterName: 'Categorias',
            fill: '#8b5cf6',
          };
        }
      } else if (section === 'progresso') {
        if (chart.dataSource === 'progressByRecord') {
          chartData = data?.goalProgressData || [];
          chartProps = {
            layout: 'vertical',
            xType: 'number',
            yDataKey: 'title',
            bars: [
              { dataKey: 'initialBalance', fill: '#06b6d4', name: 'Saldo Inicial', stackId: 'a' },
              { dataKey: 'currentTotal', fill: '#10b981', name: 'Total Atual', stackId: 'a' },
            ],
          };
        }
      }

      const formatCurrency = (value) =>
        `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
      const formatNumber = (value) => Number(value).toLocaleString('pt-BR');

      const getYAxisFormatter = (dataKey) => {
        return dataKey.includes('amount') ? formatCurrency : formatNumber;
      };

      // Renderizar baseado no tipo
      if (chart.chartType === 'PieChart') {
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey={chart.yAxis}
                nameKey={chart.xAxis}
                cx="50%"
                cy="50%"
                innerRadius={chartProps.innerRadius}
                outerRadius={chartProps.outerRadius}
                paddingAngle={chartProps.paddingAngle}
                cornerRadius={chartProps.cornerRadius}
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        );
      } else if (chart.chartType === 'BarChart') {
        return (
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={chartData} layout={chartProps.layout || 'horizontal'}>
              <CartesianGrid strokeDasharray="4 4" strokeOpacity={0.3} />
              <XAxis
                type={chartProps.xType || 'category'}
                dataKey={chart.xAxis}
                angle={-15}
                textAnchor="end"
                height={90}
                tickFormatter={chartProps.xFormatter || formatNumber}
              />
              <YAxis
                type={chartProps.yType || 'number'}
                dataKey={chartProps.yDataKey}
                width={150}
                tickFormatter={getYAxisFormatter(chart.yAxis)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey={chart.yAxis}
                fill={COLORS[0]}
                name={chart.yAxis}
                radius={[8, 8, 0, 0]}
                stackId={chartProps.bars?.[0]?.stackId}
              />
              {chart.additionalMetrics.map((metric, i) => (
                <Bar
                  key={i}
                  dataKey={metric}
                  fill={COLORS[(i + 1) % COLORS.length]}
                  name={metric}
                  radius={[8, 8, 0, 0]}
                  stackId={chartProps.bars?.[i + 1]?.stackId}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      } else if (chart.chartType === 'LineChart') {
        return (
          <ResponsiveContainer width="100%" height={360}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="5 5" strokeOpacity={0.3} />
              <XAxis dataKey={chart.xAxis} />
              <YAxis tickFormatter={getYAxisFormatter(chart.yAxis)} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey={chart.yAxis}
                stroke={COLORS[0]}
                strokeWidth={3}
                dot={{ fill: COLORS[0], r: 6 }}
                name={chart.yAxis}
              />
              {chart.additionalMetrics.map((metric, i) => (
                <Line
                  key={i}
                  type="monotone"
                  dataKey={metric}
                  stroke={COLORS[(i + 1) % COLORS.length]}
                  strokeWidth={3}
                  dot={{ fill: COLORS[(i + 1) % COLORS.length], r: 6 }}
                  name={metric}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
      } else if (chart.chartType === 'AreaChart') {
        return (
          <ResponsiveContainer width="100%" height={360}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="5 5" strokeOpacity={0.3} />
              <XAxis dataKey={chart.xAxis} />
              <YAxis tickFormatter={getYAxisFormatter(chart.yAxis)} />
              <Tooltip content={<CustomTooltip />} />
              <defs>
                <linearGradient id="gradientPrimary" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS[0]} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={COLORS[0]} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey={chart.yAxis}
                stroke={COLORS[0]}
                fill="url(#gradientPrimary)"
                strokeWidth={3}
                name={chart.yAxis}
              />
              {chart.additionalMetrics.map((metric, i) => (
                <>
                  <defs>
                    <linearGradient id={`gradient${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS[(i + 1) % COLORS.length]} stopOpacity={0.9} />
                      <stop offset="100%" stopColor={COLORS[(i + 1) % COLORS.length]} stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <Area
                    key={i}
                    type="monotone"
                    dataKey={metric}
                    stroke={COLORS[(i + 1) % COLORS.length]}
                    fill={`url(#gradient${i})`}
                    strokeWidth={3}
                    name={metric}
                  />
                </>
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );
      } else if (chart.chartType === 'ScatterChart') {
        return (
          <ResponsiveContainer width="100%" height={360}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey={chart.xAxis}
                name={chart.xAxis}
              />
              <YAxis
                type="number"
                dataKey={chart.yAxis}
                name={chart.yAxis}
                tickFormatter={getYAxisFormatter(chart.yAxis)}
              />
              <ZAxis
                type="number"
                dataKey={chart.additionalMetrics[0] || chartProps.zDataKey}
                range={[300, 1600]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Scatter
                name={chartProps.scatterName || 'Dados'}
                data={chartData}
                fill={COLORS[0]}
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        );
      } else if (chart.chartType === 'RadarChart') {
        return (
          <ResponsiveContainer width="100%" height={360}>
            <RadarChart data={chartData}>
              <PolarGrid />
              <PolarAngleAxis dataKey={chart.xAxis} />
              <PolarRadiusAxis tickFormatter={getYAxisFormatter(chart.yAxis)} />
              <Radar
                dataKey={chart.yAxis}
                stroke={COLORS[0]}
                fill={COLORS[0]}
                fillOpacity={0.6}
                name={chart.yAxis}
              />
              {chart.additionalMetrics.map((metric, i) => (
                <Radar
                  key={i}
                  dataKey={metric}
                  stroke={COLORS[(i + 1) % COLORS.length]}
                  fill={COLORS[(i + 1) % COLORS.length]}
                  fillOpacity={0.6}
                  name={metric}
                />
              ))}
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        );
      }
      return <div>Gráfico não suportado ainda.</div>;
    };

    if (loading) {
      return (
        <div className={`${styles.loading} ${styles[theme]}`}>
          Carregando dashboard...
        </div>
      );
    }
    if (!data) {
      return (
        <div className={`${styles.loading} ${styles[theme]}`}>
          Nenhum dado disponível
        </div>
      );
    }

    const {
      summary,
      barChartData,
      timeSeriesData,
      scatterData,
      transactionCountPieChart,
      statusDistribution,
      categoryTypeBarChart,
      customFieldValueCounts,
      transactionDateHistogram,
      transactionHistogram,
      goalProgressData
    } = data;

    const barDataFiltered = (barChartData || []).filter(
      (d) => d.amount > 0 || d.transactions > 0
    );

    const formatCurrency = (value) =>
      `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
    const formatNumber = (value) => Number(value).toLocaleString('pt-BR');
    const formatPercentage = (value) => `${value.toFixed(1)}%`;

    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        return (
          <div className={`${styles.tooltip} ${styles[theme]}`}>
            <p className="font-bold text-gray-900 dark:text-white mb-2">
              {label}
            </p>
            {payload.map((entry, i) => (
              <p key={i} style={{ color: entry.color }} className="text-sm">
                {entry.name}:{' '}
                <strong>
                  {entry.dataKey?.includes('Amount') ||
                  entry.name?.includes('Valor')
                    ? formatCurrency(entry.value)
                    : entry.name?.includes('Transaç') ||
                      entry.name?.includes('Nº') ||
                      entry.name?.includes('Count')
                    ? formatNumber(entry.value)
                    : entry.name?.includes('percentage')
                    ? formatPercentage(entry.value)
                    : entry.value}
                </strong>
              </p>
            ))}
          </div>
        );
      }
      return null;
    };

    return (
      <div ref={ref} className={`${styles.container} ${styles[theme]}`}>
        <div className={styles.summaryGrid}>
          <div className={`${styles.summaryCard} ${styles[theme]}`}>
            <h3>Total de Transações</h3>
            <p>{formatNumber(summary.totalTransactions)}</p>
          </div>
          <div className={`${styles.summaryCard} ${styles[theme]}`}>
            <h3>Valor Total</h3>
            <p>{formatCurrency(summary.totalAmount)}</p>
          </div>
          <div className={`${styles.summaryCard} ${styles[theme]}`}>
            <h3>Média por Transação</h3>
            <p>{formatCurrency(summary.averageTransactionAmount)}</p>
          </div>
          <div className={`${styles.summaryCard} ${styles[theme]}`}>
            <h3>Categorias Ativas</h3>
            <p>{summary.totalCategories}</p>
          </div>
        </div>

        {/* === 1. Insights de Categorias === */}
        <div className={`${styles.section} ${styles[theme]}`}>
          <h2>
            Insights de Categorias
            <button
              onClick={() => handleOpenModal('categorias')}
              className={styles.customButton}
            >
              Customizar Gráfico
            </button>
          </h2>
          <div className={styles.chartsGrid}>
            <div
              className={`chart-card ${styles.chartCard} ${styles[theme]}`}
              ref={addChartRef}
            >
              <h3>Distribuição de Categorias por Record Type</h3>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={Object.entries(
                      (summary?.categoryBreakdown || []).reduce((acc, cat) => {
                        if (!cat) return acc;
                        if (!acc[cat.recordTypeName])
                          acc[cat.recordTypeName] = {
                            name: cat.recordTypeName,
                            value: 0,
                            categories: []
                          };
                        acc[cat.recordTypeName].value += 1;
                        acc[cat.recordTypeName].categories.push(
                          cat.categoryName
                        );
                        return acc;
                      }, {})
                    ).map(([name, d]) => ({
                      name,
                      value: d.value,
                      categories: d.categories
                    }))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={85}
                    outerRadius={130}
                    paddingAngle={3}
                    cornerRadius={12}
                  >
                    {Object.keys(
                      (summary?.categoryBreakdown || []).reduce((a, c) => {
                        if (!c) return a;
                        a[c.recordTypeName] = true;
                        return a;
                      }, {})
                    ).map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div
              className={`chart-card ${styles.chartCard} ${styles[theme]}`}
              ref={addChartRef}
            >
              <h3>Distribuição de Contagem de Transações por Categoria</h3>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={(transactionCountPieChart || []).filter((d) => d.count > 0)}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={85}
                    outerRadius={130}
                    paddingAngle={3}
                    cornerRadius={12}
                  >
                    {(transactionCountPieChart || [])
                      .filter((d) => d.count > 0)
                      .map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div
              className={`chart-card ${styles.chartCard} ${styles[theme]}`}
              ref={addChartRef}
            >
              <h3>Contagem por Tipo de Categoria</h3>
              <ResponsiveContainer width="100%" height={360}>
                <BarChart data={categoryTypeBarChart || []}>
                  <CartesianGrid strokeDasharray="4 4" strokeOpacity={0.3} />
                  <XAxis
                    dataKey="type"
                    angle={-15}
                    textAnchor="end"
                    height={90}
                  />
                  <YAxis tickFormatter={formatNumber} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="transactionCount"
                    fill="#10b981"
                    name="Transações"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="categoryCount"
                    fill="#3b82f6"
                    name="Categorias"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {customCharts['categorias']?.map((chart) => (
              <div
                key={chart.id}
                className={`chart-card ${styles.chartCard} ${styles[theme]}`}
                ref={addChartRef}
              >
                <div className={styles.customChartHeader}>
                  <h3>{chart.title}</h3>
                  <button
                    onClick={() => handleRemoveChart(chart.id, 'categorias')}
                    className={styles.removeButton}
                  >
                    <X size={16} />
                  </button>
                </div>
                {renderCustomChart('categorias', chart)}
              </div>
            ))}
          </div>
        </div>

        {/* === 2. Campos Customizados (N gráficos) === */}
        {customFieldValueCounts && customFieldValueCounts.length > 0 && (
          <div className={`${styles.section} ${styles[theme]}`}>
            <h2>
              Insights de Campos Customizados
              <button
                onClick={() => handleOpenModal('camposCustomizados')}
                className={styles.customButton}
              >
                Customizar Gráfico
              </button>
            </h2>
            <div className={styles.chartsGrid}>
              {(customFieldValueCounts || []).map((field, idx) => (
                <div
                  key={idx}
                  className={`chart-card ${styles.chartCard} ${styles[theme]}`}
                  ref={addChartRef}
                >
                  <h3>Contagem: {field.label}</h3>
                  <ResponsiveContainer width="100%" height={360}>
                    <BarChart data={(field.data || []).filter((d) => d.count > 0)}>
                      <CartesianGrid strokeDasharray="4 4" strokeOpacity={0.3} />
                      <XAxis
                        dataKey="name"
                        angle={-15}
                        textAnchor="end"
                        height={90}
                      />
                      <YAxis tickFormatter={formatNumber} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar
                        dataKey="count"
                        fill="#8b5cf6"
                        name="Contagem"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ))}
              {customCharts['camposCustomizados']?.map((chart) => (
                <div
                  key={chart.id}
                  className={`chart-card ${styles.chartCard} ${styles[theme]}`}
                  ref={addChartRef}
                >
                  <div className={styles.customChartHeader}>
                    <h3>{chart.title}</h3>
                    <button
                      onClick={() => handleRemoveChart(chart.id, 'camposCustomizados')}
                      className={styles.removeButton}
                    >
                      <X size={16} />
                    </button>
                  </div>
                  {renderCustomChart('camposCustomizados', chart)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === 3. Insights de Transações === */}
        <div className={`${styles.section} ${styles[theme]}`}>
          <h2>
            Insights de Transações
            <button
              onClick={() => handleOpenModal('transacoes')}
              className={styles.customButton}
            >
              Customizar Gráfico
            </button>
          </h2>
          <div className={styles.chartsGrid}>
            <div
              className={`chart-card ${styles.chartCard} ${styles[theme]}`}
              ref={addChartRef}
            >
              <h3>Transações por Categoria</h3>
              <ResponsiveContainer width="100%" height={360}>
                <BarChart data={barDataFiltered}>
                  <CartesianGrid strokeDasharray="4 4" strokeOpacity={0.3} />
                  <XAxis
                    dataKey="category"
                    angle={-15}
                    textAnchor="end"
                    height={90}
                  />
                  <YAxis tickFormatter={formatNumber} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="transactions"
                    fill="#10b981"
                    name="Nº de Transações"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div
              className={`chart-card ${styles.chartCard} ${styles[theme]}`}
              ref={addChartRef}
            >
              <h3>Distribuição de Status</h3>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={(statusDistribution || []).filter((d) => d.count > 0)}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={85}
                    outerRadius={130}
                    paddingAngle={3}
                    cornerRadius={12}
                  >
                    {(statusDistribution || [])
                      .filter((d) => d.count > 0)
                      .map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div
              className={`chart-card ${styles.chartCard} ${styles[theme]}`}
              ref={addChartRef}
            >
              <h3>Histograma de Datas</h3>
              <ResponsiveContainer width="100%" height={360}>
                <BarChart data={transactionDateHistogram || []}>
                  <CartesianGrid strokeDasharray="4 4" strokeOpacity={0.3} />
                  <XAxis
                    dataKey="periodLabel"
                    angle={-15}
                    textAnchor="end"
                    height={90}
                  />
                  <YAxis tickFormatter={formatNumber} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="totalTransactions"
                    fill="#ec4899"
                    name="Transações"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div
              className={`chart-card ${styles.chartCard} ${styles[theme]}`}
              ref={addChartRef}
            >
              <h3>Histograma de Valores</h3>
              <ResponsiveContainer width="100%" height={360}>
                <BarChart
                  data={(transactionHistogram || []).filter((d) => d.count > 0)}
                >
                  <CartesianGrid strokeDasharray="4 4" strokeOpacity={0.3} />
                  <XAxis
                    dataKey="bin"
                    angle={-15}
                    textAnchor="end"
                    height={90}
                  />
                  <YAxis tickFormatter={formatNumber} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="count"
                    fill="#f59e0b"
                    name="Contagem"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="totalAmount"
                    fill="#ef4444"
                    name="Valor Total"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {customCharts['transacoes']?.map((chart) => (
              <div
                key={chart.id}
                className={`chart-card ${styles.chartCard} ${styles[theme]}`}
                ref={addChartRef}
              >
                <div className={styles.customChartHeader}>
                  <h3>{chart.title}</h3>
                  <button
                    onClick={() => handleRemoveChart(chart.id, 'transacoes')}
                    className={styles.removeButton}
                  >
                    <X size={16} />
                  </button>
                </div>
                {renderCustomChart('transacoes', chart)}
              </div>
            ))}
          </div>
        </div>

        {/* === 4. Evolução e Relações (2 gráficos) === */}
        <div className={`${styles.section} ${styles[theme]}`}>
          <h2>
            Evolução e Relações
            <button
              onClick={() => handleOpenModal('evolucao')}
              className={styles.customButton}
            >
              Customizar Gráfico
            </button>
          </h2>
          <div className={styles.chartsGrid}>
            <div
              className={`chart-card ${styles.chartCard} ${styles[theme]}`}
              ref={addChartRef}
            >
              <h3>Evolução Temporal ({filters.groupBy || 'mês'})</h3>
              <ResponsiveContainer width="100%" height={360}>
                <LineChart data={timeSeriesData || []}>
                  <CartesianGrid strokeDasharray="5 5" strokeOpacity={0.3} />
                  <XAxis dataKey="periodLabel" />
                  <YAxis tickFormatter={formatCurrency} />
                  <Tooltip content={<CustomTooltip />} />
                  <defs>
                    <linearGradient
                      id="gradientAmount"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                      <stop
                        offset="100%"
                        stopColor="#3b82f6"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="totalAmount"
                    stroke="#3b82f6"
                    fill="url(#gradientAmount)"
                    strokeWidth={3}
                    name="Valor Total"
                  />
                  <Line
                    type="monotone"
                    dataKey="totalTransactions"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: '#10b981', r: 6 }}
                    name="Transações"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div
              className={`chart-card ${styles.chartCard} ${styles[theme]}`}
              ref={addChartRef}
            >
              <h3>Relação: Nº de Registros × Valor Médio</h3>
              <ResponsiveContainer width="100%" height={360}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    dataKey="recordsCount"
                    name="Registros"
                  />
                  <YAxis
                    type="number"
                    dataKey="averageAmount"
                    name="Média (R$)"
                    tickFormatter={formatCurrency}
                  />
                  <ZAxis
                    type="number"
                    dataKey="totalAmount"
                    range={[300, 1600]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Scatter
                    name="Categorias"
                    data={(scatterData || []).filter((d) => d.totalAmount > 0)}
                    fill="#8b5cf6"
                  >
                    {(scatterData || [])
                      .filter((d) => d.totalAmount > 0)
                      .map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            {customCharts['evolucao']?.map((chart) => (
              <div
                key={chart.id}
                className={`chart-card ${styles.chartCard} ${styles[theme]}`}
                ref={addChartRef}
              >
                <div className={styles.customChartHeader}>
                  <h3>{chart.title}</h3>
                  <button
                    onClick={() => handleRemoveChart(chart.id, 'evolucao')}
                    className={styles.removeButton}
                  >
                    <X size={16} />
                  </button>
                </div>
                {renderCustomChart('evolucao', chart)}
              </div>
            ))}
          </div>
        </div>

        {/* === 5. Progresso de Metas === */}
        <div className={`${styles.section} ${styles[theme]}`}>
          <h2>
            Progresso de Metas
            <button
              onClick={() => handleOpenModal('progresso')}
              className={styles.customButton}
            >
              Customizar Gráfico
            </button>
          </h2>
          <div className={styles.chartsGrid}>
            <div
              className={`chart-card ${styles.chartCard} ${styles[theme]}`}
              ref={addChartRef}
            >
              <h3>Progresso por Registro</h3>
              <ResponsiveContainer width="100%" height={360}>
                <BarChart data={goalProgressData || []} layout="vertical">
                  <CartesianGrid strokeDasharray="4 4" strokeOpacity={0.3} />
                  <XAxis type="number" tickFormatter={formatCurrency} />
                  <YAxis dataKey="title" type="category" width={150} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="initialBalance"
                    fill="#06b6d4"
                    name="Saldo Inicial"
                    stackId="a"
                    radius={[8, 0, 0, 8]}
                  />
                  <Bar
                    dataKey="currentTotal"
                    fill="#10b981"
                    name="Total Atual"
                    stackId="a"
                    radius={[0, 8, 8, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {customCharts['progresso']?.map((chart) => (
              <div
                key={chart.id}
                className={`chart-card ${styles.chartCard} ${styles[theme]}`}
                ref={addChartRef}
              >
                <div className={styles.customChartHeader}>
                  <h3>{chart.title}</h3>
                  <button
                    onClick={() => handleRemoveChart(chart.id, 'progresso')}
                    className={styles.removeButton}
                  >
                    <X size={16} />
                  </button>
                </div>
                {renderCustomChart('progresso', chart)}
              </div>
            ))}
          </div>
        </div>

        <CustomChartModal
          show={showModal}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          currentSection={currentSection}
          getDataOptions={getDataOptions}
        />
      </div>
    );
  }
);

DashboardCategory.displayName = 'DashboardCategory';
export default DashboardCategory;