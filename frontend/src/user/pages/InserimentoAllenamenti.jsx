import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const InserimentoAllenamenti = () => {
  const navigate = useNavigate();
  const utenteId = localStorage.getItem("userId");

  const [allenamento, setAllenamento] = useState({
    nome: "",
    appuntiAllenamento: "",
    serie: [],
  });

  const [serie, setSerie] = useState({
    peso: "",
    distanza: "",
    durata: "",
    ripetizioni: "",
    esercizio: "",
    sport: [],
  });

  const [esercizi, setEsercizi] = useState([]);
  const [error, setError] = useState(null);
  const [parametriDisponibili, setParametriDisponibili] = useState([]);
  const [sportDisponibili, setSportDisponibili] = useState([]);

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


  const handleAllenamentoChange = (e) => {
    const { name, value } = e.target;
    setAllenamento((prev) => ({ ...prev, [name]: value }));
  };

  const handleSerieChange = async (e) => {
    const { name, value } = e.target;
    setSerie((prev) => ({ ...prev, [name]: value }));
  
    if (name === "esercizio") {
      try {
        const res = await fetch(`http://localhost:3001/api/esercizi-parametri/${value}`);
        const data = await res.json();
  
        console.log("Dati ricevuti:", data);  // Aggiungi il log per vedere cosa arriva
  
        if (!data.parametri || !Array.isArray(data.parametri)) {
          console.error("Formato dati errato:", data);
          setParametriDisponibili([]);
          setSportDisponibili([]); // Reset sport se i dati sono errati
          return;
        }
  
        setParametriDisponibili(data.parametri);
        setSportDisponibili(data.sport || []);  // Gestisci più sport come array
        setSerie((prev) => ({
          ...prev,
          nomeEsercizio: data.nomeEsercizio,
          sport: data.sport || [],  // Assicurati di gestire correttamente gli sport
        }));
      } catch (err) {
        console.error("Errore nel recupero dei parametri:", err);
        setParametriDisponibili([]);
        setSportDisponibili([]); // Reset sport in caso di errore
      }
    }
  };

  const handleAggiungiSerie = async () => {
    if (!serie.esercizio) {
      alert("Seleziona un esercizio!");
      return;
    }

    if (!allenamento._id) {
      alert("Devi creare prima l'allenamento!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/serie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          peso: serie.peso ? Number(serie.peso) : null,
          distanza: serie.distanza ? Number(serie.distanza) : null,
          durata: serie.durata ? Number(serie.durata) : null,
          ripetizioni: serie.ripetizioni ? Number(serie.ripetizioni) : null,
          id_allenamento: allenamento._id,
          id_esercizio: serie.esercizio, // ID esercizio
        }),
      });

      const data = await response.json();
      if (response.ok) {
        const esercizioSelezionato = esercizi.find(e => e._id === serie.esercizio);

        setAllenamento((prev) => ({
          ...prev,
          serie: [
            ...prev.serie,
            {
              ...data,
              id_esercizio: {
                _id: serie.esercizio,
                nome: esercizioSelezionato ? esercizioSelezionato.nome : "Sconosciuto",
              },
              sport: serie.sport,  // Assicurati di aggiungere lo sport alla serie
            },
          ],
        }));
        setSerie({ peso: "", distanza: "", durata: "", ripetizioni: "", esercizio: "", sport: [] });
      } else {
        setError(data.message || "Errore nell'aggiunta della serie");
      }
    } catch (err) {
      setError("Errore nel salvataggio della serie.");
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!utenteId) {
      console.error("ID utente non disponibile");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/api/allenamenti/${utenteId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: allenamento.nome,
          appuntiAllenamento: allenamento.appuntiAllenamento,
          id_utente: utenteId,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log("Allenamento creato:", data);
        setAllenamento((prev) => ({ ...prev, _id: data.allenamento._id }));
      } else {
        setError(data.message || "Errore nella creazione dell'allenamento");
      }
    } catch (err) {
      setError("Errore nel salvataggio dell'allenamento.");
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Crea Nuovo Allenamento</h2>
      <form onSubmit={handleSubmit}>
        <label>Nome Allenamento:</label>
        <input type="text" name="nome" value={allenamento.nome} onChange={handleAllenamentoChange} required />

        <label>Appunti Allenamento:</label>
        <textarea name="appuntiAllenamento" value={allenamento.appuntiAllenamento} onChange={handleAllenamentoChange} />

        <button type="submit">Crea Allenamento</button>
      </form>

      {allenamento._id && (
        <>
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
          {/*mostra i parametri associati */}
          {parametriDisponibili.length > 0 && (
        <div>
          <strong>Parametri:</strong>
          {parametriDisponibili.map((parametro) => (
            <div key={parametro.nome}>
              <label>{parametro.nome}:</label>
              <input
                type="number"
                name={parametro.nome.toLowerCase()}
                value={serie[parametro.nome.toLowerCase()] || ""}
                onChange={handleSerieChange}
              />
            </div>
          ))}
        </div>
      )}
          {/* Mostra gli sport selezionati */}
          {sportDisponibili.length > 0 && (
            <div>
              <strong>Sport Associati:</strong>
              <ul>
                {sportDisponibili.map((sport, index) => (
                  <li key={index}>{sport}</li> // Mostra ogni sport in un elemento <li>
                ))}
              </ul>
            </div>
          )}

          <button type="button" onClick={handleAggiungiSerie}>
            Aggiungi Serie
          </button>
        </>
      )}

      <div>
        <h3>Serie Aggiunte:</h3>
        <ul>
          {allenamento.serie.map((s, index) => (
            <li key={index}>
              <p>
                <strong>Esercizio:</strong> {s.id_esercizio?.nome || "Sconosciuto"} <br />
                <strong>Sport:</strong> {s.sport.join(", ") || "Sconosciuto"} <br /> {/* Visualizza sport come elenco separato da virgola */}
                {s.peso && <><strong>Peso:</strong> {s.peso} kg <br /></>}
                {s.distanza && <><strong>Distanza:</strong> {s.distanza} m <br /></>}
                {s.durata && <><strong>Durata:</strong> {s.durata} sec <br /></>}
                {s.ripetizioni && <><strong>Ripetizioni:</strong> {s.ripetizioni} <br /></>}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <button onClick={() => navigate("/dashboard-allenamento")}>Termina</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default InserimentoAllenamenti;
