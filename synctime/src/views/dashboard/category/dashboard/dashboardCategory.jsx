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

const COLORS = [
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#06b6d4'
];

const DashboardCategory = ({ data, loading, filters }) => {
  const { theme } = useTheme();
  if (loading)
    return <div className={`${styles.loading} ${styles[theme]}`}>Carregando dashboard...</div>;
  if (!data)
    return <div className={`${styles.loading} ${styles[theme]}`}>Nenhum dado disponível</div>;

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
                {entry.dataKey.includes('Amount') ||
                entry.name.includes('Valor')
                  ? formatCurrency(entry.value)
                  : entry.name.includes('Transaç') || entry.name.includes('Nº') || entry.name.includes('Count')
                  ? formatNumber(entry.value)
                  : entry.name.includes('percentage')
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
    <div className={`${styles.container} ${styles[theme]}`}>
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

      {/* Seção: Categoria */}
      <div className={`${styles.section} ${styles[theme]}`}>
        <h2>Insights de Categorias</h2>
        <div className={styles.chartsGrid}>
          <div className={`${styles.chartCard} ${styles[theme]}`}>
            <h3>Distribuição de Categorias por Record Type</h3>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={Object.entries(
                    summary.categoryBreakdown.reduce((acc, cat) => {
                      if (!acc[cat.recordTypeName]) {
                        acc[cat.recordTypeName] = {
                          name: cat.recordTypeName,
                          value: 0,
                          transactions: 0,
                          activeCategories: 0,
                          categories: []
                        };
                      }
                      acc[cat.recordTypeName].value += 1;
                      acc[cat.recordTypeName].transactions +=
                        cat.totalTransactions;
                      if (cat.totalTransactions > 0)
                        acc[cat.recordTypeName].activeCategories += 1;
                      acc[cat.recordTypeName].categories.push(cat.categoryName);
                      return acc;
                    }, {})
                  ).map(([name, data]) => ({
                    name,
                    value: data.value,
                    transactions: data.transactions,
                    activeCategories: data.activeCategories,
                    categories: data.categories
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
                    summary.categoryBreakdown.reduce((acc, cat) => {
                      acc[cat.recordTypeName] = true;
                      return acc;
                    }, {})
                  ).map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload[0]) {
                      const data = payload[0].payload;
                      return (
                        <div className={`${styles.tooltip} ${styles[theme]}`}>
                          <p className="font-bold text-lg mb-2">{data.name}</p>
                          <ul className="list-disc pl-4 text-sm text-gray-600 dark:text-gray-300">
                            {data.categories.map((catName, i) => (
                              <li key={i}>{catName}</li>
                            ))}
                          </ul>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Legend
                  verticalAlign="bottom"
                  height={50}
                  formatter={(value) => {
                    return `${value}`;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Novo: Transaction Count Pie Chart */}
          <div className={`${styles.chartCard} ${styles[theme]}`}>
            <h3>Distribuição de Contagem de Transações por Categoria</h3>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={transactionCountPieChart.filter(d => d.count > 0)}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={85}
                  outerRadius={130}
                  paddingAngle={3}
                  cornerRadius={12}
                >
                  {transactionCountPieChart.filter(d => d.count > 0).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload[0]) {
                      const data = payload[0].payload;
                      return (
                        <div className={`${styles.tooltip} ${styles[theme]}`}>
                          <p className="font-bold text-lg mb-2">{data.name}</p>
                          <p>Contagem: {formatNumber(data.count)}</p>
                          <p>Porcentagem: {formatPercentage(data.percentage)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend verticalAlign="bottom" height={50} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Novo: Category Type Bar Chart */}
          <div className={`${styles.chartCard} ${styles[theme]}`}>
            <h3>Contagem por Tipo de Categoria</h3>
            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={categoryTypeBarChart}>
                <CartesianGrid strokeDasharray="4 4" strokeOpacity={0.3} />
                <XAxis dataKey="type" angle={-15} textAnchor="end" height={90} />
                <YAxis tickFormatter={formatNumber} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="transactionCount" fill="#10b981" name="Contagem de Transações" radius={[8, 8, 0, 0]} />
                <Bar dataKey="categoryCount" fill="#3b82f6" name="Contagem de Categorias" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Seção: Custom Fields */}
      <div className={`${styles.section} ${styles[theme]}`}>
        <h2>Insights de Campos Customizados</h2>
        <div className={styles.chartsGrid}>
          {customFieldValueCounts.map((field, index) => (
            <div key={index} className={`${styles.chartCard} ${styles[theme]}`}>
              <h3>Contagem de Valores: {field.label}</h3>
              <ResponsiveContainer width="100%" height={360}>
                <BarChart data={field.data.filter(d => d.count > 0)}>
                  <CartesianGrid strokeDasharray="4 4" strokeOpacity={0.3} />
                  <XAxis dataKey="name" angle={-15} textAnchor="end" height={90} />
                  <YAxis tickFormatter={formatNumber} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="count" fill="#8b5cf6" name="Contagem" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      </div>

      {/* Seção: Transações */}
      <div className={`${styles.section} ${styles[theme]}`}>
        <h2>Insights de Transações</h2>
        <div className={styles.chartsGrid}>
          <div className={`${styles.chartCard} ${styles[theme]}`}>
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

          <div className={`${styles.chartCard} ${styles[theme]}`}>
            <h3>Distribuição de Status</h3>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={statusDistribution.filter(d => d.count > 0)}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={85}
                  outerRadius={130}
                  paddingAngle={3}
                  cornerRadius={12}
                >
                  {statusDistribution.filter(d => d.count > 0).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload[0]) {
                      const data = payload[0].payload;
                      return (
                        <div className={`${styles.tooltip} ${styles[theme]}`}>
                          <p className="font-bold text-lg mb-2">{data.name}</p>
                          <p>Contagem: {formatNumber(data.count)}</p>
                          <p>Porcentagem: {formatPercentage(data.percentage)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend verticalAlign="bottom" height={50} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className={`${styles.chartCard} ${styles[theme]}`}>
            <h3>Histograma de Datas de Transações</h3>
            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={transactionDateHistogram}>
                <CartesianGrid strokeDasharray="4 4" strokeOpacity={0.3} />
                <XAxis dataKey="periodLabel" angle={-15} textAnchor="end" height={90} />
                <YAxis tickFormatter={formatNumber} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="totalTransactions" fill="#ec4899" name="Nº de Transações" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Novo: Transaction Histogram (Bar for bins) */}
          <div className={`${styles.chartCard} ${styles[theme]}`}>
            <h3>Histograma de Valores de Transações</h3>
            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={transactionHistogram.filter(d => d.count > 0)}>
                <CartesianGrid strokeDasharray="4 4" strokeOpacity={0.3} />
                <XAxis dataKey="bin" angle={-15} textAnchor="end" height={90} />
                <YAxis tickFormatter={formatNumber} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="count" fill="#f59e0b" name="Contagem" radius={[8, 8, 0, 0]} />
                <Bar dataKey="totalAmount" fill="#ef4444" name="Valor Total" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>         
        </div>
      </div>

      {/* Seção: Evolução e Relações */}
      <div className={`${styles.section} ${styles[theme]}`}>
        <h2>Evolução e Relações</h2>
        <div className={styles.chartsGrid}>
          <div className={`${styles.chartCard} ${styles[theme]}`}>
            <h3>Evolução Temporal ({filters.groupBy || 'mês'})</h3>
            <ResponsiveContainer width="100%" height={360}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="5 5" strokeOpacity={0.3} />
                <XAxis dataKey="periodLabel" />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip content={<CustomTooltip />} />
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
                  name="Nº de Transações"
                />
                <defs>
                  <linearGradient id="gradientAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Dispersão Existente */}
          <div className={`${styles.chartCard} ${styles[theme]}`}>
            <h3>Relação: Nº de Registros × Valor Médio</h3>
            <ResponsiveContainer width="100%" height={360}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="recordsCount" name="Registros" />
                <YAxis
                  type="number"
                  dataKey="averageAmount"
                  name="Média (R$)"
                  tickFormatter={formatCurrency}
                />
                <ZAxis type="number" dataKey="totalAmount" range={[300, 1600]} />
                <Tooltip content={<CustomTooltip />} />
                <Scatter
                  name="Categorias"
                  data={scatterData.filter((d) => d.totalAmount > 0)}
                  fill="#8b5cf6"
                >
                  {scatterData
                    .filter((d) => d.totalAmount > 0)
                    .map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Seção: Progresso de Metas */}
      <div className={`${styles.section} ${styles[theme]}`}>
        <h2>Progresso de Metas</h2>
        <div className={styles.chartsGrid}>
          <div className={`${styles.chartCard} ${styles[theme]}`}>
            <h3>Progresso por Registro</h3>
            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={goalProgressData} layout="vertical">
                <CartesianGrid strokeDasharray="4 4" strokeOpacity={0.3} />
                <XAxis type="number" tickFormatter={formatCurrency} />
                <YAxis dataKey="title" type="category" width={150} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="initialBalance" fill="#06b6d4" name="Saldo Inicial" radius={[8, 0, 0, 8]} stackId="a" />
                <Bar dataKey="currentTotal" fill="#10b981" name="Total Atual" radius={[0, 8, 8, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCategory;