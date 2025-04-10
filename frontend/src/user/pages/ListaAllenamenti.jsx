import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./ListaAllenamenti.module.css"; // Assicurati di avere il CSS appropriato

const ListaAllenamenti = () => {
  const [allenamenti, setAllenamenti] = useState([]);

  useEffect(() => {
    fetchAllenamenti();
  }, []);

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

  const handleEliminaAllenamento = async (id) => {
    const conferma = window.confirm("Vuoi eliminare questo allenamento?");
    if (!conferma) return;

    try {
      const res = await fetch(`http://localhost:3001/api/allenamenti/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setAllenamenti((prev) => prev.filter((a) => a._id !== id));
        alert("Allenamento eliminato");
      } else {
        alert("Allenamento non eliminato");
        const data = await res.json();
        console.log(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Lista degli Allenamenti</h3>
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
              </Link>{" "}
              <Link to={`/dettagli-allenamento/${allenamento._id}`} className={styles.link}>
                <button className={styles.button}>Visualizza Allenamento</button>
              </Link>
              <button
                onClick={() => handleEliminaAllenamento(allenamento._id)}
                className={styles.deleteButton}
              >
                Elimina Allenamento
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaAllenamenti;

