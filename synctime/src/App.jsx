// ⚙️ Dependências principais
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useState } from 'react';

// 🧩 Componentes
import Message from './components/flashMessage/Message';

// 📄 Páginas
import Login from './views/auth/Login';
import Register from './views/auth/Register';
import LoadingPage from './views/loading/Loading';
import ForgotPassword from './views/auth/ForgotPassword';
import StartLogin from './views/auth/StartLogin';

// 🌐 Contexto
import { UserProvider } from './context/UserContext';

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
              <Route path="/">
                <StartLogin />
              </Route>
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/register">
                <Register />
              </Route>
              <Route path="/forgot-password">
                <ForgotPassword />
              </Route>
            </Switch>
          </>
        )}
      </UserProvider>
    </Router>
  );
}

export default App;
