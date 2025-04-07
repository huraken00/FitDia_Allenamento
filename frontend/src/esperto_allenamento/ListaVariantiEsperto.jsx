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
      setVarianti(data);
    } catch (err) {
      console.error("Errore nel caricamento delle varianti:", err);
    } finally {
      setLoading(false);
    }
  };

  const eliminaVariante = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/api/varianti/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.ok) {
        setVarianti((prev) => prev.filter((v) => v._id !== id));
      } else {
        console.error("Errore nell'eliminazione");
      }
    } catch (err) {
      console.error("Errore nell'eliminazione:", err);
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
          <div key={v._id} style={{ border: "1px solid #ccc", padding: "1rem", margin: "1rem 0" }}>
            <h3>{v.nome}</h3>
            <p>{v.descrizione}</p>
            <div>
              <button onClick={() => navigate("/modifica-esercizio", { state: v })}>
                ✏️ Modifica e Valida
              </button>
              <button
                onClick={() => eliminaVariante(v._id)}
                style={{ marginLeft: "1rem", color: "red" }}
              >
                🗑️ Scarta
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ListaVariantiEsperto;
