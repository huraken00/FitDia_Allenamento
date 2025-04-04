import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AggiungiSerie from "../../components/AggiungiSerie";

const InserimentoAllenamenti = () => {
  const navigate = useNavigate();
  const utenteId = localStorage.getItem("userId");

  const [allenamento, setAllenamento] = useState({
    nome: "",
    appuntiAllenamento: "",
    serie: [],
  });

  const [error, setError] = useState(null);

  const handleAllenamentoChange = (e) => {
    const { name, value } = e.target;
    setAllenamento((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!utenteId) {
      console.error("ID utente non disponibile");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/api/allenamenti/${utenteId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: allenamento.nome,
          appuntiAllenamento: allenamento.appuntiAllenamento,
          id_utente: utenteId,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setAllenamento((prev) => ({ ...prev, _id: data.allenamento._id }));
      } else {
        setError(data.message || "Errore nella creazione dell'allenamento");
      }
    } catch (err) {
      setError("Errore nel salvataggio dell'allenamento.");
      console.error(err);
    }
  };

  const handleSerieAggiunta = (nuovaSerie) => {
    setAllenamento((prev) => ({
      ...prev,
      serie: [...prev.serie, nuovaSerie],
    }));
  };

  return (
    <div>
      <h2>Crea Nuovo Allenamento</h2>
      <form onSubmit={handleSubmit}>
        <label>Nome Allenamento:</label>
        <input type="text" name="nome" value={allenamento.nome} onChange={handleAllenamentoChange} required />

        <label>Appunti Allenamento:</label>
        <textarea name="appuntiAllenamento" value={allenamento.appuntiAllenamento} onChange={handleAllenamentoChange} />

        <button type="submit">Crea Allenamento</button>
      </form>

      {allenamento._id && (
        <AggiungiSerie allenamentoId={allenamento._id} 
        onSerieAggiunta={handleSerieAggiunta} />
      )}

      <div>
  <h3>Serie Aggiunte:</h3>
  <ul>
    {allenamento.serie.map((s, index) => (
      <li key={index}>
        <p>
        {/*il punto interrogativo indica un operazione ternaria */}
          <strong>Esercizio:</strong> {s.id_esercizio?.nome || "Sconosciuto"} <br />
          <strong>Sport:</strong> {s.sport.join(", ") || "Sconosciuto"} <br />
          {s.peso && <><strong>Peso:</strong> {s.peso} kg <br /></>}
          {s.distanza && <><strong>Distanza:</strong> {s.distanza} m <br /></>}
          {s.durata && <><strong>Durata:</strong> {s.durata} sec <br /></>}
          {s.ripetizioni && <><strong>Ripetizioni:</strong> {s.ripetizioni} <br /></>}
        </p>
      </li>
    ))}
  </ul>
</div>


      <button onClick={() => navigate("/dashboard-allenamento")}>Termina</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default InserimentoAllenamenti;
