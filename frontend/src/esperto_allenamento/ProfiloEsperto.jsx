import { useState, useContext } from "react";
import { AuthContext } from "../shared/context/auth-context";
import { useNavigate } from "react-router-dom";
import styles from "./ProfiloEsperto.module.css"; // Importa il modulo CSS

const ProfiloEsperto = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const eid = auth.userId;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3001/api/esperti-allenamento/${eid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        alert("Esperto aggiornato con successo!");
        navigate("/homepage-esperto");
      } else {
        alert("Errore: Impossibile aggiornare l'esperto");
      }
    } catch (err) {
      alert("Si è verificato un errore durante l'aggiornamento.");
    }
  };

  return (
    <div className={styles.profiloContainer}>
      <h2 className={styles.titoloPagina}>Profilo Esperto</h2>
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
