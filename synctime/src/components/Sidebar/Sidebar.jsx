import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './Sidebar.module.css';
import { 
  FaHome, 
  FaChartBar, 
  FaFileAlt, 
  FaStickyNote, 
  FaCog, 
  FaUser, 
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaChevronRight
} from 'react-icons/fa';
import { useTheme } from '../../hooks/useTheme';
import { useEmphasisColor } from '../../hooks/useEmphasisColor';

const relatoriosSubMenu = [
  { 
    id: 1,
    name: 'Categoria', 
    subcategorias: [
      { id: 11, name: 'Vendas por Período', path: '/relatorios/vendas/periodo' },
      { id: 12, name: 'Vendas por Produto', path: '/relatorios/vendas/produto' },
      { id: 13, name: 'Vendas por Vendedor', path: '/relatorios/vendas/vendedor' },
    ]
  }
];

function Sidebar({ onToggle }) {
  const location = useLocation();
  const { theme } = useTheme();
  const { emphasisColor } = useEmphasisColor();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isRelatoriosOpen, setIsRelatoriosOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState({});

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith('/relatorios')) {
      setIsRelatoriosOpen(true);
      
      relatoriosSubMenu.forEach(category => {
        category.subcategorias.forEach(sub => {
          if (location.pathname === sub.path) {
            setOpenCategories(prev => ({
              ...prev,
              [category.id]: true
            }));
          }
        });
      });
    }
  }, [location.pathname]);

  useEffect(() => {
    if (onToggle) {
      const effectiveMinimized = isMinimized && !isHovered;
      onToggle(effectiveMinimized, isMobile);
    }
  }, [isMinimized, isHovered, isMobile, onToggle]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const isActive = (path) => {
    return location.pathname === path ? styles.active : '';
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    setIsHovered(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeMobileMenu = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const handleMouseEnter = () => {
    if (isMinimized && !isMobile) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (isMinimized && !isMobile) {
      setIsHovered(false);
    }
  };

  const toggleRelatorios = (e) => {
    e.preventDefault();
    setIsRelatoriosOpen(!isRelatoriosOpen);
  };

  const toggleCategory = (categoryId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const showExpanded = !isMinimized || isHovered || (isMobile && isMobileOpen);

  return (
    <>
      {isMobile && (
        <button 
          className={styles.mobileToggle} 
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <FaBars />
        </button>
      )}

      {isMobile && isMobileOpen && (
        <div className={styles.overlay} onClick={closeMobileMenu}></div>
      )}

      <aside 
        className={`${styles.sidebar} ${styles[theme]} ${isMinimized && !isMobile ? styles.minimized : ''} ${isHovered ? styles.hovered : ''} ${isMobile && isMobileOpen ? styles.mobileOpen : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          className={styles.sidebarHeader}
          style={{ backgroundColor: emphasisColor || 'rgb(20, 18, 129)' }}
        >
          {showExpanded && (
            <div className={styles.logoContainer}>
              <img src="/logo.png" alt="Logo" className={styles.logo} />
            </div>
          )}
          
          {!isMobile && (
            <button 
              className={styles.toggleButton} 
              onClick={toggleMinimize}
              aria-label={isMinimized ? "Expandir menu" : "Minimizar menu"}
            >
              {isMinimized ? <FaBars /> : <FaTimes />}
            </button>
          )}

          {isMobile && (
            <button 
              className={styles.closeButton} 
              onClick={closeMobileMenu}
              aria-label="Fechar menu"
            >
              <FaTimes />
            </button>
          )}
        </div>

        <nav className={styles.mainMenu}>
          {showExpanded && <h3 className={styles.menuTitle}>Principal</h3>}
          <ul className={styles.menuList}>
            <li>
              <Link 
                to="/inicio" 
                className={`${styles.menuItem} ${isActive('/inicio')}`}
                onClick={closeMobileMenu}
                title="Início"
              >
                <FaHome className={styles.icon} />
                {showExpanded && <span>Início</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/dashboard" 
                className={`${styles.menuItem} ${isActive('/dashboard')}`}
                onClick={closeMobileMenu}
                title="Dashboard"
              >
                <FaChartBar className={styles.icon} />
                {showExpanded && <span>Dashboard</span>}
              </Link>
            </li>
            
            {/* Menu Relatórios com Submenu */}
            <li>
              <div className={styles.menuItemWrapper}>
                <button
                  className={`${styles.menuItem} ${styles.menuItemDropdown} ${location.pathname.startsWith('/relatorios') ? styles.active : ''}`}
                  onClick={toggleRelatorios}
                  title="Relatórios"
                >
                  <FaFileAlt className={styles.icon} />
                  {showExpanded && (
                    <>
                      <span>Relatórios</span>
                      <span className={styles.dropdownIcon}>
                        {isRelatoriosOpen ? <FaChevronDown /> : <FaChevronRight />}
                      </span>
                    </>
                  )}
                </button>
                
                {/* Submenu de Categorias */}
                {showExpanded && isRelatoriosOpen && (
                  <ul className={styles.submenu}>
                    {relatoriosSubMenu.map((category) => (
                      <li key={category.id}>
                        <button
                          className={`${styles.submenuItem} ${styles.submenuItemDropdown}`}
                          onClick={(e) => toggleCategory(category.id, e)}
                        >
                          <span>{category.name}</span>
                          <span className={styles.submenuArrow}>
                            {openCategories[category.id] ? <FaChevronDown /> : <FaChevronRight />}
                          </span>
                        </button>
                        
                        {/* Sub-subcategorias */}
                        {openCategories[category.id] && (
                          <ul className={styles.subSubmenu}>
                            {category.subcategorias.map((sub) => (
                              <li key={sub.id}>
                                <Link
                                  to={sub.path}
                                  className={`${styles.subSubmenuItem} ${isActive(sub.path)}`}
                                  onClick={closeMobileMenu}
                                  style={location.pathname === sub.path ? {
                                    borderLeftColor: emphasisColor || '#3b82f6',
                                    color: emphasisColor || '#3b82f6'
                                  } : {}}
                                >
                                  {sub.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>

            <li>
              <Link 
                to="/anotacoes" 
                className={`${styles.menuItem} ${isActive('/anotacoes')}`}
                onClick={closeMobileMenu}
                title="Anotações"
              >
                <FaStickyNote className={styles.icon} />
                {showExpanded && <span>Anotações</span>}
              </Link>
            </li>
          </ul>
        </nav>

        <nav className={styles.settingsMenu}>
          {showExpanded && <h3 className={styles.menuTitle}>Configurações</h3>}
          <ul className={styles.menuList}>
            <li>
              <Link 
                to="/configuracoes" 
                className={`${styles.menuItem} ${isActive('/configuracoes')}`}
                onClick={closeMobileMenu}
                title="Configuração do Sistema"
              >
                <FaCog className={styles.icon} />
                {showExpanded && <span>Configuração do Sistema</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/conta" 
                className={`${styles.menuItem} ${isActive('/conta')}`}
                onClick={closeMobileMenu}
                title="Conta"
              >
                <FaUser className={styles.icon} />
                {showExpanded && <span>Conta</span>}
              </Link>
            </li>
            <li>
              <button 
                onClick={handleLogout} 
                className={styles.menuItem}
                title="Logout"
              >
                <FaSignOutAlt className={styles.icon} />
                {showExpanded && <span>Logout</span>}
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;