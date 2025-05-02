import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import styles from "./LoginDirettore.module.css"; // Importa il modulo CSS
import ErrorMessage from "../../components/ErrorMessage"; // Importa il componente ErrorMessage

const LoginDirettore = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset errore prima della richiesta

    try {
      const res = await fetch("http://localhost:3001/api/direttore/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      // Se la risposta non è ok, lancia un errore con il messaggio dalla risposta
      if (!res.ok) {
        throw new Error(data.message || "Errore sconosciuto durante il login.");
      }

      // Se la risposta è positiva, salviamo i dati nel contesto
      auth.login(data.id, data.token, "direttore");
      
      // Reindirizza alla homepage del direttore
      navigate("/homepage-direttore");

    } catch (err) {
      // Gestione errore di rete o credenziali non valide
      if (err.message === "Failed to fetch") {
        setError("Errore di connessione. Controlla la tua connessione a Internet.");
      } else {
        setError(err.message); // Mostra il messaggio dell'errore
      }
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.titoloPagina}>Login Direttore</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <input
            type="username"
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

      {/* Se c'è un errore, visualizzalo */}
      {error && <ErrorMessage message={error} />}
    </div>
  );
};

export default LoginDirettore;
