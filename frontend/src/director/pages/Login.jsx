import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import styles from "./LoginDirettore.module.css"; // Importa il modulo CSS

const LoginDirettore = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3001/api/direttore/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      console.log("data", data);
      if (!res.ok) {
        throw new Error(data.message);
      }
      console.log("id login", data.id);
      // Salva i dati nel contesto con il ruolo
      auth.login(data.id, data.token, "direttore");

      navigate("/homepage-direttore"); // Reindirizza alla homepage direttore
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.titoloPagina}>Login Direttore</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <input
            type="Username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.loginButton}>
          Login
        </button>
      </form>
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
};

export default LoginDirettore;
