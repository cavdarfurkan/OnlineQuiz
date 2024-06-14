import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

function App() {
  const user = Cookies.get("user");
  const isAuthenticated = user ? true : false;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return <Navigate to="/login" />;
}

export default App;
