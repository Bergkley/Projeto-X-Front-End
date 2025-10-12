// ⚙️ Dependências principais
import { BrowserRouter as Router, Switch, Route, useLocation } from 'react-router-dom';
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
              <Route exact path="/">
                <Layout>
                  <StartLogin />
                </Layout>
              </Route>
              <Route path="/login">
                <Layout>
                  <Login />
                </Layout>
              </Route>
              <Route path="/register">
                <Layout>
                  <Register />
                </Layout>
              </Route>
              <Route path="/esqueceu-senha">
                <Layout>
                  <ForgotPassword />
                </Layout>
              </Route>
              <Route path="/inicio">
                <Layout>
                  <Home />
                </Layout>
              </Route>
            </Switch>
          </>
        )}
      </UserProvider>
    </Router>
  );
}

export default App;