import { Switch, Route } from "react-router-dom";
import Home from "../components/pages/Home";

// Importa os grupos de rotas
import AuthRoutes from "./AuthRoutes";
import UserRoutes from "./UserRoutes";
import PetRoutes from "./PetRoutes";

function AppRoutes() {
  return (
    <Switch>
     <Route path="/">
        <Home />
      </Route>
      <AuthRoutes />
      <UserRoutes />
      <PetRoutes />

     
    </Switch>
  );
}

export default AppRoutes;
