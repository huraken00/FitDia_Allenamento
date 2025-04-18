import { useEffect, useState } from "react";

import styles from "./MonitoraggioProgressi.module.css"; // Importa il modulo CSS
import ErrorMessage from "../../components/ErrorMessage";
import GraficoProgressi from "../../components/GraficoProgressi"; // <-- aggiungi questa riga


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
  const [parametriEsercizio, setParametriEsercizio] = useState([]); // Stato per memorizzare i parametri dell'esercizio


  const userId = localStorage.getItem('userId'); // ID dell'utente

  // Effetto per caricare gli esercizi
  useEffect(() => {
    const fetchEsercizi = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/esercizi/esercizi-utente/${userId}`);
        const data = await res.json();
        setEsercizi(data || []);
      } catch (err) {
        setError("Errore nel recupero degli esercizi.");
      }
    };

    fetchEsercizi();
  }, [userId]);

  // Effetto per caricare i progressi e i parametri quando un esercizio è selezionato
  useEffect(() => {
    if (!selectedEsercizio || !userId) return;
    console.log("es",selectedEsercizio)
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

    // Carica i parametri specifici per l'esercizio selezionato
    const fetchParametri = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/esercizi/parametri/${selectedEsercizio}`);
        const data = await res.json();
        setParametriEsercizio(data.parametri || []);
      } catch (err) {
        setError("Errore nel recupero dei parametri.");
      }
    };

    fetchProgressi();
    fetchParametri();
  }, [selectedEsercizio, userId, fromDate, toDate]);

  const handleParametroChange = (e) => {
    setSelectedParametro(e.target.value);
  };

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
              setSelectedParametro(""); // Reset parametro quando si cambia esercizio
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
      {parametriEsercizio.length > 0 && (
        <div className={styles.selectContainer} style={{ marginTop: "1rem" }}>
          <label>
            <strong>Parametro da visualizzare:</strong>
            <select
              value={selectedParametro}
              onChange={handleParametroChange}
            >
              <option value="">-- Scegli --</option>
              {parametriEsercizio.map((param) => (
                <option key={param._id} value={param.nome}>
                  {param.nome}
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
      <ErrorMessage message={error} />

      {/* Grafico */}
      {selectedParametro && (
  dati.length > 0 ? (
    <GraficoProgressi
      dati={dati}
      parametro={selectedParametro}
      nomeEsercizio={nomeEsercizio}
    />
  ) : (
    <ErrorMessage message="Non ci sono parametri da visualizzare per le date scelte." />
  )
)}


    </div>
  );
};

export default MonitoraggioProgressi;
