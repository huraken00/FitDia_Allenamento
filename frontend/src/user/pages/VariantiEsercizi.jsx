import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Varianti.css";

const VariantiEsercizi = () => {
  const [allExercises, setAllExercises] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);

  const [sport, setSport] = useState("pallavolo");
  const [luogo, setLuogo] = useState("casa");
  const [livello, setLivello] = useState("principiante");
  const [variante, setVariante] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/esercizi", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) {
          throw new Error("Errore nel recupero degli esercizi");
        }
        const data = await res.json();
        setAllExercises(data);
      } catch (error) {
        console.error("Errore:", error);
      }
    };
    fetchExercises();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredExercises([]);
      setShowDropdown(false);
    } else {
      const filtered = allExercises.filter((exercise) =>
        exercise.nome.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredExercises(filtered);
      setShowDropdown(filtered.length > 0);
    }
  }, [searchQuery, allExercises]);

  const handleSelectExercise = (exercise) => {
    setSelectedExercise(exercise);
    setSearchQuery(exercise.nome);
    setShowDropdown(false);
  };

  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 150);
  };

  const generaVariante = async () => {
    if (!selectedExercise) return;
    setLoading(true);

    // Recupera l'ID dell'utente dal token JWT
    const token = localStorage.getItem("token");
    const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodifica il token JWT per estrarre l'ID utente
    const userId = decodedToken.id;

    try {
      const res = await fetch("http://localhost:3001/api/varianti", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          nome: selectedExercise.nome,
          sport,
          luogo,
          livello,
          userId, // Aggiungi l'userId al corpo della richiesta
        }),
      });

      const data = await res.json();
      setVariante(data.variante); // contiene { nome, descrizione }
    } catch (err) {
      console.error("Errore durante la generazione:", err);
    }
    setLoading(false);
  };

  return (
    <div className="varianti-container">
      <h2>Genera una Variante di un Esercizio</h2>

      <input
        className="search-input"
        type="text"
        placeholder="Cerca esercizio..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setSelectedExercise(null);
        }}
        onFocus={() => {
          if (filteredExercises.length > 0) setShowDropdown(true);
        }}
        onBlur={handleBlur}
      />

      {showDropdown && (
        <ul className="dropdown-list">
          {filteredExercises.map((exercise) => (
            <li
              key={exercise._id}
              onMouseDown={() => handleSelectExercise(exercise)}
            >
              {exercise.nome}
            </li>
          ))}
        </ul>
      )}

      <div className="form-params">
        <label>Sport:</label>
        <select value={sport} onChange={(e) => setSport(e.target.value)}>
          <option value="pallavolo">Pallavolo</option>
          <option value="yoga">Yoga</option>
          <option value="corsa">Corsa</option>
          <option value="palestra">Palestra</option>
        </select>

        <label>Luogo:</label>
        <select value={luogo} onChange={(e) => setLuogo(e.target.value)}>
          <option value="casa">Casa</option>
          <option value="palestra">Palestra</option>
          <option value="all'aperto">All'aperto</option>
        </select>

        <label>Livello:</label>
        <select value={livello} onChange={(e) => setLivello(e.target.value)}>
          <option value="principiante">Principiante</option>
          <option value="intermedio">Intermedio</option>
          <option value="avanzato">Avanzato</option>
        </select>
      </div>

      <button onClick={generaVariante} disabled={loading || !selectedExercise}>
        {loading ? "Generazione in corso..." : "Genera Variante"}
      </button>

      {variante && (
        <div className="output-box">
          <h3>Variante salvata:</h3>
          <h4>{variante.nome}</h4>
          <p>{variante.descrizione}</p>
        </div>
      )}

      <button className="lista-btn" onClick={() => navigate("/varianti")}>
        Vai alle mie varianti
      </button>
    </div>
  );
};

export default VariantiEsercizi;
