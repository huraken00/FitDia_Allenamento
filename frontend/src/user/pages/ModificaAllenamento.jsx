import { useParams, useNavigate } from 'react-router-dom'; // Importa useParams
import { useEffect, useState } from 'react';
import AggiungiSerie from '../../components/AggiungiSerie';

const ModificaAllenamento = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [allenamento, setAllenamento] = useState(null);
  const [serie, setSerie] = useState([]);
  const [error, setError] = useState(null);

  // Fetch dell'allenamento al montaggio del componente
  useEffect(() => {
  const fetchAllenamento = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/allenamenti/dettagli/${id}`);
      const data = await res.json();

      if (res.ok) {
        const serieArricchite = await Promise.all(
          (data.serie || []).map(async (s) => {
            console.log("valore",data);
            try {
              const resExtra = await fetch(`http://localhost:3001/api/serie/esercizio/${s.id_esercizio}`);
              const extra = await resExtra.json();
        
              const parametri = (extra.parametri || []).map(p => ({
                nome: p.nome,
                valore: s[p.nome] ?? ""               
              }));
              return {
                ...s,
                sport: extra.sport || [],
                esercizio: extra.nomeEsercizio,
                parametri
                
              };
            } 
            
            catch (err) {
              console.error("Errore recupero parametri/sport:", err);
              return { ...s, sport: [], parametri: [] };
            }
          })
        );
        
        
        setAllenamento(data);
        setSerie(serieArricchite);
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





  // Funzione per gestire i cambiamenti nei campi dell'allenamento
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAllenamento((prev) => ({ ...prev, [name]: value }));
  };

 

  const handleParametroChange = (serieIndex, paramIndex, valore) => {
    setSerie(prev =>
      prev.map((s, i) => {
        if (i !== serieIndex) return s;
        const nuoviParametri = s.parametri.map((p, j) =>
          j === paramIndex ? { ...p, valore } : p
        );
        return { ...s, parametri: nuoviParametri };
      })
    );
  };
  

  // Funzione per eliminare una serie
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

  // Funzione per salvare le modifiche dell'allenamento
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
      for (const s of serie) {
      await fetch(`http://localhost:3001/api/serie/${s._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parametri: s.parametri, // questo è un array di oggetti { nome, valore }
          
        }),
      });
    }
    

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

  // Funzione per eliminare l'allenamento
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

  // Se l'allenamento non è ancora caricato, mostriamo un messaggio di caricamento
  if (!allenamento) return <p>Caricamento...</p>;

  return (
    <div>
      <h2>Modifica Allenamento</h2>
      <p><strong>Data:</strong> {new Date(allenamento.dataCreazione).toLocaleDateString()}</p>
      <label>Nome:</label>
      <input name="nome" value={allenamento.nome} onChange={handleInputChange} />

      <label>Appunti:</label>
      <textarea name="appuntiAllenamento" value={allenamento.appuntiAllenamento} onChange={handleInputChange} />

      <h3>Serie</h3>
      {serie.map((s, index) => (
     <div key={s._id} style={{ border: "1px solid gray", marginBottom: "1rem", padding: "0.5rem" }}>
    <p><strong>Esercizio:</strong> {s.esercizio}</p>
    <p><strong>Sport:</strong> {s.sport?.join(", ") || "N/A"}</p>

    <div>
  <strong>Parametri:</strong>
  {(s.parametri || []).map((p, paramIndex) => (
    <div key={paramIndex}>
      <label>{p.nome}:</label>
      <input
  type="text"
  value={p.valore}
  onChange={(e) => handleParametroChange(index, paramIndex, e.target.value)}
/>
    </div>
    
  ))}
</div>


    <button onClick={() => handleEliminaSerie(s._id)}>Elimina Serie</button>
  </div>
))}


      {/* Componente per aggiungere una nuova serie */}
      <AggiungiSerie
        allenamentoId={allenamento._id}
        onSerieAggiunta={(nuovaSerie) => setSerie((prev) => [...prev, nuovaSerie])}
      />

      <button onClick={handleSalvaModifiche}>Salva Modifiche</button>
      <button onClick={handleEliminaAllenamento} style={{ color: "red", marginLeft: "10px" }}>
        Elimina Allenamento
      </button>
     
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ModificaAllenamento;
