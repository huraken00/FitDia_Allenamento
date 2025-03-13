import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext, AuthProvider } from "./shared/context/auth-context";
import HomePage from "./Homepage";
import LoginDirettore from "./director/pages/login";
import LoginUser from "./user/pages/Login";
import RegisterUser from "./user/pages/Register";
import Dashboard from "./user/pages/Dashboard"; // Pagina protetta

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
          <Route path="/loginDirettore" element={<LoginDirettore />} />

          {/* Protezione delle pagine private */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

          {/* Se non è loggato, viene reindirizzato al login */}
          <Route path="*" element={<Navigate to="/loginUser" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
