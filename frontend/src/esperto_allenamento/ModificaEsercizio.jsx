import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styles from './ModificaEsercizio.module.css'; // Importa il modulo CSS

const ModificaEsercizio = () => {
  const { id } = useParams(); // Se presente, è modifica. Se assente, è validazione
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

  useEffect(() => {
    fetchSport();
    fetchParametri();

    if (id) {
      // Modifica esercizio
      fetchEsercizio();
    } else {
      // Validazione variante
      let v = varianteFromLocation;

      if (!v && varianteFromStorage) {
        v = JSON.parse(varianteFromStorage);
      }

      if (v) {
        setVariante(v);
        setEsercizio({ nome: v.nome, descrizione: v.descrizione });
        setSelectedSport(v.sport ? [v.sport] : []);
        setSelectedParametri(v.parametri || []);

        // Salva nel localStorage per il fallback refresh
        localStorage.setItem("varianteInValidazione", JSON.stringify(v));
      }
    }
  }, []);

  const fetchEsercizio = async () => {
    const res = await fetch(`http://localhost:3001/api/esercizi/${id}`);
    const data = await res.json();
    if (data) {
      setEsercizio({ nome: data.nome, descrizione: data.descrizione });
      setSelectedSport(data.sport?.map((s) => s._id) || []);
      setSelectedParametri(data.parametri?.map((p) => p._id) || []);
    }
  };

  const fetchSport = async () => {
    const res = await fetch("http://localhost:3001/api/sport");
    const data = await res.json();
    setSport(data || []);
  };

  const fetchParametri = async () => {
    const res = await fetch("http://localhost:3001/api/parametri");
    const data = await res.json();
    setParametri(data || []);
  };

  const handleCheckboxChange = (id, setSelected, selected) => {
    setSelected(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      nome: esercizio.nome,
      descrizione: esercizio.descrizione,
      id_sport: selectedSport,
      id_parametri: selectedParametri,
      id_esperto: localStorage.userId,
    };

    try {
      if (id) {
        // Modifica esercizio esistente
        const res = await fetch(`http://localhost:3001/api/esercizi/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          navigate("/lista-esercizi", { replace: true });
        } else {
          console.error("Errore aggiornamento");
        }
      } else {
        // Creazione nuovo esercizio da variante
        const res = await fetch("http://localhost:3001/api/esercizi", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        });

        if (res.ok && variante) {
          // Elimina la variante approvata
          await fetch(`http://localhost:3001/api/varianti/${variante._id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          alert("Variante validata e convertita con successo!");
          localStorage.removeItem("varianteInValidazione"); // Pulisce lo storage
          navigate("/lista-esercizi", { replace: true });
        } else {
          console.error("Errore nella validazione");
        }
      }
    } catch (error) {
      console.error("Errore submit:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>{id ? "Modifica Esercizio" : "Valida Variante"}</h2>
      <form onSubmit={handleSubmit}>
        <label>Nome:</label>
        <input
          type="nome"
          value={esercizio.nome}
          onChange={(e) => setEsercizio({ ...esercizio, nome: e.target.value })}
        />
        <label>Descrizione:</label>
        <input
          type="descrizione"
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
