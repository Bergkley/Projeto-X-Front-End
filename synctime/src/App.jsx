// ⚙️ Dependências principais
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useState } from 'react';

// 🧩 Componentes
import Message from "./components/flashMessage/Message";

// 📄 Páginas
import Login from './views/auth/Login';
import Register from './views/auth/Register';
import Home from './views/auth/Home';
import LoadingPage from './views/loading/Loading';
import ForgotPassword from "./views/auth/ForgotPassword";

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
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/forgot-password">
             <ForgotPassword />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
          </>
        )}
      </UserProvider>
    </Router>
  );
}

export default App;
