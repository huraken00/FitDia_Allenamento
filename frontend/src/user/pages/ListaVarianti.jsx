import React, { useEffect, useState } from "react";
import styles from "./ListaVarianti.module.css";
import ErrorMessage from "../../components/ErrorMessage"; // importa il componente

const ListaVarianti = () => {
  const [varianti, setVarianti] = useState([]);
  const [filter, setFilter] = useState("tutte");
  const [error, setError] = useState(""); // nuovo stato per errore
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchVarianti = async () => {
      try {
      
        const res = await fetch(`http://localhost:3001/api/varianti/utente/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        if(!res.ok) throw new Error(data.message)
        setVarianti(data);
       
      } catch (err) {
        console.log("Erroree",err.message)
        setError(err.message);
      }
    };

    if (userId) {
      fetchVarianti();
    } else {
      setError("User ID non trovato");
    }
  }, [userId]);

  const filteredVarianti = varianti.filter((v) => {
    const stato = v.validazione?.stato;
    if (filter === "validate") return stato === "approvata";
    if (filter === "nonValidate") return !stato;
    if (filter === "rifiutate") return stato === "scartata";
    return true;
  });

  return (
    <div className={styles.listaVariantiContainer}>
      <h2>Le mie varianti generate</h2>

      {/* Mostra l'errore se presente */}
      <ErrorMessage message={error} />

      <div className={styles.filtroContainer}>
        <label htmlFor="filter">Filtra per stato:</label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={styles.selectFiltro}
        >
          <option value="tutte">Tutte</option>
          <option value="validate">Solo approvate</option>
          <option value="nonValidate">In attesa di validazione</option>
          <option value="rifiutate">Solo rifiutate</option>
        </select>
      </div>

      {/* Mostra messaggio se non ci sono varianti e nessun errore */}
      {filteredVarianti.length === 0 && !error ? (
        <p className={styles.noVarianti}>Nessuna variante disponibile.</p>
      ) : (
        filteredVarianti.map((v) => (
          <div key={v._id} className={styles.varianteCard}>
            <h4>{v.nome}</h4>
            <p>{v.descrizione}</p>

            <p>
              <strong className={styles.statoApprovazione}>Stato:</strong>{" "}
              {v.validazione?.stato ? (
                <span
                  className={`${styles.statoApprovazione} ${
                    v.validazione.stato === "approvata"
                      ? "approvata"
                      : v.validazione.stato === "scartata"
                      ? "scartata"
                      : ""
                  }`}
                >
                  {v.validazione.stato.toUpperCase()}
                </span>
              ) : (
                "In attesa di validazione"
              )}
            </p>

            {v.validazione?.messaggio && (
              <p className={styles.messaggioEsperto}>
                <strong>Messaggio dell'esperto:</strong> {v.validazione.messaggio}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ListaVarianti;
