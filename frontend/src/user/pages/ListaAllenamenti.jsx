import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./ListaAllenamenti.module.css";

const ListaAllenamenti = () => {
  const [allenamenti, setAllenamenti] = useState([]);

  useEffect(() => {
    fetchAllenamenti();
  }, []);

  const fetchAllenamenti = async () => {
    try {
      const utenteId = localStorage.getItem("userId");
      if (!utenteId) throw new Error("ID utente non trovato");
      const res = await fetch(`http://localhost:3001/api/allenamenti/${utenteId}`);
      if (!res.ok) throw new Error("Errore nel recupero degli allenamenti");
      const data = await res.json();
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
        setAllenamenti(prev => prev.filter(a => a._id !== id));
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
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Data Creazione</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {allenamenti.map((a) => (
            <tr key={a._id} className={styles.listItem}>
              <td className={styles.itemContent}>{a.nome}</td>
              <td className={styles.date}>
                {new Date(a.createdAt).toLocaleDateString()}
              </td>
              <td className={styles.actionCell}>
                <Link
                  to={`/modifica-allenamento/${a._id}`}
                  className={styles.actionLink}
                >
                  <button className={styles.button}>Modifica</button>
                </Link>
                <Link
                  to={`/dettagli-allenamento/${a._id}`}
                  className={styles.actionLink}
                >
                  <button className={styles.button}>Visualizza</button>
                </Link>
                <button
                  onClick={() => handleEliminaAllenamento(a._id)}
                  className={styles.button}
                >
                  Elimina
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaAllenamenti;