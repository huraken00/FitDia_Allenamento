import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const EspertiAllenamento = () => {
  const [esperti, setEsperti] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []); // L'array vuoto fa sì che la funzione venga eseguita solo al montaggio

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/esperti-allenamento", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Invia il token per autenticazione
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          // Accesso non autorizzato: rimuovi il token e reindirizza
          localStorage.removeItem("token");
          navigate("/login-direttore");
          return;
        }
        throw new Error("Errore nel recupero degli esperti");
      }

      const data = await res.json();
      setEsperti(data);
    } catch (err) {
      console.error("Errore nel recupero degli esperti:", err);
    }
  };

  return (
    <div>
      <h2>Lista Esperti Allenamento</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          {esperti.map((esperto, index) => (
            <tr key={index}>
              <td>{esperto.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/inserimento-esperti-allenamento">Inserisci un nuovo esperto</Link>
    </div>
  );
};

export default EspertiAllenamento;
