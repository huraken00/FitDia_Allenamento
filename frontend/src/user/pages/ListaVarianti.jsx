import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./ListaVarianti.module.css"; // Importa il modulo CSS

const ListaVarianti = () => {
  const [varianti, setVarianti] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchVarianti = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/varianti/utente/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Errore nel recupero delle varianti: ${res.status}`);
        }

        const data = await res.json();
        setVarianti(data);
      } catch (err) {
        console.error("Errore nel recupero delle varianti:", err);
      }
    };

    if (userId) {
      fetchVarianti();
    } else {
      console.log("User ID non trovato");
    }
  }, [userId]);

  return (
    <div className={styles.listaVariantiContainer}>
     

      <h2>Le mie varianti generate</h2>

      {varianti.length === 0 ? (
        <p className={styles.noVarianti}>Nessuna variante disponibile.</p>
      ) : (
        varianti.map((v) => (
          <div key={v._id} className={styles.varianteCard}>
            <h4>{v.nome}</h4>
            <p>{v.descrizione}</p>

            <p>
              <strong className={styles.statoApprovazione}>Stato:</strong>
              {v.validazione?.stato ? (
                <span
                  className={`${styles.statoApprovazione} ${
                    v.validazione.stato === "approvata" ? "approvata" : "scartata"
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
