import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []); 

    const fetchData = async () => {
      try {
       
        // Recupero della lista utenti solo se l'autenticazione ha avuto successo
        const res = await fetch("http://localhost:3001/api/user");
        if (!res.ok) throw new Error("Errore nel recupero degli utenti");

        const data = await res.json();
        setUsers(data);
      } catch (err) {
        if (err.message === "Accesso non autorizzato") {
          // Solo in caso di errore di autenticazione, rimuoviamo il token
          localStorage.removeItem("token");
          navigate("/login-direttore");
        } else {
          // Se l'errore riguarda il recupero dei dati, non rimuoviamo il token
          console.error("Errore nel recupero degli utenti:", err);
        }
      }
    };


  return (
    <div>
      <h2>Lista Utenti</h2>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Cognome</th>
            <th>Scadenza Abbonamento</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
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
