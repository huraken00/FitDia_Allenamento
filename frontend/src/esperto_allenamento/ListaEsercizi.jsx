import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./ListaEsercizi.module.css"; // Importa il modulo CSS

const Esercizi = () => {
  const [esercizi, setEsercizi] = useState([]);
  const [filteredEsercizi, setFilteredEsercizi] = useState([]);
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState("");
  const [parametroFilter, setParametroFilter] = useState("");
  const [sportOptions, setSportOptions] = useState([]);
  const [parametroOptions, setParametroOptions] = useState([]);

  useEffect(() => {
    fetchEsercizi();
    fetchSportAndParametri();
  }, []);

  useEffect(() => {
    filterEsercizi();
  }, [search, sportFilter, parametroFilter, esercizi]);

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
      setFilteredEsercizi(data);
    } catch (err) {
      console.error("Errore nel recupero degli esercizi:", err);
    }
  };

  const fetchSportAndParametri = async () => {
    try {
      const sportRes = await fetch("http://localhost:3001/api/sport");
      const parametriRes = await fetch("http://localhost:3001/api/parametri");
      const sportData = await sportRes.json();
      const parametriData = await parametriRes.json();
      setSportOptions(sportData);
      setParametroOptions(parametriData);
    } catch (err) {
      console.error("Errore nel recupero di sport e parametri:", err);
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

  const filterEsercizi = () => {
    let filtered = esercizi.filter((esercizio) =>
      esercizio.nome.toLowerCase().includes(search.toLowerCase())
    );

    if (sportFilter) {
      filtered = filtered.filter((esercizio) =>
        esercizio.sport.some((s) => s._id === sportFilter)
      );
    }

    if (parametroFilter) {
      filtered = filtered.filter((esercizio) =>
        esercizio.parametri.some((p) => p._id === parametroFilter)
      );
    }

    setFilteredEsercizi(filtered);
  };

  return (
    <div className={styles.container}>
      <h2>Lista di tutti gli esercizi</h2>
      <input
        type="text"
        placeholder="Cerca per nome..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.input}
      />
      <select onChange={(e) => setSportFilter(e.target.value)} className={styles.select}>
        <option value="">Filtra per sport</option>
        {sportOptions.map((sport) => (
          <option key={sport._id} value={sport._id}>{sport.nome}</option>
        ))}
      </select>
      <select onChange={(e) => setParametroFilter(e.target.value)} className={styles.select}>
        <option value="">Filtra per parametro</option>
        {parametroOptions.map((parametro) => (
          <option key={parametro._id} value={parametro._id}>{parametro.nome}</option>
        ))}
      </select>
      <Link className={styles.link} to="/inserimento-esercizi">
        Inserisci un nuovo esercizio
      </Link>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
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
            {filteredEsercizi.map((esercizio) => (
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
                    <button className={styles.button}>Modifica</button>
                  </Link>
                  <button onClick={() => handleDelete(esercizio._id)} className={styles.button}>Elimina</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Esercizi;