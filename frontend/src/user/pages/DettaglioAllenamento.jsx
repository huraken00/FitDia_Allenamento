import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const DettaglioAllenamento = () => {
  const { id } = useParams(); // ID dell'allenamento preso dalla URL
  const navigate = useNavigate();
  const [allenamento, setAllenamento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedAllenamento, setEditedAllenamento] = useState({ nome: "", appuntiAllenamento: "" });

  useEffect(() => {
    const fetchAllenamento = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/allenamenti/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Errore nel caricamento");
        setAllenamento(data);
        setEditedAllenamento({ nome: data.nome, appuntiAllenamento: data.appuntiAllenamento || "" });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllenamento();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Sei sicuro di voler eliminare l'allenamento?")) return;
    try {
      const res = await fetch(`http://localhost:3001/api/allenamenti/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Errore nella cancellazione");
      navigate("/dashboard-allenamento"); // Torna alla dashboard
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedAllenamento((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/allenamenti/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedAllenamento),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Errore nella modifica");
      setAllenamento(data);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Caricamento in corso...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Dettaglio Allenamento</h2>
      {isEditing ? (
        <>
          <label>Nome:</label>
          <input type="text" name="nome" value={editedAllenamento.nome} onChange={handleEditChange} />
          <label>Appunti:</label>
          <textarea name="appuntiAllenamento" value={editedAllenamento.appuntiAllenamento} onChange={handleEditChange} />
          <button onClick={handleSaveEdit}>Salva</button>
          <button onClick={() => setIsEditing(false)} style={{ marginLeft: "10px" }}>Annulla</button>
        </>
      ) : (
        <>
          <p><strong>Nome:</strong> {allenamento.nome}</p>
          <p><strong>Appunti:</strong> {allenamento.appuntiAllenamento || "Nessun appunto"}</p>
          <button onClick={() => setIsEditing(true)}>Modifica</button>
        </>
      )}
      
      <h3>Serie ed Esercizi</h3>
      {allenamento.serie.length > 0 ? (
        <ul>
          {allenamento.serie.map((serie, index) => (
            <li key={index}>
              <p><strong>Esercizio:</strong> {serie.id_esercizio?.nome || "Sconosciuto"}</p>
              <p><strong>Sport:</strong> {serie.sport?.join(", ") || "Sconosciuto"}</p>
              <p><strong>Peso:</strong> {serie.peso || "-"} kg</p>
              <p><strong>Distanza:</strong> {serie.distanza || "-"} m</p>
              <p><strong>Durata:</strong> {serie.durata || "-"} sec</p>
              <p><strong>Ripetizioni:</strong> {serie.ripetizioni || "-"}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nessuna serie aggiunta</p>
      )}

      <button onClick={handleDelete} style={{ marginLeft: "10px", color: "red" }}>Elimina</button>
      <button onClick={() => navigate(`/avvia-allenamento/${id}`)} style={{ marginLeft: "10px" }}>Avvia</button>
      <button onClick={() => navigate("/dashboard-allenamento")} style={{ marginLeft: "10px" }}>Indietro</button>
    </div>
  );
};

export default DettaglioAllenamento;
