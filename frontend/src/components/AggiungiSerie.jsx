import { useState, useEffect } from "react";

const AggiungiSerie = ({ allenamentoId, onSerieAggiunta }) => {
  const [serie, setSerie] = useState({
    peso: "",
    distanza: "",
    durata: "",
    ripetizioni: "",
    esercizio: "",
    sport: [],
  });

  const [esercizi, setEsercizi] = useState([]);
  const [parametriDisponibili, setParametriDisponibili] = useState([]);
  const [sportDisponibili, setSportDisponibili] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEsercizi = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/esercizi");
        const data = await res.json();
        setEsercizi(data);
      } catch (err) {
        console.error("Errore nel recupero degli esercizi:", err);
      }
    };
    fetchEsercizi();
  }, []);

  const handleSerieChange = async (e) => {
    const { name, value } = e.target;
    setSerie((prev) => ({ ...prev, [name]: value }));

    if (name === "esercizio") {
      try {
        const res = await fetch(`http://localhost:3001/api/serie/esercizio/${value}`);
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
          nomeEsercizio: data.nomeEsercizio,
          sport: data.sport || [],
        }));
      } catch (err) {
        console.error("Errore nel recupero dei parametri:", err);
        setParametriDisponibili([]);
        setSportDisponibili([]);
      }
    }
  };

  const handleAggiungiSerie = async () => {
    if (!serie.esercizio) {
      alert("Seleziona un esercizio!");
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
        // Trova l'esercizio selezionato
        const esercizioSelezionato = esercizi.find(e => e._id === serie.esercizio);
  
        // Passa i dati della serie aggiunta con l'esercizio completo (incluso nome)
        onSerieAggiunta({
          ...data,
          id_esercizio: {
            _id: serie.esercizio,
            nome: esercizioSelezionato ? esercizioSelezionato.nome : "Sconosciuto",
          },
          sport: serie.sport,
        });
  
        setSerie({
          peso: "",
          distanza: "",
          durata: "",
          ripetizioni: "",
          esercizio: serie.esercizio,
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
    <div>
      <h3>Aggiungi Serie</h3>
      <label>Esercizio:</label>
      <select name="esercizio" value={serie.esercizio} onChange={handleSerieChange}>
        <option value="">Seleziona Esercizio</option>
        {esercizi.map((esercizio) => (
          <option key={esercizio._id} value={esercizio._id}>
            {esercizio.nome}
          </option>
        ))}
      </select>

      {parametriDisponibili.map((parametro) => (
  <div key={parametro.nome}>
    <label>{parametro.nome ? parametro.nome : "Nome non disponibile"}:</label>
    <input
      type="number"
      name={parametro.nome ? parametro.nome.toLowerCase() : ""}
      value={serie[parametro.nome ? parametro.nome.toLowerCase() : ""] || ""}
      onChange={handleSerieChange}
      min="1"
      required
    />
  </div>
))}


      {sportDisponibili.length > 0 && (
        <div>
          <strong>Sport Associati:</strong>
          <ul>
            {sportDisponibili.map((sport, index) => (
              <li key={index}>{sport}</li>
            ))}
          </ul>
        </div>
      )}

      <button type="button" onClick={handleAggiungiSerie}>Aggiungi Serie</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default AggiungiSerie;
