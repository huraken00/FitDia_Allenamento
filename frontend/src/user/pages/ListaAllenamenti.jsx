import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./ListaAllenamenti.module.css";
import ErrorMessage from "../../components/ErrorMessage";

const ListaAllenamenti = () => {
  const [allenamenti, setAllenamenti] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllenamenti();
  }, []);

  const fetchAllenamenti = async () => {
    try {
      const utenteId = localStorage.getItem("userId");

      if (!utenteId) {
        throw new Error("ID utente non trovato nel localStorage");
      }

      const res = await fetch(`http://localhost:3001/api/allenamenti/${utenteId}`);

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setAllenamenti(data);
      
    } catch (err) {

      setError(err.message);
    }
  };

  const handleEliminaAllenamento = async (id) => {
    const conferma = window.confirm("Vuoi eliminare questo allenamento?");
    if (!conferma) return;
  
    try {
      const res = await fetch(`http://localhost:3001/api/allenamenti/${id}`, {
        method: "DELETE",
      });
  
      const data = await res.json();
  
      if (res.ok) {
        setAllenamenti((prev) => prev.filter((a) => a._id !== id));
        alert("Allenamento eliminato");
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };
  

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Lista degli Allenamenti</h3>

      {/* Mostra l'errore se presente */}
      <ErrorMessage message={error} />

      {allenamenti.length === 0 && !error && (
        <p>Nessun allenamento disponibile.</p>
      )}

      <ul className={styles.list}>
        {allenamenti.map((allenamento) => (
          <li key={allenamento._id} className={styles.listItem}>
            <div className={styles.itemContent}>
              {allenamento.nome}{" "}
              <span className={styles.date}>
                {new Date(allenamento.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className={styles.buttonGroup}>
              <Link to={`/modifica-allenamento/${allenamento._id}`} className={styles.link}>
                <button className={styles.button}>Modifica</button>
              </Link>
              <Link to={`/dettagli-allenamento/${allenamento._id}`} className={styles.link}>
                <button className={styles.button}>Visualizza</button>
              </Link>
              <button
                onClick={() => handleEliminaAllenamento(allenamento._id)}
                className={styles.deleteButton}
              >
                Elimina
              </button>
            </div>
          </li>
        )).reverse()}
      </ul>
    </div>
  );
};

export default ListaAllenamenti;
