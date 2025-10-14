import { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, CloudSnow, Wind, Droplets, Calendar, Filter, BarChart3, CheckCircle2 } from 'lucide-react';
import styles from './Home.module.css';

const Home = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todos');
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'OUT000-Integração FlexiA Externa', category: 'Protocolos', time: '2h atrás', type: 'update' },
    { id: 2, title: 'SET000-Problema ao realizar download', category: 'Protocolos', time: '3h atrás', type: 'issue' },
    { id: 3, title: 'Nova anotação criada', category: 'Anotações', time: '5h atrás', type: 'note' },
    { id: 4, title: 'AGO000-Organização do projeto', category: 'Protocolos', time: '1 dia atrás', type: 'update' },
    { id: 5, title: 'Lembrete importante', category: 'Anotações', time: '2 dias atrás', type: 'note' }
  ]);
  

  // Dados do gráfico de presença (últimos 7 dias)
  const [presenceData] = useState([
    { day: 'Seg', present: true, sessions: 3 },
    { day: 'Ter', present: true, sessions: 5 },
    { day: 'Qua', present: true, sessions: 4 },
    { day: 'Qui', present: false, sessions: 0 },
    { day: 'Sex', present: true, sessions: 6 },
    { day: 'Sáb', present: true, sessions: 2 },
    { day: 'Dom', present: false, sessions: 0 }
  ]);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      // Usando OpenWeatherMap API - Fortaleza, CE
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Fortaleza,BR&units=metric&lang=pt_br&appid=4f4b4e8c8f9c8e0b3c5c5f0c5c5c5c5c`
      );
      
      // Simulando dados caso a API não responda (substitua a chave API acima por uma válida)
      if (!response.ok) {
        setWeather({
          temp: 28,
          condition: 'Ensolarado',
          icon: 'sun',
          humidity: 75,
          wind: 18,
          city: 'Fortaleza'
        });
      } else {
        const data = await response.json();
        setWeather({
          temp: Math.round(data.main.temp),
          condition: data.weather[0].description,
          icon: getWeatherIcon(data.weather[0].main),
          humidity: data.main.humidity,
          wind: Math.round(data.wind.speed * 3.6),
          city: data.name
        });
      }
    } catch (error) {
      setWeather({
        temp: 28,
        condition: 'Ensolarado',
        icon: 'sun',
        humidity: 75,
        wind: 18,
        city: 'Fortaleza'
      });
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition) => {
    const icons = {
      'Clear': 'sun',
      'Clouds': 'cloud',
      'Rain': 'rain',
      'Snow': 'snow',
      'Wind': 'wind'
    };
    return icons[condition] || 'cloud';
  };

  const WeatherIcon = ({ icon }) => {
    const icons = {
      sun: Sun,
      cloud: Cloud,
      rain: CloudRain,
      snow: CloudSnow,
      wind: Wind
    };
    const Icon = icons[icon] || Cloud;
    return <Icon className="w-16 h-16 text-yellow-400" />;
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'todos') return true;
    if (filter === 'categorias') return notif.category === 'Protocolos';
    if (filter === 'anotacoes') return notif.category === 'Anotações';
    return true;
  });

  const getTypeColor = (type) => {
    const colors = {
      update: 'bg-blue-100 text-blue-700',
      issue: 'bg-red-100 text-red-700',
      note: 'bg-green-100 text-green-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Bom dia, Bergkley</h1>
        
        <div className={styles.grid}>
          {/* Clima e Tempo */}
          <div className={styles.weatherCard}>
            <h2 className={styles.cardTitle}>
              <Cloud className={styles.icon} />
              Clima e Tempo
            </h2>
            
            {loading ? (
              <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
              </div>
            ) : (
              <div className={styles.weatherContent}>
                <div className={styles.weatherMain}>
                  <div>
                    <p className={styles.cityName}>{weather.city}</p>
                    <p className={styles.temperature}>{weather.temp}°C</p>
                    <p className={styles.condition}>{weather.condition}</p>
                  </div>
                  <WeatherIcon icon={weather.icon} />
                </div>
                
                <div className={styles.weatherDetails}>
                  <div className={styles.detailItem}>
                    <Droplets className={styles.detailIcon} />
                    <div>
                      <p className={styles.detailLabel}>Umidade</p>
                      <p className={styles.detailValue}>{weather.humidity}%</p>
                    </div>
                  </div>
                  <div className={styles.detailItem}>
                    <Wind className={styles.detailIcon} />
                    <div>
                      <p className={styles.detailLabel}>Vento</p>
                      <p className={styles.detailValue}>{weather.wind} km/h</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Caixa de Entrada */}
          <div className={styles.inboxCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                <Calendar className={styles.iconPurple} />
                Caixa de Entrada
              </h2>
              <div className={styles.filterContainer}>
                <Filter className={styles.filterIcon} />
                <select 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="todos">Todos</option>
                  <option value="categorias">Categorias</option>
                  <option value="anotacoes">Anotações</option>
                </select>
              </div>
            </div>
            
            <div className={styles.notificationsList}>
              {filteredNotifications.map(notif => (
                <div key={notif.id} className={styles.notificationItem}>
                  <div className={styles.notificationContent}>
                    <div className={styles.notificationMain}>
                      <h3 className={styles.notificationTitle}>{notif.title}</h3>
                      <div className={styles.notificationMeta}>
                        <span className={`${styles.badge} ${styles[notif.type]}`}>
                          {notif.category}
                        </span>
                        <span className={styles.time}>{notif.time}</span>
                      </div>
                    </div>
                    <div className={styles.notificationDot}></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className={styles.cardFooter}>
              <button className={styles.viewAllButton}>
                Ver todas as atualizações →
              </button>
            </div>
          </div>

          {/* Gráfico de Presença */}
          <div className={styles.presenceCard}>
            <h2 className={styles.cardTitle}>
              <BarChart3 className={styles.iconGreen} />
              Gráfico de Presença
            </h2>
            
            <div className={styles.presenceContent}>
              <div className={styles.statsGrid}>
                <div className={styles.statBox}>
                  <p className={styles.statLabel}>Dias Presentes</p>
                  <p className={styles.statValueGreen}>
                    {presenceData.filter(d => d.present).length}
                  </p>
                </div>
                <div className={styles.statBoxBlue}>
                  <p className={styles.statLabel}>Total Sessões</p>
                  <p className={styles.statValueBlue}>
                    {presenceData.reduce((acc, d) => acc + d.sessions, 0)}
                  </p>
                </div>
              </div>
              
              <div className={styles.presenceList}>
                {presenceData.map((day, index) => (
                  <div key={index} className={styles.presenceRow}>
                    <span className={styles.dayLabel}>{day.day}</span>
                    <div className={styles.progressBar}>
                      {day.present && (
                        <div 
                          className={styles.progressFill}
                          style={{ width: `${(day.sessions / 6) * 100}%` }}
                        >
                          <span className={styles.sessionCount}>{day.sessions}</span>
                        </div>
                      )}
                    </div>
                    {day.present ? (
                      <CheckCircle2 className={styles.checkIcon} />
                    ) : (
                      <div className={styles.emptyCheck}></div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className={styles.presenceFooter}>
                <p className={styles.presenceRate}>
                  Taxa de presença: <span className={styles.rateValue}>71%</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;