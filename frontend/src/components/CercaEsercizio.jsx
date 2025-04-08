import React, { useState, useEffect } from "react";

const CercaEsercizio = ({ onSelect }) => {
  const [allExercises, setAllExercises] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/esercizi", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
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
      setShowDropdown(filtered.length > 0);  // Mostra il dropdown solo se ci sono risultati
    }
  }, [searchQuery, allExercises]);

  const handleSelectExercise = (exercise) => {
    setSearchQuery(exercise.nome);
    setShowDropdown(false);
    onSelect(exercise); // Notifica il genitore
  };

  const handleBlur = () => {
    // Rimuoviamo il setTimeout per migliorare l'usabilità
    setShowDropdown(false);
  };

  return (
    <div>
      <input
        className="search-input"
        type="text"
        placeholder="Cerca esercizio..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => {
          if (filteredExercises.length > 0) setShowDropdown(true);
        }}
        onBlur={handleBlur}
      />

      {showDropdown && filteredExercises.length > 0 && (
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

export default CercaEsercizio;
