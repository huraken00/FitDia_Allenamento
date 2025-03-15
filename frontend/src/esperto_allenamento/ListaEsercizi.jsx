import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Esercizi = () => {
  const [esercizi, setEsercizi] = useState([]);

  useEffect(() => {
    fetchEsercizi();
  }, []);

  const fetchEsercizi = async () => {
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
      setEsercizi(data);
    } catch (err) {
      console.error("Errore nel recupero degli esercizi:", err);
    }
  };

  return (
    <div>
      <h2>Lista di tutti gli esercizi</h2>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrizione</th>
            <th>Esperto</th>
            <th>Sport</th>
            <th>Parametri</th>
          </tr>
        </thead>
        <tbody>
          {esercizi.map((esercizio, index) => (
            <tr key={index}>
              <td>{esercizio.nome}</td>
              <td>{esercizio.descrizione}</td>
              <td>{esercizio.id_esperto.username}</td>
              <td>{esercizio.sport ? esercizio.sport.nome : "N/A"}</td>
              <td>
                {esercizio.parametri && esercizio.parametri.length > 0
                  ? esercizio.parametri.map((parametro, idx) => (
                      <span key={idx}>{parametro.tipo}</span>
                    ))
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/inserimento-esercizio">Inserisci un nuovo esercizio</Link>
    </div>
  );
};

export default Esercizi;
