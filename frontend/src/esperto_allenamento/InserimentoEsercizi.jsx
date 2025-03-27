import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const InserisciEsercizio = () => {
  const navigate = useNavigate();

  // Recupera l'ID dell'esperto autenticato (modifica se necessario)
  const espertoId = localStorage.userId; // Invece di getItem

  const [esercizio, setEsercizio] = useState({ nome: "", descrizione: "" });
  const [sport, setSport] = useState([]);
  const [parametri, setParametri] = useState([]);
  const [selectedSport, setSelectedSport] = useState([]);
  const [selectedParametri, setSelectedParametri] = useState([]);

  useEffect(() => {
    fetchSport();
    fetchParametri();
  }, []);

  const fetchSport = async () => {
    const res = await fetch("http://localhost:3001/api/sport");
    const data = await res.json();
    setSport(data || []);
  };

  const fetchParametri = async () => {
    const res = await fetch("http://localhost:3001/api/parametri");
    const data = await res.json();
    setParametri(data || []);
  };

  const handleCheckboxChange = (id, setSelected, selected) => {
    setSelected(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!espertoId) {
      console.error("ID esperto non disponibile");
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
      console.log("Risposta del server:", responseData);

      if (res.ok) {
        navigate("/lista-esercizi", { replace: true });
      } else {
        console.error("Errore nell'inserimento dell'esercizio:", responseData);
      }
    } catch (error) {
      console.error("Errore nell'inserimento dell'esercizio:", error);
    }
  };

  return (
    <div>
      <h2>Inserisci Nuovo Esercizio</h2>
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

        <h3>Parametri</h3>
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

        <button type="submit">Inserisci Esercizio</button>
      </form>
    </div>
  );
};

export default InserisciEsercizio;
