import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
    <div className="lista-varianti" style={{ padding: "1rem" }}>
      <Link to="/profilo">
        <button>🔙 Torna al Profilo</button>
      </Link>

      <h2>Le mie varianti generate</h2>

      {varianti.length === 0 ? (
        <p>Nessuna variante disponibile.</p>
      ) : (
        varianti.map((v) => (
          <div
            key={v._id}
            className="variante-card"
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            <h4>{v.nome}</h4>
            <p>{v.descrizione}</p>

            <p>
              <strong>Stato:</strong>{" "}
              {v.validazione?.stato ? (
                <span style={{ color: v.validazione.stato === "approvata" ? "green" : "red" }}>
                  {v.validazione.stato.toUpperCase()}
                </span>
              ) : (
                "In attesa di validazione"
              )}
            </p>

            {v.validazione?.messaggio && (
              <p>
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
