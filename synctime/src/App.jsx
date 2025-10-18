import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation
} from 'react-router-dom';
import { useState } from 'react';
// 🧩 Componentes
import Message from './components/flashMessage/Message';
import Header from './components/header/Header';
import Footer from './components/footer/footer';
import Sidebar from './components/sidebar/Sidebar';
import Container from './components/layout/Container';
// 📄 Páginas
import Login from './views/auth/Login';
import Register from './views/auth/Register';
import LoadingPage from './views/loading/Loading';
import ForgotPassword from './views/auth/ForgotPassword';
import StartLogin from './views/auth/StartLogin';
import Home from './views/home/Home';
import CategoryList from './views/sectionConfigSystem/Sections/Report/Category/CategoryList';
import CategoryForm from './views/sectionConfigSystem/Sections/Report/Category/Form/CategoryForm';
import RecordTypeForm from './views/sectionConfigSystem/Sections/General/RecordType/Form/RecordTypeForm';
import CustomFieldForm from './views/sectionConfigSystem/Sections/General/CustomFields/Form/CustomFieldsForm';
import SectionConfigSystem from './views/sectionConfigSystem/SectionConfigSystem';

// 🌐 Contexto
import { UserProvider } from './context/UserContext';
import RecordTypeList from './views/sectionConfigSystem/Sections/General/RecordType/RecordTypeList';
import CustomFieldsList from './views/sectionConfigSystem/Sections/General/CustomFields/CustomFieldsList';

function ProtectedRoute({ children, ...rest }) {
  const token = localStorage.getItem('token');
  return (
    <Route
      {...rest}
      render={({ location }) =>
        token ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

function PublicRoute({ children, ...rest }) {
  const token = localStorage.getItem('token');
  return (
    <Route
      {...rest}
      render={() => (token ? <Redirect to="/inicio" /> : children)}
    />
  );
}

function Layout({ children }) {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const [sidebarState, setSidebarState] = useState({
    isMinimized: false,
    isMobile: false
  });

  const protectedPages = [
    '/inicio',
    '/dashboard',
    '/relatorios',
    '/anotacoes',
    '/configuracoes',
    '/conta',
    '/categoria',
    '/categoria/form',
    '/categoria/form/:id',
    '/record-type',
    '/record-type/form',
    '/record-type/form/:id',
    '/custom-fields',
    '/custom-fields/form',
    '/custom-fields/form/:id'
  ];

  const showSidebar =
    token &&
    protectedPages.some((path) =>
      location.pathname.startsWith(path.replace('/:id', ''))
    );

  const handleSidebarToggle = (isMinimized, isMobile) => {
    setSidebarState({ isMinimized, isMobile });
  };

  const getMarginLeft = () => {
    if (!showSidebar) return '0';
    if (sidebarState.isMobile) return '0';
    if (sidebarState.isMinimized) return '80px';
    return '260px';
  };

  const getWidth = () => {
    if (!showSidebar) return '100%';
    if (sidebarState.isMobile) return '100%';
    if (sidebarState.isMinimized) return 'calc(100% - 80px)';
    return 'calc(100% - 260px)';
  };

  return (
    <>
      {showSidebar && <Sidebar onToggle={handleSidebarToggle} />}
      <div
        style={{
          marginLeft: getMarginLeft(),
          minHeight: '100vh',
          transition: 'margin-left 0.3s ease, width 0.3s ease',
          width: getWidth()
        }}
      >
        {showSidebar && <Header />}
        <main
          style={{
            padding: showSidebar ? '0' : '0',
            paddingTop: sidebarState.isMobile && showSidebar ? '70px' : '0'
          }}
        >
          {showSidebar ? <Container>{children}</Container> : children}
        </main>
        {showSidebar && <Footer />}
      </div>
    </>
  );
}

export const mockRecordTypes = [
  { value: 'rec_001', label: 'Padrão' },
  { value: 'rec_002', label: 'POC Tevendas' },
  { value: 'rec_003', label: 'Teste' },
  { value: 'rec_004', label: 'Receita' },
  { value: 'rec_005', label: 'Despesa' },
  { value: 'rec_006', label: 'Lead' },
  { value: 'rec_007', label: 'Cliente' },
  { value: 'rec_008', label: 'Fornecedor' },
  { value: 'rec_009', label: 'Evento' },
  { value: 'rec_010', label: 'Tarefa' }
];

export const mockCategories = [
  { value: 'cat_001', label: 'Educação' },
  { value: 'cat_002', label: 'Financeiro' },
  { value: 'cat_003', label: 'Atividade Doméstica' },
  { value: 'cat_004', label: 'Saúde' },
  { value: 'cat_005', label: 'Trabalho' }
];

function App() {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <Router>
      <UserProvider>
        {isLoading ? (
          <LoadingPage onLoadingComplete={() => setIsLoading(false)} />
        ) : (
          <>
            <Message />
            <Layout>
              <Switch>
                <PublicRoute exact path="/">
                  <StartLogin />
                </PublicRoute>
                <PublicRoute path="/login">
                  <Login />
                </PublicRoute>
                <PublicRoute path="/register">
                  <Register />
                </PublicRoute>
                <PublicRoute path="/esqueceu-senha">
                  <ForgotPassword />
                </PublicRoute>
                <ProtectedRoute path="/inicio">
                  <Home />
                </ProtectedRoute>
                <ProtectedRoute path="/configuracoes">
                  <SectionConfigSystem />
                </ProtectedRoute>

                <ProtectedRoute exact path="/categoria">
                  <CategoryList />
                </ProtectedRoute>

                <ProtectedRoute exact path="/categoria/form">
                  <CategoryForm />
                </ProtectedRoute>

                <ProtectedRoute path="/categoria/form/:id">
                  <CategoryForm />
                </ProtectedRoute>

                <ProtectedRoute exact path="/record-type">
                  <RecordTypeList />
                </ProtectedRoute>
                <ProtectedRoute exact path="/record-type/form">
                  <RecordTypeForm />
                </ProtectedRoute>
                <ProtectedRoute path="/record-type/form/:id">
                  <RecordTypeForm />
                </ProtectedRoute>

                 <ProtectedRoute exact path="/custom-fields">
                  <CustomFieldsList />
                </ProtectedRoute>
                <ProtectedRoute exact path="/custom-fields/form">
                  <CustomFieldForm />
                </ProtectedRoute>
                <ProtectedRoute path="/custom-fields/form/:id">
                  <CustomFieldForm />
                </ProtectedRoute>
              </Switch>
            </Layout>
          </>
        )}
      </UserProvider>
    </Router>
  );
}

export default App;
