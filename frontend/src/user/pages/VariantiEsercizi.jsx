import React, { useState, useEffect } from "react";
import "./Varianti.css";

const VariantiEsercizi = () => {
  const [allExercises, setAllExercises] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Recupera gli esercizi dal backend
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

  // Aggiorna il filtraggio in base alla barra di ricerca
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
    // Ritarda la chiusura della tendina per permettere il click
    setTimeout(() => setShowDropdown(false), 150);
  };

  return (
    <div className="varianti-container">
      <h2>Varianti degli Esercizi</h2>
      {/* Barra di ricerca */}
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
      {/* Tendina con le proposte */}
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
    </div>
  );
};

export default VariantiEsercizi;