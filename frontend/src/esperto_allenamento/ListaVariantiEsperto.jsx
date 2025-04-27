import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ListaVariantiEsperto.module.css";
import ErrorMessage from "../components/ErrorMessage";

const ListaVariantiEsperto = () => {
  const [varianti, setVarianti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchVarianti = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:3001/api/varianti");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Errore sconosciuto nel caricamento delle varianti");
      }

      const nonApprovate = data.filter(
        (v) => !v.validazione || (v.validazione.stato !== "approvata" && v.validazione.stato !== "scartata")
      );
      

      setVarianti(nonApprovate);
    } catch (err) {
      console.error("Errore nel caricamento delle varianti:", err);
      setError(err.message);
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

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Errore durante la validazione della variante");
      }

      const variante = varianti.find((v) => v._id === id);

      if (stato === "approvata") {
        navigate("/modifica-esercizio", { state: variante });
      } else {
        fetchVarianti();
      }
    } catch (err) {
      console.error("Errore nella validazione:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchVarianti();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (loading) return <p>Caricamento varianti...</p>;

  return (
    <div className={styles.listaVariantiContainer}>
      <h2 className={styles.titoloPagina}>Lista Varianti Generate dagli Utenti</h2>
      <ErrorMessage message={error} />

      {varianti.length === 0 ? (
        <p className={styles.noVarianti}>Nessuna variante disponibile.</p>
      ) : (
        varianti.map((v) => (
          <div key={v._id} className={styles.varianteCard}>
            <h3>{v.nome}</h3>
            <p>{v.descrizione}</p>

            {v.validazione && (
              <p>
                <strong>Stato:</strong> {v.validazione.stato} <br />
                <strong>Messaggio:</strong> {v.validazione.messaggio}
              </p>
            )}

            <div className={styles.bottoniContainer}>
              <button
                className={styles.approvaButton}
                onClick={() =>
                  validaVariante(v._id, "approvata", "La variante è stata trasformata in esercizio.")
                }
              >
                ✅ Approva
              </button>
              <button
                className={styles.scartaButton}
                onClick={() => validaVariante(v._id, "scartata", "La variante non è idonea.")}
              >
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