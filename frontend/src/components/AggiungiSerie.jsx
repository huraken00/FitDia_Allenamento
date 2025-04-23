import React, { useState } from "react";
import styles from "./AggiungiSerie.module.css"; // Importa il modulo di stile
import CercaEsercizio from "./CercaEsercizio";
import ErrorMessage from "./ErrorMessage";
import { Error } from "mongoose";

const AggiungiSerie = ({ allenamentoId, onSerieAggiunta }) => {
  const [serie, setSerie] = useState({
    peso: "",
    distanza: "",
    durata: "",
    ripetizioni: "",
    esercizio: "",
    nomeEsercizio: "",
    sport: [],
  });

  const [parametriDisponibili, setParametriDisponibili] = useState([]);
  const [sportDisponibili, setSportDisponibili] = useState([]);
  const [error, setError] = useState("");

  const handleSelectExercise = async (exercise) => {
    setSerie((prev) => ({
      ...prev,
      esercizio: exercise._id,
      nomeEsercizio: exercise.nome,
    }));

    try {
      const res = await fetch(`http://localhost:3001/api/serie/esercizio/${exercise._id}`);
      const data = await res.json();
       if (!res.ok) throw new Error(data.message)
      if (!data.parametri || !Array.isArray(data.parametri)) {
        setParametriDisponibili([]);
        setSportDisponibili([]);
        return;
      }

      setParametriDisponibili(data.parametri);
      setSportDisponibili(data.sport || []);
      setSerie((prev) => ({
        ...prev,
        sport: data.sport || [],
      }));
    } catch (err) {
      setError(err.message)
      setParametriDisponibili([]);
      setSportDisponibili([]);
    }
  };

  const handleAggiungiSerie = async () => {
    if (!serie.esercizio) {
      setError("Seleziona un esercizio!");
      return;
    }else{
      setError("")
    }

    try {
      const response = await fetch("http://localhost:3001/api/serie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Peso: serie.peso ? Number(serie.peso) : null,
          Distanza: serie.distanza ? Number(serie.distanza) : null,
          Durata: serie.durata ? Number(serie.durata) : null,
          Ripetizioni: serie.ripetizioni ? Number(serie.ripetizioni) : null,
          id_allenamento: allenamentoId,
          id_esercizio: serie.esercizio,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        onSerieAggiunta({
          ...data,
          esercizio: serie.nomeEsercizio,
          sport: serie.sport,
          parametri: parametriDisponibili.map(p => ({
            nome: p.nome,
            valore: data[p.nome] ?? ""
          })),
        });

        setSerie({
          peso: "",
          distanza: "",
          durata: "",
          ripetizioni: "",
          esercizio: serie.esercizio,
          nomeEsercizio: serie.nomeEsercizio,
          sport: serie.sport,
        });
      } else {
        throw new Error(data.message)
      }
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <div className={styles.aggiungiSerieContainer}>
      <h3>Aggiungi Serie</h3>
     
      {/* Selezione Esercizio */}
      <label htmlFor="esercizio">Esercizio:</label>
      <CercaEsercizio onSelect={handleSelectExercise} />

      {/* Parametri */}
      <div className={styles.parametriContainer}>
        {parametriDisponibili.map((parametro) => (
          <div key={parametro.nome} className={styles.parametro}>
            <label htmlFor={parametro.nome}>{parametro.nome || "Nome non disponibile"}:</label>
            <input
              type="number"
              name={parametro.nome ? parametro.nome.toLowerCase() : ""}
              value={serie[parametro.nome ? parametro.nome.toLowerCase() : ""] || ""}
              onChange={(e) => setSerie((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
              min="1"
              required
              id={parametro.nome}
            />
          </div>
        ))}
      </div>

      {/* Sport Associati */}
      {sportDisponibili.length > 0 && (
        <div className={styles.sportAssociati}>
          <strong>Sport Associati:</strong>
          <ul>
            {sportDisponibili.map((sport, index) => (
              <li key={index}>{sport}</li>
            ))}
          </ul>
        </div>
      )}
    <ErrorMessage message={error}/>
      {/* Bottone per aggiungere serie */}
      <button type="button" className={styles.btnAggiungi} onClick={handleAggiungiSerie}>
        Aggiungi Serie
      </button>

     
    </div>
  );
};

export default AggiungiSerie;
