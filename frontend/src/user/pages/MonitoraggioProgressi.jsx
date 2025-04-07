import { useEffect, useState } from "react";
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
  const [esercizi, setEsercizi] = useState([]);
  const [selectedEsercizio, setSelectedEsercizio] = useState("");
  const [dati, setDati] = useState([]);
  const [nomeEsercizio, setNomeEsercizio] = useState("");
  const [selectedParametro, setSelectedParametro] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Nuove variabili per la gestione delle date
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  
  // Supponiamo che l'ID dell'utente venga recuperato da una variabile globale o un contesto
  const userId = localStorage.getItem('userId'); // O tramite un context, o una variabile di stato

  // Fetch lista esercizi
  useEffect(() => {
    const fetchEsercizi = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/esercizi");
        const data = await res.json();
        setEsercizi(data || []);
      } catch (err) {
        setError("Errore nel recupero degli esercizi.");
      }
    };

    fetchEsercizi();
  }, []);

  // Fetch dati progresso quando cambia esercizio selezionato o periodo
  useEffect(() => {
    if (!selectedEsercizio || !userId) return;  // Aggiungi controllo per l'ID utente

    const fetchProgressi = async () => {
      setLoading(true);
      setError("");
      try {
        const queryParams = new URLSearchParams();
        if (fromDate) queryParams.append("from", fromDate);
        if (toDate) queryParams.append("to", toDate);

        // Includi l'ID dell'utente e le date selezionate nella URL
        const res = await fetch(`http://localhost:3001/api/esercizi/progressi-esercizio/${selectedEsercizio}/${userId}?${queryParams.toString()}`);
        const data = await res.json();
        if (res.ok) {
          setDati(data.dati || []);
          setNomeEsercizio(data.nomeEsercizio || "Esercizio");
          setSelectedParametro(""); // Reset parametro quando si cambia esercizio
        } else {
          setError(data.message || "Errore nel recupero dei progressi");
        }
      } catch (err) {
        setError("Errore nel fetch dei progressi.");
      } finally {
        setLoading(false);
      }
    };

    fetchProgressi();
  }, [selectedEsercizio, userId, fromDate, toDate]);  // Aggiungi fromDate e toDate come dipendenze

  // Parametri allenanti disponibili
  const parametriAllenanti = dati.length > 0
    ? Object.keys(dati[0]).filter((key) => key !== "data")
    : [];

  return (
    <div style={{ padding: "1rem" }}>
      <h2>📊 Monitoraggio Progressi</h2>

      {/* Select esercizio */}
      <label>
        <strong>Seleziona un esercizio:</strong>
        <select
          value={selectedEsercizio}
          onChange={(e) => setSelectedEsercizio(e.target.value)}
        >
          <option value="">-- Scegli --</option>
          {esercizi.map((ex) => (
            <option key={ex._id} value={ex._id}>
              {ex.nome}
            </option>
          ))}
        </select>
      </label>

      {/* Select parametro */}
      {dati.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <label>
            <strong>Parametro da visualizzare:</strong>
            <select
              value={selectedParametro}
              onChange={(e) => setSelectedParametro(e.target.value)}
            >
              <option value="">-- Scegli --</option>
              {parametriAllenanti.map((param) => (
                <option key={param} value={param}>
                  {param}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {/* Select periodo temporale */}
      <div style={{ marginTop: "1rem" }}>
        <label>
          <strong>Data Inizio:</strong>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </label>
        <label style={{ marginLeft: "1rem" }}>
          <strong>Data Fine:</strong>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </label>
      </div>

      {/* Visualizza stato di caricamento o errori */}
      {loading && <p>Caricamento progressi...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Grafico */}
      {selectedParametro && dati.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h3>📈 Progressi di {nomeEsercizio} - {selectedParametro}</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={dati}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey={selectedParametro}
                stroke="#8884d8"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default MonitoraggioProgressi;
