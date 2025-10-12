import { BrowserRouter as Router, Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { useState } from 'react';

// 🧩 Componentes
import Message from './components/flashMessage/Message';
import Header from './components/header/Header';
import Footer from './components/footer/footer';

// 📄 Páginas
import Login from './views/auth/Login';
import Register from './views/auth/Register';
import LoadingPage from './views/loading/Loading';
import ForgotPassword from './views/auth/ForgotPassword';
import StartLogin from './views/auth/StartLogin';
import Home from './views/home/Home';

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
  const showHeaderFooter = location.pathname === '/inicio';

  return (
    <>
      {showHeaderFooter && <Header />}
      {children}
      {showHeaderFooter && <Footer />}
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
            <Switch>
              <PublicRoute exact path="/">
                <Layout>
                  <StartLogin />
                </Layout>
              </PublicRoute>
              <PublicRoute path="/login">
                <Layout>
                  <Login />
                </Layout>
              </PublicRoute>
              <PublicRoute path="/register">
                <Layout>
                  <Register />
                </Layout>
              </PublicRoute>
              <PublicRoute path="/esqueceu-senha">
                <Layout>
                  <ForgotPassword />
                </Layout>
              </PublicRoute>
              <ProtectedRoute path="/inicio">
                <Layout>
                  <Home />
                </Layout>
              </ProtectedRoute>
            </Switch>
          </>
        )}
      </UserProvider>
    </Router>
  );
}

export default App;