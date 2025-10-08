import  { createContext } from "react";
import PropTypes from "prop-types";

import useAuth from "../hooks/userAuth";

const Context = createContext();

function UserProvider({ children }) {
  const { authenticated, loading, register, login, logout,forgotPassword } = useAuth();

  return (
    <Context.Provider
      value={{ loading, authenticated, register, login, logout, forgotPassword }}
    >
      {children}
    </Context.Provider>
  );
}


UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { Context, UserProvider };
