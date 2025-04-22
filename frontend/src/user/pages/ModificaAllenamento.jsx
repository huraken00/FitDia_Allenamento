import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AggiungiSerie from '../../components/AggiungiSerie';
import styles from './ModificaAllenamento.module.css'; // Importa il modulo CSS
import ErrorMessage from '../../components/ErrorMessage';

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
          const serieArricchite = await Promise.all(
            (data.serie || []).map(async (s) => {
              try {
                const esercizioId = typeof s.id_esercizio === "object" ? s.id_esercizio._id : s.id_esercizio;
                const resExtra = await fetch(`http://localhost:3001/api/serie/esercizio/${esercizioId}`);
                const extra = await resExtra.json();
                  if(resExtra.ok){
                    const parametri = (extra.parametri || []).map(p => ({
                      nome: p.nome,
                      valore: s[p.nome] ?? ""
                    }));
    
                    return {
                      ...s,
                      esercizio: extra.nomeEsercizio,
                      esercizioCancellato: extra.esercizioCancellato,
                      sport: extra.sport || [],
                      parametri
                    };
                  }else{
                    throw new Error (extra.message);
                  }
              } catch (err) {
               setError(err.message)
              }
            })
          );

          setAllenamento(data);
          setSerie(serieArricchite);
        } else {
          throw new Error(data.message);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAllenamento();
  }, [id]);

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

  const handleEliminaSerie = async (serieId) => {
    try {
      const res = await fetch(`http://localhost:3001/api/serie/${serieId}`, {
        method: "DELETE",
      });
      const data = await res.json(); // 👈 prendi il message
  
      if (res.ok) {
        setSerie((prev) => prev.filter((s) => s._id !== serieId));
      } else {
        throw new Error(data.message );
      }
    } catch (err) {
      console.error(err);
    }
  };
  

  const handleSalvaModifiche = async () => {
    try {
      // Aggiorna l'allenamento
      const resAllenamento = await fetch(`http://localhost:3001/api/allenamenti/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: allenamento.nome,
          appuntiAllenamento: allenamento.appuntiAllenamento,
        }),
      });
  
      const dataAllenamento = await resAllenamento.json();
      if (!resAllenamento.ok) {
        throw new Error(dataAllenamento.message || "Errore aggiornamento allenamento");
      }
  
      // Aggiorna tutte le serie
      for (const s of serie) {
        try {
          const resSerie = await fetch(`http://localhost:3001/api/serie/${s._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              parametri: s.parametri,
            }),
          });
  
          const dataSerie = await resSerie.json();
          if (!resSerie.ok) {
            throw new Error(dataSerie.message || `Errore aggiornamento serie con ID ${s._id}`);
          }
        } catch (err) {
         setError(err.message)
        }
      }
  
      alert("Allenamento aggiornato con successo");
      navigate("/dashboard-allenamento");
    } catch (err) {
      console.error("Errore durante il salvataggio:", err);
      setError(err.message || "Errore imprevisto durante il salvataggio");
    }
  };
  

  const handleEliminaAllenamento = async () => {
    const conferma = window.confirm("Vuoi eliminare questo allenamento?");
    if (!conferma) return;
  
    try {
      const res = await fetch(`http://localhost:3001/api/allenamenti/${id}`, {
        method: "DELETE",
      });
  
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Errore eliminazione allenamento");
      }
  
      alert("Allenamento eliminato");
      navigate("/dashboard-allenamento");
    } catch (err) {
      console.error("Errore eliminazione:", err);
      setError(err.message || "Errore di rete o del server");
    }
  };

  <ErrorMessage message={error}/>
  
  if (!allenamento) return <p>Caricamento...</p>;

  return (
    <div className={styles.container}>
      <h2>Modifica Allenamento</h2>
      <div className={styles.dettagliAllenamento}>
        <p><strong>Data:</strong> {new Date(allenamento.dataCreazione).toLocaleDateString()}</p>
        <label>Nome:</label>
        <input name="nome" value={allenamento.nome} onChange={handleInputChange} />

        <label>Appunti:</label>
        <textarea name="appuntiAllenamento" value={allenamento.appuntiAllenamento} onChange={handleInputChange} />
      </div>

      <div className={styles.serieContainer}>
        <h3>Serie</h3>
        {serie.map((s, index) => (
          <div key={s._id} className={styles.serieBox}>
            <p><strong>Esercizio:</strong> {s.esercizio}</p>
            { s.esercizioCancellato && (
               <p className={styles.warning}>
                ⚠️ Questo esercizio è stato eliminato e non sarà più disponibile nei nuovi allenamenti.
                 </p>
                )}
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

            <button className={styles.eliminaSerieBtn} onClick={() => handleEliminaSerie(s._id)}>Elimina Serie</button>
          </div>
        ))}

        <AggiungiSerie
          allenamentoId={allenamento._id}
          onSerieAggiunta={(nuovaSerie) => {
            setSerie(prev => [...prev, nuovaSerie]);
          }}
        />
      </div>

      <div className={styles.buttonContainer}>
        <button onClick={handleSalvaModifiche}>Salva Modifiche</button>
        <button onClick={handleEliminaAllenamento} className={styles.deleteButton}>
          Elimina Allenamento
        </button>
      </div>

      <ErrorMessage message={error} />
    </div>
  );
};

export default ModificaAllenamento;
