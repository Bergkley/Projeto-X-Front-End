import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useState } from 'react';


// components

// pages
import Login from './views/auth/Login';
import Register from './views/auth/Register';
import Home from './views/auth/Home';
import LoadingPage from './views/loading/Loading';


// Routes

// context
import { UserProvider } from './context/UserContext';
import ForgotPassword from "./views/auth/ForgotPassword";


function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Router>
      <UserProvider>
        {isLoading ? (
          <LoadingPage onLoadingComplete={() => setIsLoading(false)} />
        ) : (
          <>
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
