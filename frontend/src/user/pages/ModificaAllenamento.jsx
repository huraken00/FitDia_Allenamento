import { useParams, useNavigate } from 'react-router-dom'; // Importa useParams
import  { useEffect, useState } from 'react';
const ModificaAllenamento = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [allenamento, setAllenamento] = useState(null);
  const [serie, setSerie] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllenamento = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/allenamenti/dettagli/${id}`);
        const data = await res.json();
        if (res.ok) {
          setAllenamento(data);
          setSerie(data.serie || []);
        } else {
          setError(data.message);
        }
      } catch (err) {
        console.error(err);
        setError("Errore nel recupero dell'allenamento");
      }
    };

    fetchAllenamento();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAllenamento((prev) => ({ ...prev, [name]: value }));
  };

  const handleSerieChange = (index, e) => {
    const { name, value } = e.target;
    setSerie((prev) =>
      prev.map((s, i) =>
        i === index ? { ...s, [name]: value } : s
      )
    );
  };

  const handleEliminaSerie = async (serieId) => {
    try {
      const res = await fetch(`http://localhost:3001/api/serie/${serieId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSerie((prev) => prev.filter((s) => s._id !== serieId));
      }
    } catch (err) {
      console.error("Errore eliminazione serie:", err);
    }
  };

  const handleSalvaModifiche = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/allenamenti/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: allenamento.nome,
          appuntiAllenamento: allenamento.appuntiAllenamento,
        }),
      });

      if (res.ok) {
        alert("Allenamento aggiornato con successo");
        navigate("/dashboard-allenamento");
      } else {
        const data = await res.json();
        setError(data.message || "Errore aggiornamento");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEliminaAllenamento = async () => {
    const conferma = window.confirm("Vuoi eliminare questo allenamento?");
    if (!conferma) return;

    try {
      const res = await fetch(`http://localhost:3001/api/allenamenti/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Allenamento eliminato");
        navigate("/dashboard-allenamento");
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!allenamento) return <p>Caricamento...</p>;

  return (
    <div>
      <h2>Modifica Allenamento</h2>
      <label>Nome:</label>
      <input name="nome" value={allenamento.nome} onChange={handleInputChange} />

      <label>Appunti:</label>
      <textarea name="appuntiAllenamento" value={allenamento.appuntiAllenamento} onChange={handleInputChange} />

      <h3>Serie</h3>
      {serie.length > 0 ? (
  serie.map((s, index) => (
    <div key={s._id} style={{ border: "1px solid gray", marginBottom: "1rem", padding: "0.5rem" }}>
      <p><strong>Esercizio:</strong> {s.id_esercizio?.nome}</p>
      
      {/* Campi per la modifica della serie */}
      <label>Peso:</label>
      <input name="peso" type="number" value={s.peso || ""} onChange={(e) => handleSerieChange(index, e)} />
      <label>Ripetizioni:</label>
      <input name="ripetizioni" type="number" value={s.ripetizioni || ""} onChange={(e) => handleSerieChange(index, e)} />
      <label>Durata:</label>
      <input name="durata" type="number" value={s.durata || ""} onChange={(e) => handleSerieChange(index, e)} />
      <label>Distanza:</label>
      <input name="distanza" type="number" value={s.distanza || ""} onChange={(e) => handleSerieChange(index, e)} />

      {/* Pulsante per eliminare la serie */}
      <button onClick={() => handleEliminaSerie(s._id)}>Elimina Serie</button>
    </div>
  ))
) : (
  <p>Nessuna serie registrata.</p>
)}


      <button onClick={handleSalvaModifiche}>Salva Modifiche</button>
      <button onClick={handleEliminaAllenamento} style={{ color: "red", marginLeft: "10px" }}>
        Elimina Allenamento
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ModificaAllenamento;
