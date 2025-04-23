import { useState, useContext } from "react";
import { AuthContext } from "../shared/context/auth-context";
import { useNavigate } from "react-router-dom";
import styles from "./ProfiloEsperto.module.css";
import ErrorMessage from "../components/ErrorMessage"; // Componente per errori

const ProfiloEsperto = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const eid = auth.userId;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset errori precedenti

    try {
      const res = await fetch(`http://localhost:3001/api/esperti-allenamento/${eid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Errore: Impossibile aggiornare l'esperto.");
      }

      navigate("/homepage-esperto");
    } catch (err) {
      console.error("Errore aggiornamento profilo:", err);
      setError(err.message || "Errore imprevisto.");
    }
  };

  return (
    <div className={styles.profiloContainer}>
      <h2 className={styles.titoloPagina}>Profilo Esperto</h2>
      <ErrorMessage message={error} />
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="username" className={styles.label}>Username:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
        </div>
        <button type="submit" className={styles.salvaButton}>Salva</button>
      </form>
    </div>
  );
};

export default ProfiloEsperto;
