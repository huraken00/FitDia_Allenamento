import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ModificaEsercizio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [esercizio, setEsercizio] = useState({ nome: "", descrizione: "" });
  const [sport, setSport] = useState([]);
  const [parametri, setParametri] = useState([]);
  const [selectedSport, setSelectedSport] = useState([]);
  const [selectedParametri, setSelectedParametri] = useState([]);

  useEffect(() => {
    fetchEsercizio();
    fetchSport();
    fetchParametri();
  }, []);

  const fetchEsercizio = async () => {
    const res = await fetch(`http://localhost:3001/api/esercizi/${id}`);
    const data = await res.json();
     console.log("esercizio:",data)
    // Verifica che i dati siano validi prima di utilizzarli
    if (data) {
      setEsercizio({ nome: data.nome, descrizione: data.descrizione });
  
      // Se sport e parametri non sono null o undefined, imposta i selezionati
      setSelectedSport(data.sport ? data.sport.map((s) => s._id) : []);
      setSelectedParametri(data.parametri ? data.parametri.map((p) => p._id) : []);
    } else {
      console.error("Dati non validi ricevuti dal server.");
    }
  };
  
  const fetchSport = async () => {
    const res = await fetch("http://localhost:3001/api/sport");
    const data = await res.json();
    setSport(data || []); // Proteggi da undefined
  };

  const fetchParametri = async () => {
    const res = await fetch("http://localhost:3001/api/parametri");
    const data = await res.json();
    setParametri(data || []); // Proteggi da undefined
  };

  const handleCheckboxChange = (id, setSelected, selected) => {
    setSelected(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3001/api/esercizi/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: esercizio.nome,
          descrizione: esercizio.descrizione,
          id_sport: selectedSport,
          id_parametri: selectedParametri
        }),
      });

      const responseData = await res.json();  // Cattura i dati della risposta del server
      console.log("Risposta del server:", responseData); // Logga la risposta del server per il debug
      
      if (res.ok) {
        navigate("/lista-esercizi", { replace: true });
      } else {
        console.error("Errore nell'aggiornamento dell'esercizio:", responseData);
      }
    } catch (error) {
      console.error("Errore nell'aggiornamento dell'esercizio:", error);
    }
};

  
  

  return (
    <div>
      <h2>Modifica Esercizio</h2>
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
        {sport && sport.length > 0 ? (
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
        {parametri && parametri.length > 0 ? (
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

        <button type="submit">Salva Modifiche</button>
      </form>
    </div>
  );
};

export default ModificaEsercizio;

