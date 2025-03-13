import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  token: null,
  userId: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);

  const login = (uid, token) => {
    setToken(token);
    setUserId(uid);
    localStorage.setItem("token", token);
    localStorage.setItem("userId", uid);
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
  };

  useEffect(() => {
    // Controlla se il token esiste nel localStorage al primo caricamento
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    
    if (storedToken && storedUserId) {
      setToken(storedToken);
      setUserId(storedUserId);
    }
  }, []);
  console.log("Current Token:", token); 
  return (
    <AuthContext.Provider value={{ isLoggedIn: !!token, token, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
