import { useNavigate, useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import styles from './DettagliAllenamento.module.css'; // Importa il modulo CSS
import ErrorMessage from '../../components/ErrorMessage';



const DettagliAllenamento = () => {
  const { id } = useParams();
  const [allenamento, setAllenamento] = useState(null);
  const [serie, setSerie] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllenamento = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/allenamenti/dettagli/${id}`);
        const data = await res.json();

        if (res.ok) {
          const serieDettagliate = await Promise.all(
            (data.serie || []).map(async (s) => {
              try {
                const resExtra = await fetch(`http://localhost:3001/api/serie/esercizio/${s.id_esercizio}`);
                const extra = await resExtra.json();
               
                  const parametri = (extra.parametri || []).map(p => ({
                    nome: p.nome,
                    valore: s[p.nome] ?? "N/A"
                  }));
  
                  return {
                    ...s,
                    esercizio: extra.nomeEsercizio,
                    esercizioCancellato: extra.esercizioCancellato,
                    sport: extra.sport || [],
                    parametri
                  };    
              } catch (err) {
                setError(err.message )
                return { ...s, esercizio: "Sconosciuto", sport: [], parametri: [] };
              }
            })
          );

          setAllenamento(data);
          setSerie(serieDettagliate);
        } else {
          throw new Error(data.message);
        }
      } catch (err) {
        setError(err.message );
      }
    };

    fetchAllenamento();
  }, [id]);

  const avviaAllenamento = async () => {
    try {
      const utenteId = localStorage.getItem("userId");

      const resAllenamento = await fetch(`http://localhost:3001/api/allenamenti/${utenteId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: allenamento.nome,
          appuntiAllenamento: allenamento.appuntiAllenamento || "",
          dataCreazione: allenamento.dataCreazione,
          id_utente: utenteId,
          serie: [],
        }),
      });

      const nuovo = await resAllenamento.json();

      if (!resAllenamento.ok) {
        throw new Error(nuovo.message);
      }

      for (const s of serie) {
        await fetch("http://localhost:3001/api/serie", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_allenamento: nuovo.allenamento._id,
            id_esercizio: s.id_esercizio,
            Peso: s.Peso || null,
            Distanza: s.Distanza || null,
            Durata: s.Durata || null,
            Ripetizioni: s.Ripetizioni || null,
          }),
        });
      }

      alert("Allenamento avviato con successo");
      navigate(`/dettagli-allenamento/${nuovo.allenamento._id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!allenamento && !error) return <p>Caricamento...</p>;

  return (
    <div className={styles.container}>
      <h2>📋 Dettagli Allenamento</h2>

      <ErrorMessage message={error} />

      {allenamento && (
        <>
          <p><strong>Nome:</strong> {allenamento.nome}</p>
          <p><strong>Allenamento eseguito il:</strong> {new Date(allenamento.createdAt).toLocaleDateString()}</p>
          <p><strong>Data Creazione Allenamento:</strong> {new Date(allenamento.dataCreazione).toLocaleDateString()}</p>
          <p><strong>Note:</strong> {allenamento.appuntiAllenamento}</p>
          <Link to={`/modifica-allenamento/${allenamento._id}`}>
            <button>Modifica</button>
          </Link>
          <button onClick={avviaAllenamento}>Avvia Allenamento</button>

          <h3>🏋️‍♂️ Serie</h3>
          {serie.length === 0 ? (
            <p>Nessuna serie registrata.</p>
          ) : (
            serie.map((s) => (
              <div key={s._id} className={styles.serieBox}>
                <p><strong>Esercizio:</strong> {s.esercizio}</p>
                <p><strong>Sport:</strong> {s.sport.join(", ") || "N/A"}</p>

                <div>
                  <strong>Parametri:</strong>
                  <ul>
                    {s.parametri.map((p, i) => (
                      <li key={i}>
                        {p.nome}: <strong>{p.valore}</strong>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
};

export default DettagliAllenamento;
