import { BrowserRouter as Router, Switch, Route, Redirect, useLocation } from 'react-router-dom';
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
import SectionConfigSystem from './views/SectionConfigSystem/SectionConfigSystem';



// 🌐 Contexto
import { UserProvider } from './context/UserContext';

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
              state: { from: location },
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
      render={() =>
        token ? (
          <Redirect to="/inicio" />
        ) : (
          children
        )
      }
    />
  );
}

function Layout({ children }) {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const [sidebarState, setSidebarState] = useState({ isMinimized: false, isMobile: false });
  
  // Páginas protegidas que mostram sidebar, header e footer
  const protectedPages = ['/inicio', '/dashboard', '/relatorios', '/anotacoes', '/configuracoes', '/conta'];
  const showSidebar = token && protectedPages.includes(location.pathname);

  // Callback para receber o estado da sidebar
  const handleSidebarToggle = (isMinimized, isMobile) => {
    setSidebarState({ isMinimized, isMobile });
  };

  // Calcula a margem dinamicamente baseado no estado da sidebar
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
      <div style={{ 
        marginLeft: getMarginLeft(), 
        minHeight: '100vh',
        transition: 'margin-left 0.3s ease, width 0.3s ease',
        width: getWidth()
      }}>
        {showSidebar && <Header />}
        <main style={{ 
          padding: showSidebar ? '0' : '0',
          paddingTop: sidebarState.isMobile && showSidebar ? '70px' : '0'
        }}>
          {showSidebar ? (
            <Container>{children}</Container>
          ) : (
            children
          )}
        </main>
        {showSidebar && <Footer />}
      </div>
    </>
  );
}

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
                {/* Adicione aqui as outras rotas protegidas */}
                {/* <ProtectedRoute path="/dashboard">
                  <Dashboard />
                </ProtectedRoute>
                <ProtectedRoute path="/relatorios">
                  <Relatorios />
                </ProtectedRoute>
                <ProtectedRoute path="/anotacoes">
                  <Anotacoes />
                </ProtectedRoute>
                <ProtectedRoute path="/configuracoes">
                  <Configuracoes />
                </ProtectedRoute>
                <ProtectedRoute path="/conta">
                  <Conta />
                </ProtectedRoute> */}
              </Switch>
            </Layout>
          </>
        )}
      </UserProvider>
    </Router>
  );
}

export default App;