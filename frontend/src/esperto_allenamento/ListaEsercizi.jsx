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

  const handleDelete = async (id) => {
    const conferma = window.confirm("Sei sicuro di voler eliminare questo esercizio?");
    if (!conferma) return;

    try {
      const res = await fetch(`http://localhost:3001/api/esercizi/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        throw new Error("Errore nella cancellazione dell'esercizio");
      }

      setEsercizi(esercizi.filter((esercizio) => esercizio._id !== id));
    } catch (err) {
      console.error("Errore durante la cancellazione:", err);
    }
  };

  return (
    <div>
      <h2>Lista di tutti gli esercizi</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrizione</th>
            <th>Parametri</th>
            <th>Sport</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {esercizi.map((esercizio) => (
            <tr key={esercizio._id}>
              <td>{esercizio.nome}</td>
              <td>{esercizio.descrizione}</td>
              <td>
                {esercizio.parametri && esercizio.parametri.length > 0 ? (
                  <ul>
                    {esercizio.parametri.map((parametro) => (
                      <li key={parametro._id}>{parametro.nome}</li>
                    ))}
                  </ul>
                ) : (
                  <span>Nessun parametro</span>
                )}
              </td>
              <td>
                {esercizio.sport && esercizio.sport.length > 0 ? (
                  <ul>
                    {esercizio.sport.map((sport) => (
                      <li key={sport._id}>{sport.nome}</li>
                    ))}
                  </ul>
                ) : (
                  <span>Nessuno sport associato</span>
                )}
              </td>
              <td>
                <Link to={`/modifica-esercizio/${esercizio._id}`}>
                  <button>Modifica</button>
                </Link>
                <button onClick={() => handleDelete(esercizio._id)}>Elimina</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/inserimento-esercizi">Inserisci un nuovo esercizio</Link>
    </div>
  );
};

export default Esercizi;
