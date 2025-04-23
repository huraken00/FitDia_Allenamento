import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AggiungiSerie from "../../components/AggiungiSerie";
import styles from './InserimentoAllenamenti.module.css'; // Importazione del modulo CSS
import ErrorMessage from "../../components/ErrorMessage";


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
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
      
    }
  };

  const handleSerieAggiunta = (nuovaSerie) => {
    setAllenamento((prev) => ({
      ...prev,
      serie: [...prev.serie, nuovaSerie],
    }));
  };

  return (
    
    <div className={styles.container}>
     
      <h2 className={styles.title}>Crea Nuovo Allenamento</h2>
      <ErrorMessage message={error} />
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>Nome Allenamento:</label>
        <input
          type="text"
          name="nome"
          value={allenamento.nome}
          onChange={handleAllenamentoChange}
          className={styles.input}
          required
        />

        <label className={styles.label}>Appunti Allenamento:</label>
        <textarea
          name="appuntiAllenamento"
          value={allenamento.appuntiAllenamento}
          onChange={handleAllenamentoChange}
          className={styles.textarea}
        />

        <button type="submit" className={styles.submitButton}>Crea Allenamento</button>
      </form>

      {allenamento._id && (
        <AggiungiSerie allenamentoId={allenamento._id} onSerieAggiunta={handleSerieAggiunta} />
      )}

      <div className={styles.serieContainer}>
        <h3 className={styles.serieTitle}>Serie Aggiunte:</h3>
        <ul>
          {allenamento.serie.map((s, index) => (
            <li key={index} className={styles.serieItem}>
              <p>
                <strong>Esercizio:</strong> {s.id_esercizio?.nome || "Sconosciuto"} <br />
                <strong>Sport:</strong> {s.sport.join(", ") || "Sconosciuto"} <br />
                {s.Peso && <><strong>Peso:</strong> {s.Peso} kg <br /></>}
                {s.Distanza && <><strong>Distanza:</strong> {s.Distanza} m <br /></>}
                {s.Durata && <><strong>Durata:</strong> {s.Durata} sec <br /></>}
                {s.Ripetizioni && <><strong>Ripetizioni:</strong> {s.Ripetizioni} <br /></>}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <button onClick={() => navigate("/dashboard-allenamento")} className={styles.finishButton}>Termina</button>

      
    </div>
  );
};

export default InserimentoAllenamenti;
