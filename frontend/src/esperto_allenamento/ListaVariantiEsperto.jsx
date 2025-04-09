import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ListaVariantiEsperto = () => {
  const [varianti, setVarianti] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchVarianti = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/varianti");
      const data = await res.json();

      // Filtra varianti approvate
      const nonApprovate = data.filter(
        (v) => !v.validazione || v.validazione.stato !== "approvata"
      );

      setVarianti(nonApprovate);
    } catch (err) {
      console.error("Errore nel caricamento delle varianti:", err);
    } finally {
      setLoading(false);
    }
  };

  const validaVariante = async (id, stato, messaggio) => {
    try {
      const res = await fetch(`http://localhost:3001/api/varianti/${id}/valida`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ stato, messaggio }),
      });

      if (res.ok) {
        const variante = varianti.find((v) => v._id === id);

        if (stato === "approvata") {
          // Reindirizza a modifica-esercizio con variante
          navigate("/modifica-esercizio", { state: variante });
        } else {
          // Rimuove dalla lista le scartate
          fetchVarianti();
        }
      }
    } catch (err) {
      console.error("Errore nella validazione:", err);
    }
  };

  useEffect(() => {
    fetchVarianti();
  }, []);

  if (loading) return <p>Caricamento varianti...</p>;

  return (
    <div>
      <h2>Lista Varianti Generate dagli Utenti</h2>
      {varianti.length === 0 ? (
        <p>Nessuna variante disponibile.</p>
      ) : (
        varianti.map((v) => (
          <div
            key={v._id}
            style={{ border: "1px solid #ccc", padding: "1rem", margin: "1rem 0" }}
          >
            <h3>{v.nome}</h3>
            <p>{v.descrizione}</p>

            {v.validazione && (
              <p>
                <strong>Stato:</strong> {v.validazione.stato} <br />
                <strong>Messaggio:</strong> {v.validazione.messaggio}
              </p>
            )}

            <div style={{ marginTop: "0.5rem" }}>
              <button
                onClick={() =>
                  validaVariante(v._id, "approvata", "La variante è stata trasformata in esercizio.")
                }
              >
                ✅ Approva
              </button>
              <button
                style={{ marginLeft: "1rem" }}
                onClick={() => validaVariante(v._id, "scartata", "La variante non è idonea.")}>
                ❌ Scarta
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ListaVariantiEsperto;
