import React, { useEffect, useState } from "react";

const ListaVarianti = () => {
  const [varianti, setVarianti] = useState([]);
  const userId = localStorage.getItem("userId"); // Assumi che l'ID dell'utente sia memorizzato nel localStorage

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
    <div className="lista-varianti">
      <h2>Le mie varianti generate</h2>
      {varianti.length === 0 ? (
        <p>Nessuna variante disponibile.</p>
      ) : (
        varianti.map((v) => (
          <div key={v._id} className="variante-card">
            <h4>{v.nome}</h4>
            <p>{v.descrizione}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ListaVarianti;
