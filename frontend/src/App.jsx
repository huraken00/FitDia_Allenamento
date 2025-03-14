import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext, AuthProvider } from "./shared/context/auth-context";
import HomePage from "./Homepage";
import LoginDirettore from "./director/pages/login";
import LoginUser from "./user/pages/Login";
import RegisterUser from "./user/pages/Register";
import Dashboard from "./user/pages/Dashboard"; // Pagina protetta
import HomePageDirettore from "./director/pages/Homepage";
import ListaUtenti from "./director/pages/ListaUtenti";
import EspertiAllenamento from "./director/pages/EspertiAllenamento"
import InserimentoEspertiAllenamento from "./director/pages/InserimentoEspertiAllenamento"
import DashboardAllenamento from "./user/pages/DashboardAllenamento";
import Profilo from "./components/profilo";

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);
  return isLoggedIn ? children : <Navigate to="/loginUser" replace />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/loginUser" element={<LoginUser />} />
          <Route path="/registerUser" element={<RegisterUser />} />
          <Route path="/login-direttore" element={<LoginDirettore />} />
          <Route path="/homepage-direttore" element={<PrivateRoute><HomePageDirettore /></PrivateRoute>} />
          <Route path="/lista-utenti" element={<PrivateRoute><ListaUtenti /></PrivateRoute>} />
          <Route path="/esperti-allenamento" element={<PrivateRoute><EspertiAllenamento /></PrivateRoute>} />
          <Route path="/inserimento-esperti-allenamento" element={<PrivateRoute><InserimentoEspertiAllenamento /></PrivateRoute>} />

          {/* Protezione delle pagine private */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/DashboardAllenamento" element={<PrivateRoute><DashboardAllenamento /></PrivateRoute>} />
          <Route path="/Profilo" element={<PrivateRoute><Profilo /></PrivateRoute>} />
         
          {/* Se non è loggato, viene reindirizzato al login */}
          <Route path="*" element={<Navigate to="/loginUser" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
