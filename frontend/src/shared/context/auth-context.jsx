import { createContext, useState } from "react";

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

  
  return (
    
    <AuthContext.Provider value={{ isLoggedIn: !!token, token, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
