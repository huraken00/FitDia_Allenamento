import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const InserimentoEsercizi = () => {
  const [nome, setNome] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [selectedParams, setSelectedParams] = useState([]);
  const [selectedSports, setSelectedSports] = useState([]);
  const [sports, setSports] = useState([]);
  const [parameters, setParameters] = useState([]);
  const navigate = useNavigate();

  // Fetch sports and parameters from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sportResponse = await fetch("http://localhost:3001/api/sport");
        const sportsData = await sportResponse.json();
        setSports(sportsData);

        const paramResponse = await fetch("http://localhost:3001/api/parametri");
        const parametersData = await paramResponse.json();
        setParameters(parametersData);
      } catch (err) {
        console.error("Errore nel recupero di sport e parametri:", err);
      }
    };

    fetchData();
  }, []);

  // Handle parameter selection
  const handleParamChange = (e) => {
    const { value, checked } = e.target;
    setSelectedParams((prev) =>
      checked ? [...prev, value] : prev.filter((param) => param !== value)
    );
  };

  // Handle sport selection
  const handleSportChange = (e) => {
    const { value, checked } = e.target;
    setSelectedSports((prev) =>
      checked ? [...prev, value] : prev.filter((sport) => sport !== value)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3001/api/esercizi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          descrizione,
          id_esperto: "1", // Assuming you are passing this value dynamically
          id_sport: selectedSports,
          id_parametro: selectedParams,
        }),
      });

      if (!res.ok) {
        throw new Error("Errore nell'aggiunta dell'esercizio");
      }
      navigate("/esercizi"); // Torna alla lista degli esercizi
    } catch (err) {
      console.error("Errore nell'aggiunta dell'esercizio:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nome:</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
      </div>
      <div>
        <label>Descrizione:</label>
        <input
          type="text"
          value={descrizione}
          onChange={(e) => setDescrizione(e.target.value)}
        />
      </div>

      <div>
        <label>Seleziona i parametri:</label>
        {parameters.map((param) => (
          <div key={param._id}>
            <input
              type="checkbox"
              value={param._id}
              onChange={handleParamChange}
            />
            <label>{param.nome}</label>
          </div>
        ))}
      </div>

      <div>
        <label>Seleziona gli sport:</label>
        {sports.map((sport) => (
          <div key={sport._id}>
            <input
              type="checkbox"
              value={sport._id}
              onChange={handleSportChange}
            />
            <label>{sport.nome}</label>
          </div>
        ))}
      </div>

      <button type="submit">Aggiungi Esercizio</button>
    </form>
  );
};

export default InserimentoEsercizi;
