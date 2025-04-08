import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ListaAllenamenti = () => {
  const [allenamenti, setAllenamenti] = useState([]);

  // Funzione per recuperare gli allenamenti
  useEffect(() => {
    fetchAllenamenti();
  }, []);

  // Funzione per caricare gli allenamenti
  const fetchAllenamenti = async () => {
    try {
      const utenteId = localStorage.getItem("userId");

      if (!utenteId) {
        throw new Error("ID utente non trovato");
      }

      console.log("Fetching allenamenti per utente:", utenteId); // DEBUG

      const res = await fetch(`http://localhost:3001/api/allenamenti/${utenteId}`);

      if (!res.ok) {
        throw new Error("Errore nel recupero degli allenamenti");
      }

      const data = await res.json();
      console.log("Allenamenti ricevuti:", data); // DEBUG
      setAllenamenti(data);
    } catch (err) {
      console.error("Errore nel recupero degli allenamenti:", err);
    }
  };

  return (
    <div>
      <Link to={`/profilo`}>
                        <button>Profilo</button>
                      </Link>
      <h3>Lista degli Allenamenti</h3>
      {allenamenti.map((allenamento) => (
        <li key={allenamento._id}>
          {allenamento.nome}{" "}
          <Link to={`/modifica-allenamento/${allenamento._id}`}>
            <button>Modifica</button>
          </Link>{" "}
          <Link to={`/dettagli-allenamento/${allenamento._id}`}>
            <button>Avvia Allenamento</button>
          </Link>
        </li>
      ))}
    </div>
  );
}
export default ListaAllenamenti;
