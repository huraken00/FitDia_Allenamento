import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CercaEsercizio from "../../components/CercaEsercizio";

import "./Varianti.css";

const VariantiEsercizi = () => {

  const [selectedExercise, setSelectedExercise] = useState(null);
  
  const [sport, setSport] = useState("pallavolo");
  const [luogo, setLuogo] = useState("casa");
  const [livello, setLivello] = useState("principiante");
  const [variante, setVariante] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

 

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
      <CercaEsercizio onSelect={setSelectedExercise} />

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
