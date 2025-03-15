import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext, AuthProvider } from "./shared/context/auth-context";

//Login e registrazione 
import HomePage from "./Homepage";
import LoginUser from "./user/pages/Login";
import RegisterUser from "./user/pages/Register";
import LoginDirettore from "./director/pages/Login";

//Routes direttore
import HomePageDirettore from "./director/pages/Homepage";
import ListaUtenti from "./director/pages/ListaUtenti";
import EspertiAllenamento from "./director/pages/EspertiAllenamento"
import InserimentoEspertiAllenamento from "./director/pages/InserimentoEspertiAllenamento"

//Routes utenti
import Dashboard from "./user/pages/Dashboard"; 
import DashboardAllenamento from "./user/pages/DashboardAllenamento";
import Profilo from "./components/profilo";

const PrivateRoute = ({ children, requiredRole }) => {
  const { isLoggedIn, role } = useContext(AuthContext);

  if (!isLoggedIn) {
    // Se l'utente non è loggato, reindirizza in base al ruolo previsto
    return <Navigate to={requiredRole === "direttore" ? "/login-direttore" : "/login-utente"} replace />;
  }

  if (requiredRole && role !== requiredRole) {
    // Se il ruolo non è corretto, reindirizza alla home
    return <Navigate to="/" replace />;
  }

  return children;
}
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login-utente" element={<LoginUser />} />
          <Route path="/register-utente" element={<RegisterUser />} />
          <Route path="/login-direttore" element={<LoginDirettore />} />

          {/* Pagine accessibili solo ai direttori */}
          <Route path="/homepage-direttore" element={<PrivateRoute requiredRole="direttore"><HomePageDirettore /></PrivateRoute>} />
          <Route path="/lista-utenti" element={<PrivateRoute requiredRole="direttore"><ListaUtenti /></PrivateRoute>} />
          <Route path="/esperti-allenamento" element={<PrivateRoute requiredRole="direttore"><EspertiAllenamento /></PrivateRoute>} />
          <Route path="/inserimento-esperti-allenamento" element={<PrivateRoute requiredRole="direttore"><InserimentoEspertiAllenamento /></PrivateRoute>} />

          {/* Pagine accessibili solo agli utenti */}
          <Route path="/dashboard" element={<PrivateRoute requiredRole="utente"><Dashboard /></PrivateRoute>} />
          <Route path="/dashboard-allenamento" element={<PrivateRoute requiredRole="utente"><DashboardAllenamento /></PrivateRoute>} />
          <Route path="/profilo" element={<PrivateRoute requiredRole="utente"><Profilo /></PrivateRoute>} />
         
        </Routes>
      </Router>
    </AuthProvider>
  );
}
export default App