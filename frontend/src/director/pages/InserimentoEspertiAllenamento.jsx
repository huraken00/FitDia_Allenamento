import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const InserimentoEspertiAllenamento = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Controllo dell'autenticazione all'esterno di handleSubmit
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login-direttore");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
        // Verifica dell'autenticazione del direttore
        const authRes = await fetch("http://localhost:3001/api/direttore/check-auth", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!authRes.ok) {
          throw new Error("Accesso non autorizzato");
        }

      const res = await fetch("http://localhost:3001/api/esperti-allenamento", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"},
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        throw new Error("Errore nell'aggiunta dell'esperto");
      }
      navigate("/esperti-allenamento"); // Torna alla lista degli esperti
      
    } catch (err) {
      if (err.message === "Accesso non autorizzato") {
        // Solo in caso di errore di autenticazione, rimuoviamo il token
        localStorage.removeItem("token");
        navigate("/login-direttore");
      } else {
        // Se l'errore riguarda il recupero dei dati, non rimuoviamo il token
        console.error("Errore nell'aggiunta dell'esperto:", err);
      }
    }
  };

  return (
    <div>
      <h2>Inserisci Nuovo Esperto</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Inserisci Esperto</button>
      </form>
    </div>
  );
};

export default InserimentoEspertiAllenamento;
