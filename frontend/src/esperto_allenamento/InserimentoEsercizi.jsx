import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from './InserimentoEsercizi.module.css';
import ErrorMessage from '../components/ErrorMessage'; // opzionale

const InserisciEsercizio = () => {
  const navigate = useNavigate();
  const espertoId = localStorage.getItem("userId");

  const [esercizio, setEsercizio] = useState({ nome: "", descrizione: "" });
  const [sport, setSport] = useState([]);
  const [parametri, setParametri] = useState([]);
  const [selectedSport, setSelectedSport] = useState([]);
  const [selectedParametri, setSelectedParametri] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resSport, resParametri] = await Promise.all([
          fetch("http://localhost:3001/api/sport"),
          fetch("http://localhost:3001/api/parametri"),
        ]);

        const sportData = await resSport.json();
        const parametriData = await resParametri.json();

        if (!resSport.ok) throw new Error(sportData.message || "Errore nel caricamento degli sport");
        if (!resParametri.ok) throw new Error(parametriData.message || "Errore nel caricamento dei parametri");

        setSport(sportData || []);
        setParametri(parametriData || []);
      } catch (err) {
        setError(err.message || "Errore imprevisto nel caricamento dei dati.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCheckboxChange = (id, setSelected, selected) => {
    setSelected(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!espertoId) {
      setError("ID esperto non disponibile.");
      return;
    }

    if (!esercizio.nome.trim() || !esercizio.descrizione.trim()) {
      setError("Nome e descrizione sono obbligatori.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/esercizi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: esercizio.nome,
          descrizione: esercizio.descrizione,
          id_esperto: espertoId,
          id_sport: selectedSport,
          id_parametri: selectedParametri
        }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || "Errore durante l'inserimento dell'esercizio.");
      }

      navigate("/lista-esercizi", { replace: true });
    } catch (err) {
      setError(err.message || "Errore imprevisto durante l'invio.");
    }
  };

  if (loading) return <p>Caricamento...</p>;

  return (
    <div className={styles.container}>
      <h2>Inserisci Nuovo Esercizio</h2>

      {error && <ErrorMessage message={error} />} 

      <form onSubmit={handleSubmit}>
        <label>Nome:</label>
        <input
          type="text"
          value={esercizio.nome}
          onChange={(e) => setEsercizio({ ...esercizio, nome: e.target.value })}
        />

        <label>Descrizione:</label>
        <input
          type="text"
          value={esercizio.descrizione}
          onChange={(e) => setEsercizio({ ...esercizio, descrizione: e.target.value })}
        />

        <h3>Sport</h3>
        <div className={styles.checkboxGroup}>
          {sport.length > 0 ? (
            sport.map((s) => (
              <label key={s._id}>
                <input
                  type="checkbox"
                  checked={selectedSport.includes(s._id)}
                  onChange={() => handleCheckboxChange(s._id, setSelectedSport, selectedSport)}
                />
                {s.nome}
              </label>
            ))
          ) : (
            <p>Nessuno sport disponibile</p>
          )}
        </div>

        <h3>Parametri</h3>
        <div className={styles.checkboxGroup}>
          {parametri.length > 0 ? (
            parametri.map((p) => (
              <label key={p._id}>
                <input
                  type="checkbox"
                  checked={selectedParametri.includes(p._id)}
                  onChange={() => handleCheckboxChange(p._id, setSelectedParametri, selectedParametri)}
                />
                {p.nome}
              </label>
            ))
          ) : (
            <p>Nessun parametro disponibile</p>
          )}
        </div>

        <button type="submit">Inserisci Esercizio</button>
      </form>
    </div>
  );
};

export default InserisciEsercizio;

