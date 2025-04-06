import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Importiamo useNavigate
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

const MonitoraggioProgressi = () => {
  const { id } = useParams(); // id dell'esercizio
  const navigate = useNavigate(); // per navigare tra le pagine
  const [dati, setDati] = useState([]); // Dati dei progressi
  const [nomeEsercizio, setNomeEsercizio] = useState(""); // Nome dell'esercizio
  const [loading, setLoading] = useState(true); // Stato di caricamento
  const [error, setError] = useState(""); // Stato per gli errori
  const [esercizi, setEsercizi] = useState([]); // Lista degli esercizi
  const [selectedEsercizio, setSelectedEsercizio] = useState(null); // Esercizio selezionato

  // Fetch per ottenere la lista degli esercizi
  useEffect(() => {
    const fetchEsercizi = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/esercizi");
        const data = await res.json();

        if (res.ok) {
          setEsercizi(data || []);
        } else {
          setError(data.message || "Errore nel recupero degli esercizi");
        }
      } catch (err) {
        setError("Errore nel fetch degli esercizi: " + err.message);
      }
    };

    fetchEsercizi();
  }, []);

  // Fetch dei progressi per l'esercizio selezionato
  useEffect(() => {
    if (!id) return;

    const fetchProgressi = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`http://localhost:3001/api/esercizi/progressi-esercizio/${id}`);
        const data = await res.json();

        if (res.ok) {
          setDati(data.dati || []);
          setNomeEsercizio(data.nomeEsercizio || "Esercizio");
        } else {
          setError(data.message || "Errore nel recupero dei progressi");
        }
      } catch (err) {
        setError("Errore nel fetch dei progressi: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressi();
  }, [id]);

  const handleSelectEsercizio = (esercizioId) => {
    setSelectedEsercizio(esercizioId);
    // Naviga alla pagina dei progressi dell'esercizio selezionato usando navigate
    navigate(`/monitoraggio-progressi/${esercizioId}`);
  };

  if (esercizi.length === 0) return <p>Caricamento esercizi...</p>;

  if (!selectedEsercizio) {
    return (
      <div>
        <h2>Seleziona un esercizio per visualizzare i progressi:</h2>
        <ul>
          {esercizi.map((esercizio) => (
            <li key={esercizio._id}>
              <button onClick={() => handleSelectEsercizio(esercizio._id)}>
                {esercizio.nome}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (loading) return <p>Caricamento dei progressi...</p>;

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  if (dati.length === 0) return <p>Nessun progresso registrato per questo esercizio...</p>;

  // Ottieni i parametri dinamici per l'esercizio (escludi la "data")
  const parametriAllenanti = Object.keys(dati[0]).filter((key) => key !== "data");

  return (
    <div style={{ padding: "1rem" }}>
      <h2>📈 Progressi per: {nomeEsercizio}</h2>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={dati}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="data" />
          <YAxis />
          <Tooltip />
          <Legend />
          {parametriAllenanti.map((param, index) => (
            <Line
              key={param}
              type="monotone"
              dataKey={param}
              stroke={`hsl(${index * 80}, 70%, 50%)`} // Colore dinamico per ogni parametro
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonitoraggioProgressi;
