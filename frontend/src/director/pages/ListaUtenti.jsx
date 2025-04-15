import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ListaUtenti.module.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/user");
      if (!res.ok) throw new Error("Errore nel recupero degli utenti");

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      if (err.message === "Accesso non autorizzato") {
        localStorage.removeItem("token");
        navigate("/login-direttore");
      } else {
        console.error("Errore nel recupero degli utenti:", err);
      }
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
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td>{user.nome}</td>
              <td>{user.cognome}</td>
              <td>{new Date(user.scadenza_abbonamento).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;