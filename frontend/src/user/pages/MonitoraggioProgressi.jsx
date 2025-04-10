import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import styles from "./MonitoraggioProgressi.module.css"; // Importa il modulo CSS

const MonitoraggioProgressi = () => {
  const [esercizi, setEsercizi] = useState([]);
  const [selectedEsercizio, setSelectedEsercizio] = useState("");
  const [dati, setDati] = useState([]);
  const [nomeEsercizio, setNomeEsercizio] = useState("");
  const [selectedParametro, setSelectedParametro] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const userId = localStorage.getItem('userId'); // ID dell'utente

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

  useEffect(() => {
    if (!selectedEsercizio || !userId) return;

    const fetchProgressi = async () => {
      setLoading(true);
      setError("");

      try {
        const queryParams = new URLSearchParams();
        if (fromDate) queryParams.append("from", fromDate);
        if (toDate) queryParams.append("to", toDate);

        const res = await fetch(`http://localhost:3001/api/esercizi/progressi-esercizio/${selectedEsercizio}/${userId}?${queryParams.toString()}`);
        const data = await res.json();
        if (res.ok) {
          setDati(data.dati || []);
          setNomeEsercizio(data.nomeEsercizio || "Esercizio");
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
  }, [selectedEsercizio, userId, fromDate, toDate]);

  const parametriAllenanti = dati.length > 0
    ? Object.keys(dati[0]).filter((key) => key !== "data")
    : [];

  return (
    <div className={styles.monitoraggioProgressiContainer}>
      

      <h2 className={styles.titolo}>📊 Monitoraggio Progressi</h2>

      {/* Select esercizio */}
      <div className={styles.selectContainer}>
        <label>
          <strong>Seleziona un esercizio:</strong>
          <select
            value={selectedEsercizio}
            onChange={(e) => {
              setSelectedEsercizio(e.target.value);
              setFromDate("");
              setToDate("");
            }}
          >
            <option value="">-- Scegli --</option>
            {esercizi.map((ex) => (
              <option key={ex._id} value={ex._id}>
                {ex.nome}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Select parametro */}
      {dati.length > 0 && (
        <div className={styles.selectContainer} style={{ marginTop: "1rem" }}>
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
      <div className={styles.dateInputContainer}>
        <label>
          <strong>Data Inizio:</strong>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </label>
        <label>
          <strong>Data Fine:</strong>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </label>
      </div>

      {/* Caricamento o errori */}
      {loading && <p>Caricamento progressi...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Grafico */}
      {selectedParametro && dati.length > 0 && (
        <div className={styles.chartContainer}>
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
