import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Calendar.module.css';
import NoteList from './List/NoteList';
import { useTheme } from './../../../hooks/useTheme';
import { useEmphasisColor } from './../../../hooks/useEmphasisColor';
import CreateNote from './Modal/CreateNote';

const Calendar = () => {
  const { theme } = useTheme();
  const { emphasisColor } = useEmphasisColor();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [notes, setNotes] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showNoteList, setShowNoteList] = useState(false);
  const [noteType, setNoteType] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [holidays, setHolidays] = useState({}); 

  const API_KEY = import.meta.env.VITE_KEY_API_HOLIDAY || ''; 

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

  const sortNotes = (notesArray) => {
    const order = {
      'Manhã': 0,
      'Tarde': 1,
      'Noite': 2,
      'Resumo do Dia': 3
    };
    return [...notesArray].sort((a, b) => {
      const aOrder = order[a.title] ?? 99;
      const bOrder = order[b.title] ?? 99;
      return aOrder - bOrder;
    });
  };

  const getFallbackHolidays = (year) => {
    if (year !== 2025) return {};
    return {
      '2025-01-01': 'Confraternização Universal',
      '2025-03-03': 'Carnaval',
      '2025-03-04': 'Carnaval',
      '2025-04-18': 'Paixão de Cristo',
      '2025-04-21': 'Tiradentes',
      '2025-05-01': 'Dia do Trabalho',
      '2025-06-19': 'Corpus Christi',
      '2025-09-07': 'Independência do Brasil',
      '2025-10-12': 'Nossa Sra. Aparecida',
      '2025-11-02': 'Finados',
      '2025-11-15': 'Proclamação da República',
      '2025-11-20': 'Consciência Negra',
      '2025-12-25': 'Natal'
    };
  };

  useEffect(() => {
    const year = currentDate.getFullYear();
    if (holidays[year]) return; 

    const fetchHolidays = async () => {
      if (!API_KEY) {
        setHolidays(prev => ({ ...prev, [year]: getFallbackHolidays(year) }));
        return;
      }

      try {
        const res = await fetch(
          `https://holidays.abstractapi.com/v1/?api_key=${API_KEY}&country=BR&year=${year}`
        );
        if (!res.ok) throw new Error('API error');
        const data = await res.json();

        const yearHolidays = {};
        data.forEach(holiday => {
          if (holiday.type === 'National Holiday') {
            const [month, day, yr] = holiday.date.split('/');
            const dateKey = `${yr}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            yearHolidays[dateKey] = holiday.name;
          }
        });

        setHolidays(prev => ({ ...prev, [year]: yearHolidays }));
      } catch (error) {
        console.error('Erro ao buscar feriados:', error);
        setHolidays(prev => ({ ...prev, [year]: getFallbackHolidays(year) }));
      }
    };

    fetchHolidays();
  }, [currentDate.getFullYear(), API_KEY]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }

    return days;
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const previousYear = () => {
    setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth()));
  };

  const nextYear = () => {
    setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth()));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateClick = (day) => {
    if (day) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      setSelectedDate(date);
      setNoteType('');
      setSelectedPeriod('');
      setShowModal(true);
    }
  };

  const handleOpenNoteList = (day) => {
    if (day) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      setSelectedDate(date);
      setShowNoteList(true);
    }
  };

  const addNote = () => {
    if (selectedDate && noteType === 'periodo' && selectedPeriod) {
      const dateKey = formatDateKey(selectedDate);
      const existingPeriodNote = notes[dateKey]?.find(note => note.title === selectedPeriod);
      if (existingPeriodNote) return;

      const newNote = {
        id: Date.now(),
        title: selectedPeriod,
        content: '',
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      
      setNotes({
        ...notes,
        [dateKey]: [...(notes[dateKey] || []), newNote]
      });
      
      setSelectedPeriod('');
    }
  };

  const generateSummary = () => {
    if (selectedDate) {
      const dateKey = formatDateKey(selectedDate);
      const existingSummary = notes[dateKey]?.find(note => note.title === 'Resumo do Dia');
      if (existingSummary) return;

      const newSummary = {
        id: Date.now(),
        title: 'Resumo do Dia',
        content: `Resumo gerado automaticamente em ${new Date().toLocaleString('pt-BR')}.`,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      
      setNotes({
        ...notes,
        [dateKey]: [...(notes[dateKey] || []), newSummary]
      });
    }
  };

  const deleteNote = (noteId) => {
    const dateKey = formatDateKey(selectedDate);
    setNotes({
      ...notes,
      [dateKey]: notes[dateKey].filter(note => note.id !== noteId)
    });
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  const getNotesForDay = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateKey = formatDateKey(date);
    return sortNotes(notes[dateKey] || []);
  };

  const getHolidayForDay = (day) => {
    if (!day) return null;
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateKey = formatDateKey(date);
    const year = currentDate.getFullYear();
    const yearHolidays = holidays[year] || {};
    return yearHolidays[dateKey] || null;
  };

  const days = getDaysInMonth(currentDate);
  const selectedDateNotes = selectedDate ? sortNotes(notes[formatDateKey(selectedDate)] || []) : [];

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <div className={`${styles.calendarWrapper} ${styles[theme]}`}>
        <div 
          className={`${styles.header} ${styles[theme]}`}
          style={{
            background: `linear-gradient(135deg, ${emphasisColor || '#667eea'} 0%, ${emphasisColor || '#764ba2'} 100%)`
          }}
        >
          <div className={styles.headerContent}>
            <button onClick={previousMonth} className={`${styles.navButton} ${styles[theme]}`}>
              <ChevronLeft size={24} />
            </button>

            <div className={styles.headerTitle}>
              <h1 className={styles.monthYear}>
                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h1>
              <div className={styles.subtitle}>
                <span>📅 Suas anotações diárias</span>
              </div>
              <div className={styles.yearNav}>
                <button onClick={previousYear} className={`${styles.yearNavButton} ${styles[theme]}`}>
                  <ChevronLeft size={16} />
                </button>
                <span className={styles.yearLabel}>{currentDate.getFullYear()}</span>
                <button onClick={nextYear} className={`${styles.yearNavButton} ${styles[theme]}`}>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <button onClick={nextMonth} className={`${styles.navButton} ${styles[theme]}`}>
              <ChevronRight size={24} />
            </button>
          </div>
          
          <div className={styles.todayButtonWrapper}>
            <button 
              onClick={goToToday} 
              className={`${styles.todayButton} ${styles[theme]}`}
              style={{
                color: emphasisColor || '#667eea'
              }}
            >
              Hoje
            </button>
          </div>
        </div>

        <div className={`${styles.weekDays} ${styles[theme]}`}>
          {weekDays.map(day => (
            <div key={day} className={styles.weekDay}>
              {day}
            </div>
          ))}
        </div>

        <div className={styles.daysGrid}>
          {days.map((item, index) => {
            const dayNotes = item.isCurrentMonth ? getNotesForDay(item.day) : [];
            const holidayName = item.isCurrentMonth ? getHolidayForDay(item.day) : null;
            const isHoliday = !!holidayName;
            const isTodayDay = isToday(item.day);
            
            return (
              <div
                key={index}
                onClick={() => item.isCurrentMonth && handleDateClick(item.day)}
                className={`${styles.dayCell} ${styles[theme]} ${
                  !item.isCurrentMonth ? styles.dayCellInactive : ''
                } ${isTodayDay ? styles.dayCellToday : ''} ${
                  isHoliday ? styles.dayCellHoliday : ''
                } ${isTodayDay && isHoliday ? styles.dayCellTodayHoliday : ''}`}
                style={isTodayDay && !isHoliday ? {
                  background: `linear-gradient(135deg, ${emphasisColor || '#667eea'} 0%, ${emphasisColor || '#764ba2'} 100%)`,
                  borderColor: emphasisColor || '#667eea'
                } : {}}
              >
                <div className={styles.dayNumber}>{item.day}</div>
                
                {holidayName && item.isCurrentMonth && (
                  <div className={`${styles.holidayName} ${styles[theme]}`} title={holidayName}>
                    {holidayName.length > 15 ? `${holidayName.substring(0, 12)}...` : holidayName}
                  </div>
                )}
                 {item.isCurrentMonth && dayNotes.length > 0 && (
                  <>
                    <div 
                      className={styles.notesPreview}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenNoteList(item.day);
                      }}
                      title="Ver lista de anotações"
                    >
                      {dayNotes.slice(0, 4).map((note) => (
                        <div 
                          key={note.id} 
                          className={styles.notePreviewItem}
                          style={!isTodayDay && !isHoliday ? {
                            background: `${emphasisColor || '#667eea'}26`,
                            color: emphasisColor || '#4f46e5',
                            borderLeftColor: emphasisColor || '#667eea'
                          } : {}}
                        >
                          {note.title}
                        </div>
                      ))}
                      {dayNotes.length > 4 && (
                        <div className={`${styles.notePreviewMore} ${styles[theme]}`}>
                          +{dayNotes.length - 4}
                        </div>
                      )}
                    </div>
                    
                    <div 
                      className={`${styles.notesIndicator} ${styles[theme]}`} 
                      title={`${dayNotes.length} anotação(ões)`}
                      style={isTodayDay && !isHoliday ? {
                        borderColor: emphasisColor || '#667eea'
                      } : {}}
                    ></div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <CreateNote
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        selectedDate={selectedDate}
        noteType={noteType}
        onNoteTypeChange={setNoteType}
        selectedPeriod={selectedPeriod}
        onSelectedPeriodChange={setSelectedPeriod}
        onAddNote={addNote}
        selectedDateNotes={selectedDateNotes}
        onDeleteNote={deleteNote}
        onGenerateSummary={generateSummary}
      />

      <NoteList
        isOpen={showNoteList}
        onClose={() => setShowNoteList(false)}
        selectedDate={selectedDate}
        notes={selectedDateNotes}
        onDeleteNote={deleteNote}
      />
    </div>
  );
};

export default Calendar;