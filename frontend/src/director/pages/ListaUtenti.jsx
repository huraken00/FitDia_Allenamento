import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ListaUtenti.module.css";
import ErrorMessage from "../../components/ErrorMessage"; // Importa il componente ErrorMessage

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState(null); // Stato per gestire gli errori
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/user");
      
      if (!res.ok) {
        if (res.status === 401) {
          // Gestione errore di accesso non autorizzato
          localStorage.removeItem("token");
          navigate("/login-direttore");
          return;
        }
        throw new Error("Errore nel recupero degli utenti");
      }

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError("Si è verificato un errore durante il recupero degli utenti."); // Settiamo l'errore
      console.error("Errore nel recupero degli utenti:", err);
    }
  };

  const today = new Date();

  const filteredUsers = users.filter((user) => {
    const expirationDate = new Date(user.scadenza_abbonamento);
    if (filter === "expired") return expirationDate < today;
    if (filter === "active") return expirationDate >= today;
    return true; // "all"
  });

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Lista Utenti</h2>

      {/* Se c'è un errore, lo mostriamo */}
      {error && <ErrorMessage message={error} />}

      <div className={styles.filterWrapper}>
        <label htmlFor="filterSelect">Filtra per abbonamento: </label>
        <select
          id="filterSelect"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Tutti</option>
          <option value="active">Solo attivi</option>
          <option value="expired">Solo scaduti</option>
        </select>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Cognome</th>
            <th>Scadenza Abbonamento</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.nome}</td>
                <td>{user.cognome}</td>
                <td>{new Date(user.scadenza_abbonamento).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">Nessun utente trovato.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
