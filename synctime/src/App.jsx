import { BrowserRouter as Router, Switch } from "react-router-dom";

// components


// pages





// context
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <Router>
      <UserProvider>
        {/* <Navbar /> */}
        {/* <Message /> */}
        {/* <Container> */}
          <Switch>
            <div><p>deu certo</p></div>
          </Switch>
        {/* </Container> */}
        {/* <Footer /> */}
      </UserProvider>
    </Router>
  );
}

export default App;
