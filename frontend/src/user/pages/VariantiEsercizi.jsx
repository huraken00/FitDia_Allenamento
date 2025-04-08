import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CercaEsercizio from "../../components/CercaEsercizio";
import Modal from "../../components/Modal"; // Importa la modale

import "./Varianti.css";

const VariantiEsercizi = () => {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [sport, setSport] = useState("pallavolo");
  const [luogo, setLuogo] = useState("casa");
  const [livello, setLivello] = useState("principiante");
  const [variante, setVariante] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(true);

  const navigate = useNavigate();

  const generaVariante = async () => {
    if (!selectedExercise) return;
    setLoading(true);

    const token = localStorage.getItem("token");
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const userId = decodedToken.id;

    try {
      const res = await fetch("http://localhost:3001/api/varianti", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: selectedExercise.nome,
          sport,
          luogo,
          livello,
          userId,
        }),
      });

      const data = await res.json();
      setVariante(data.variante);
    } catch (err) {
      console.error("Errore durante la generazione:", err);
    }
    setLoading(false);
  };

  const handleModalResponse = (accept) => {
    setShowModal(false);
    if (!accept) {
      navigate("/dashboard-allenamento");
    }
  };

  return (
    <div className="varianti-container">
      {showModal && (
        <Modal
          title="Attenzione"
          message="È importante ricordare che le risposte fornite sono tutte generate automaticamente e non sostituiscono il parere di un esperto.
                   FitDia non si assume e non accetta alcuna responsabilità riguardo alle informazioni fornite ovvero all’accuratezza 
                   e/o alla completezza delle medesime ed in nessun caso potrà essere ritenuta responsabile per eventuali danni o perdite.
                   Se la variante risulta idonea, verrà succesivamente validata e inserita negli esercizi da un esperto"
          onConfirm={() => handleModalResponse(true)}
          onCancel={() => handleModalResponse(false)}
          confirmText="Accetto"
          cancelText="Rifiuto"
        />
      )}

      {!showModal && (
        <>
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
        </>
      )}
    </div>
  );
};

export default VariantiEsercizi;
