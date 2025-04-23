import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styles from './ModificaEsercizio.module.css';
import ErrorMessage from "../components/ErrorMessage"; // Componente per mostrare gli errori

const ModificaEsercizio = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const varianteFromLocation = location.state;
  const varianteFromStorage = localStorage.getItem("varianteInValidazione");

  const [esercizio, setEsercizio] = useState({ nome: "", descrizione: "" });
  const [sport, setSport] = useState([]);
  const [parametri, setParametri] = useState([]);
  const [selectedSport, setSelectedSport] = useState([]);
  const [selectedParametri, setSelectedParametri] = useState([]);
  const [variante, setVariante] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSport();
    fetchParametri();

    if (id) {
      fetchEsercizio();
    } else {
      let v = varianteFromLocation || (varianteFromStorage && JSON.parse(varianteFromStorage));
      if (v) {
        setVariante(v);
        setEsercizio({ nome: v.nome, descrizione: v.descrizione });
        setSelectedSport(v.sport ? [v.sport] : []);
        setSelectedParametri(v.parametri || []);
        localStorage.setItem("varianteInValidazione", JSON.stringify(v));
      }
    }
  }, []);

  const fetchEsercizio = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/esercizi/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Errore nel caricamento dell'esercizio.");
      setEsercizio({ nome: data.nome, descrizione: data.descrizione });
      setSelectedSport(data.sport?.map((s) => s._id) || []);
      setSelectedParametri(data.parametri?.map((p) => p._id) || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const fetchSport = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/sport");
      const data = await res.json();
      setSport(data || []);
    } catch (err) {
      console.error(err);
      setError("Errore nel caricamento degli sport.");
    }
  };

  const fetchParametri = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/parametri");
      const data = await res.json();
      setParametri(data || []);
    } catch (err) {
      console.error(err);
      setError("Errore nel caricamento dei parametri.");
    }
  };

  const handleCheckboxChange = (id, setSelected, selected) => {
    setSelected(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      nome: esercizio.nome,
      descrizione: esercizio.descrizione,
      id_sport: selectedSport,
      id_parametri: selectedParametri,
      id_esperto: localStorage.userId,
    };

    try {
      let res;
      if (id) {
        res = await fetch(`http://localhost:3001/api/esercizi/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Errore durante l'aggiornamento.");
        }

        navigate("/lista-esercizi", { replace: true });
      } else {
        res = await fetch("http://localhost:3001/api/esercizi", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Errore nella creazione dell'esercizio.");

        if (variante) {
          await fetch(`http://localhost:3001/api/varianti/${variante._id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
        }

        alert("Variante validata e convertita con successo!");
        localStorage.removeItem("varianteInValidazione");
        navigate("/lista-esercizi", { replace: true });
      }
    } catch (err) {
      console.error("Errore submit:", err);
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <h2>{id ? "Modifica Esercizio" : "Valida Variante"}</h2>
      <ErrorMessage message={error} />
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
        <div className={styles.checkboxContainer}>
          {sport.map((s) => (
            <label key={s._id}>
              <input
                type="checkbox"
                checked={selectedSport.includes(s._id)}
                onChange={() => handleCheckboxChange(s._id, setSelectedSport, selectedSport)}
              />
              {s.nome}
            </label>
          ))}
        </div>

        <h3>Parametri</h3>
        <div className={styles.checkboxContainer}>
          {parametri.map((p) => (
            <label key={p._id}>
              <input
                type="checkbox"
                checked={selectedParametri.includes(p._id)}
                onChange={() => handleCheckboxChange(p._id, setSelectedParametri, selectedParametri)}
              />
              {p.nome}
            </label>
          ))}
        </div>

        <button type="submit">{id ? "Salva Modifiche" : "Valida Variante"}</button>
      </form>
    </div>
  );
};

export default ModificaEsercizio;
