import React, { useState} from "react";
import CercaEsercizio from "./CercaEsercizio";
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
  const [error, setError] = useState(null);

  // Gestione del cambiamento dell'esercizio
  const handleSelectExercise = async (exercise) => {
    // Imposta l'esercizio selezionato nello stato
    setSerie((prev) => ({
      ...prev,
      esercizio: exercise._id,
      nomeEsercizio: exercise.nome,
    }));

    try {
      // Recupera i parametri e gli sport per l'esercizio selezionato
      const res = await fetch(`http://localhost:3001/api/serie/esercizio/${exercise._id}`);
      const data = await res.json();

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
      console.error("Errore nel recupero dei parametri:", err);
      setParametriDisponibili([]);
      setSportDisponibili([]);
    }
  };

  // Gestione dell'aggiunta della serie
  const handleAggiungiSerie = async () => {
    if (!serie.esercizio) {
      setError("Seleziona un esercizio!")
      
      return;
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
        // Trova il nome dell'esercizio selezionato dalla lista degli esercizi

        onSerieAggiunta({
          ...data,
          esercizio: serie.nomeEsercizio,
          sport: serie.sport,
          parametri: parametriDisponibili.map(p => ({
            nome: p.nome,
            valore: data[p.nome] ?? ""
          })),
        });
        

        // Resetta i campi della serie
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
        setError(data.message || "Errore nell'aggiunta della serie");
      }
    } catch (err) {
      setError("Errore nel salvataggio della serie.");
      console.error(err);
    }
  };

  return (
    <div className="aggiungi-serie-container">
      <h3>Aggiungi Serie</h3>
      
      {/* Selezione Esercizio */}
      <label htmlFor="esercizio">Esercizio:</label>
      <CercaEsercizio onSelect={handleSelectExercise} />

      {/* Parametri */}
      <div className="parametri-container">
        {parametriDisponibili.map((parametro) => (
          <div key={parametro.nome} className="parametro">
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
        <div className="sport-associati">
          <strong>Sport Associati:</strong>
          <ul>
            {sportDisponibili.map((sport, index) => (
              <li key={index}>{sport}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Bottone per aggiungere serie */}
      <button type="button" className="btn-aggiungi" onClick={handleAggiungiSerie}>
        Aggiungi Serie
      </button>

      {/* Messaggio di errore */}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default AggiungiSerie;
