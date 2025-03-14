import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  token: null,
  userId: null,
  role: null, // Aggiunto ruolo
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const [role, setRole] = useState(localStorage.getItem("role") || null); // Recupera il ruolo

  useEffect(() => {
    if (token && userId && role) {
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("role", role);
    }
  }, [token, userId, role]);

  const login = (uid, token, userRole) => {
    setToken(token);
    setUserId(uid);
    setRole(userRole);
    localStorage.setItem("token", token);
    localStorage.setItem("userId", uid);
    localStorage.setItem("role", userRole);
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!token, token, userId, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export default AuthContext
