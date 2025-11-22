import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
  ScatterChart, Scatter, ZAxis
} from 'recharts';
import styles from './dashboardCategory.module.css';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];



const DashboardCategory = ({ data, loading, filters }) => {
  if (loading) {
    return <div className={styles.loading}>Carregando dashboard...</div>;
  }

  if (!data) {
    return <div className={styles.error}>Nenhum dado encontrado.</div>;
  }

  const { summary, pieChartData, barChartData, timeSeriesData, scatterData } = data;

  return (
    <div className={styles.container}>
     {/* Resumo Geral */}
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <h3>Total de Transações</h3>
          <p>{summary.totalTransactions}</p>
        </div>
        <div className={styles.summaryCard}>
          <h3>Valor Total</h3>
          <p>R$ {summary.totalAmount.toFixed(2)}</p>
        </div>
        <div className={styles.summaryCard}>
          <h3>Média por Transação</h3>
          <p>R$ {summary.averageTransactionAmount.toFixed(2)}</p>
        </div>
        <div className={styles.summaryCard}>
          <h3>Categorias Ativas</h3>
          <p>{summary.totalCategories}</p>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        {/* Gráfico de Pizza */}
        <div className={styles.chartCard}>
          <h3>Distribuição por Categoria</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Barras */}
        <div className={styles.chartCard}>
          <h3>Transações por Categoria</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#3b82f6" name="Valor Total (R$)" />
              <Bar dataKey="transactions" fill="#10b981" name="Nº de Transações" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Série Temporal */}
        <div className={styles.chartCard}>
          <h3>Evolução Temporal ({filters.groupBy})</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="periodLabel" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
              <Legend />
              <Line type="monotone" dataKey="totalAmount" stroke="#3b82f6" name="Valor Total" strokeWidth={2} />
              <Line type="monotone" dataKey="totalTransactions" stroke="#10b981" name="Transações" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Dispersão */}
        <div className={styles.chartCard}>
          <h3>Relação: Registros × Valor Médio</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid />
              <XAxis type="number" dataKey="recordsCount" name="Nº de Registros" />
              <YAxis type="number" dataKey="averageAmount" name="Média por Transação (R$)" />
              <ZAxis type="number" dataKey="totalAmount" range={[100, 1000]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Categorias" data={scatterData} fill="#8b5cf6">
                {scatterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardCategory;