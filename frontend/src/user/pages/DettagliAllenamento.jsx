import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const DettagliAllenamento = () => {
  const { id } = useParams();
  const [allenamento, setAllenamento] = useState(null);
  const [serie, setSerie] = useState([]);
  const [error, setError] = useState(null);

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
                  sport: extra.sport || [],
                  parametri
                };
              } catch (err) {
                console.error("Errore nei dettagli esercizio:", err);
                return { ...s, esercizio: "Sconosciuto", sport: [], parametri: [] };
              }
            })
          );

          setAllenamento(data);
          setSerie(serieDettagliate);
        } else {
          setError(data.message || "Errore nel caricamento");
        }
      } catch (err) {
        console.error(err);
        setError("Errore nel caricamento dell'allenamento");
      }
    };

    fetchAllenamento();
  }, [id]);

  if (!allenamento) return <p>Caricamento...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>📋 Dettagli Allenamento</h2>
      <p><strong>Nome:</strong> {allenamento.nome}</p>
      <p><strong>Data:</strong> {new Date(allenamento.dataCreazione).toLocaleDateString()}</p>
      <p><strong>Note:</strong> {allenamento.appuntiAllenamento}</p>

      <h3>🏋️‍♂️ Serie</h3>
      {serie.length === 0 ? (
        <p>Nessuna serie registrata.</p>
      ) : (
        serie.map((s) => (
          <div key={s._id} style={{ border: "1px solid #ccc", marginBottom: "1rem", padding: "1rem", borderRadius: "8px" }}>
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
    </div>
  );
};

export default DettagliAllenamento;

