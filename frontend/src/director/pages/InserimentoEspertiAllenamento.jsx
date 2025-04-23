import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./InserimentoEsperti.module.css"; // Importa il modulo CSS
import ErrorMessage from "../../components/ErrorMessage"; // Importa la componente ErrorMessage

const InserimentoEspertiAllenamento = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Stato per la gestione degli errori
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset dell'errore prima di tentare l'invio
    try {
      const res = await fetch("http://localhost:3001/api/esperti-allenamento", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        // Gestione degli errori a livello di risposta
        throw new Error("Errore nell'aggiunta dell'esperto");
      }
      navigate("/esperti-allenamento"); // Torna alla lista degli esperti
    } catch (err) {
      if (err.message === "Accesso non autorizzato") {
        // Solo in caso di errore di autenticazione, rimuoviamo il token
        localStorage.removeItem("token");
        navigate("/login-direttore");
      } else {
        // Gestione generica degli errori
        setError(err.message || "Si è verificato un errore durante l'inserimento dell'esperto.");
        console.error("Errore nell'aggiunta dell'esperto:", err);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Inserisci Nuovo Esperto</h2>

      {/* Visualizza il messaggio di errore se presente */}
      {error && <ErrorMessage message={error} />}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Username:</label>
          <input
            className={styles.input}
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Password:</label>
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className={styles.submitButton} type="submit">
          Inserisci Esperto
        </button>
      </form>
    </div>
  );
};

export default InserimentoEspertiAllenamento;

