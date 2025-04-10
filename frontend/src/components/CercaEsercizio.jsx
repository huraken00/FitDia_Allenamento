import React, { useState, useEffect } from "react";
import styles from "./CercaEsercizio.module.css"; // Importa il modulo CSS senza trattini

const CercaEsercizio = ({ onSelect }) => {
  const [allExercises, setAllExercises] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [sportOptions, setSportOptions] = useState([]);
  const [parametroOptions, setParametroOptions] = useState([]);
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedParametro, setSelectedParametro] = useState("");

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
    const fetchFilters = async () => {
      try {
        const [sportRes, parametriRes] = await Promise.all([
          fetch("http://localhost:3001/api/sport"),
          fetch("http://localhost:3001/api/parametri"),
        ]);

        const [sportData, parametriData] = await Promise.all([
          sportRes.json(),
          parametriRes.json(),
        ]);

        setSportOptions(sportData);
        setParametroOptions(parametriData);
      } catch (err) {
        console.error("Errore nel fetch di sport/parametri:", err);
      }
    };

    fetchFilters();
  }, []);

  useEffect(() => {
    let filtered = allExercises;

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((exercise) =>
        exercise.nome.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedSport) {
      filtered = filtered.filter((ex) =>
        ex.sport?.some((s) => s._id === selectedSport)
      );
    }

    if (selectedParametro) {
      filtered = filtered.filter((ex) =>
        ex.parametri?.some((p) => p._id === selectedParametro)
      );
    }

    setFilteredExercises(filtered);
    setShowDropdown(filtered.length > 0);
  }, [searchQuery, selectedSport, selectedParametro, allExercises]);

  const handleSelectExercise = (exercise) => {
    setSearchQuery(exercise.nome);
    setShowDropdown(false);
    onSelect(exercise);
  };

  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 150);
  };

  return (
    <div className={styles.cercaEsercizioContainer}>
      <input
        className={styles.searchInput}
        type="text"
        placeholder="Cerca esercizio..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setShowDropdown(filteredExercises.length > 0)}
        onBlur={handleBlur}
      />

      <div className={styles.filtriContainer}>
        <select value={selectedSport} onChange={(e) => setSelectedSport(e.target.value)}>
          <option value="">Tutti gli sport</option>
          {sportOptions.map((sport) => (
            <option key={sport._id} value={sport._id}>
              {sport.nome}
            </option>
          ))}
        </select>

        <select value={selectedParametro} onChange={(e) => setSelectedParametro(e.target.value)}>
          <option value="">Tutti i parametri</option>
          {parametroOptions.map((param) => (
            <option key={param._id} value={param._id}>
              {param.nome}
            </option>
          ))}
        </select>
      </div>

      {showDropdown && filteredExercises.length > 0 && (
        <ul className={styles.dropdownList} onMouseDown={(e) => e.preventDefault()}>
          {filteredExercises.map((exercise) => (
            <li key={exercise._id} onMouseDown={() => handleSelectExercise(exercise)}>
              {exercise.nome}
            </li>
          ))}
        </ul>
      )}
      {showDropdown && filteredExercises.length === 0 && (
        <div className={styles.dropdownListEmpty}>Nessun esercizio trovato</div>
      )}
    </div>
  );
};

export default CercaEsercizio;
