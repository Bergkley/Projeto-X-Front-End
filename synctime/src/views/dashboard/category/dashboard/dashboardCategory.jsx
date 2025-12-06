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
  Area,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import styles from './dashboardCategory.module.css';
import { useTheme } from './../../../../hooks/useTheme';
import { forwardRef, useEffect, useRef } from 'react';

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
  ({ data, loading, filters, chartRefs, onChartsRendered }, ref) => {
    const { theme } = useTheme();

    const registeredCharts = useRef(0);
    const totalExpectedCharts = useRef(0);
    const hasCalledReady = useRef(false);

    useEffect(() => {
      chartRefs.current = [];
      registeredCharts.current = 0;
      totalExpectedCharts.current = 0;
      hasCalledReady.current = false;
    }, [data, chartRefs]);

    useEffect(() => {
      if (data) {
        let count = 0;
        count += 3; 
        count += (data.customFieldValueCounts?.length || 0); 
        count += 4; 
        count += 2; 
        count += 1; 

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
    }, [data, onChartsRendered]);

    const addChartRef = (el) => {
      if (!el || chartRefs.current.includes(el)) {
        if (el) {
          console.log('⚠️ Elemento já registrado, ignorando duplicata');
        }
        return;
      }

      chartRefs.current.push(el);
      registeredCharts.current += 1;

      console.log(
        `📈 Gráfico ${registeredCharts.current}/${totalExpectedCharts.current} registrado`
      );

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

    const barDataFiltered = barChartData.filter(
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
          <h2>Insights de Categorias</h2>
          <div className={styles.chartsGrid}>
            <div
              className={`${styles.chartCard} ${styles[theme]}`}
              ref={addChartRef}
            >
              <h3>Distribuição de Categorias por Record Type</h3>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={Object.entries(
                      summary.categoryBreakdown.reduce((acc, cat) => {
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
                      summary.categoryBreakdown.reduce((a, c) => {
                        a[c.recordTypeName] = true;
                        return a;
                      }, {})
                    ).map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div
              className={`${styles.chartCard} ${styles[theme]}`}
              ref={addChartRef}
            >
              <h3>Distribuição de Contagem de Transações por Categoria</h3>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={transactionCountPieChart.filter((d) => d.count > 0)}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={85}
                    outerRadius={130}
                    paddingAngle={3}
                    cornerRadius={12}
                  >
                    {transactionCountPieChart
                      .filter((d) => d.count > 0)
                      .map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div
              className={`${styles.chartCard} ${styles[theme]}`}
              ref={addChartRef}
            >
              <h3>Contagem por Tipo de Categoria</h3>
              <ResponsiveContainer width="100%" height={360}>
                <BarChart data={categoryTypeBarChart}>
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
          </div>
        </div>

        {/* === 2. Campos Customizados (N gráficos) === */}
        {customFieldValueCounts && customFieldValueCounts.length > 0 && (
          <div className={`${styles.section} ${styles[theme]}`}>
            <h2>Insights de Campos Customizados</h2>
            <div className={styles.chartsGrid}>
              {customFieldValueCounts.map((field, idx) => (
                <div
                  key={idx}
                  className={`${styles.chartCard} ${styles[theme]}`}
                  ref={addChartRef}
                >
                  <h3>Contagem: {field.label}</h3>
                  <ResponsiveContainer width="100%" height={360}>
                    <BarChart data={field.data.filter((d) => d.count > 0)}>
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
            </div>
          </div>
        )}

        <div className={`${styles.section} ${styles[theme]}`}>
          <h2>Insights de Transações</h2>
          <div className={styles.chartsGrid}>
            <div
              className={`${styles.chartCard} ${styles[theme]}`}
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
              className={`${styles.chartCard} ${styles[theme]}`}
              ref={addChartRef}
            >
              <h3>Distribuição de Status</h3>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={statusDistribution.filter((d) => d.count > 0)}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={85}
                    outerRadius={130}
                    paddingAngle={3}
                    cornerRadius={12}
                  >
                    {statusDistribution
                      .filter((d) => d.count > 0)
                      .map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div
              className={`${styles.chartCard} ${styles[theme]}`}
              ref={addChartRef}
            >
              <h3>Histograma de Datas</h3>
              <ResponsiveContainer width="100%" height={360}>
                <BarChart data={transactionDateHistogram}>
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
              className={`${styles.chartCard} ${styles[theme]}`}
              ref={addChartRef}
            >
              <h3>Histograma de Valores</h3>
              <ResponsiveContainer width="100%" height={360}>
                <BarChart
                  data={transactionHistogram.filter((d) => d.count > 0)}
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
          </div>
        </div>

        {/* === 4. Evolução e Relações (2 gráficos) === */}
        <div className={`${styles.section} ${styles[theme]}`}>
          <h2>Evolução e Relações</h2>
          <div className={styles.chartsGrid}>
            <div
              className={`${styles.chartCard} ${styles[theme]}`}
              ref={addChartRef}
            >
              <h3>Evolução Temporal ({filters.groupBy || 'mês'})</h3>
              <ResponsiveContainer width="100%" height={360}>
                <LineChart data={timeSeriesData}>
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
              className={`${styles.chartCard} ${styles[theme]}`}
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
                    data={scatterData.filter((d) => d.totalAmount > 0)}
                    fill="#8b5cf6"
                  >
                    {scatterData
                      .filter((d) => d.totalAmount > 0)
                      .map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className={`${styles.section} ${styles[theme]}`}>
          <h2>Progresso de Metas</h2>
          <div className={styles.chartsGrid}>
            <div
              className={`${styles.chartCard} ${styles[theme]}`}
              ref={addChartRef}
            >
              <h3>Progresso por Registro</h3>
              <ResponsiveContainer width="100%" height={360}>
                <BarChart data={goalProgressData} layout="vertical">
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
          </div>
        </div>
      </div>
    );
  }
);

DashboardCategory.displayName = 'DashboardCategory';
export default DashboardCategory;