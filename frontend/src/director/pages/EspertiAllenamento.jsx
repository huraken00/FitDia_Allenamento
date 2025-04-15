import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./EspertiAllenamento.module.css";

const EspertiAllenamento = () => {
  const [esperti, setEsperti] = useState([]);
  const [filterText, setFilterText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/esperti-allenamento", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/login-direttore");
          return;
        }
        throw new Error("Errore nel recupero degli esperti");
      }

      const data = await res.json();
      setEsperti(data);
    } catch (err) {
      console.error("Errore nel recupero degli esperti:", err);
    }
  };

  const handleDelete = async (eid) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo esperto?")) return;

    try {
      const res = await fetch(`http://localhost:3001/api/esperti-allenamento/${eid}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Errore nell'eliminazione dell'esperto");

      setEsperti(esperti.filter((e) => e._id !== eid));
    } catch (err) {
      console.error("Errore durante l'eliminazione:", err);
    }
  };

  // Filtra gli esperti in base al testo inserito
  const filteredEsperti = esperti.filter((esperto) =>
    esperto.username.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Lista Esperti Allenamento</h2>

      <input
        type="text"
        placeholder="Filtra per nome..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        className={styles.searchInput}
      />

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {filteredEsperti.map((esperto, index) => (
            <tr key={index}>
              <td>{esperto.username}</td>
              <td>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(esperto._id)}
                >
                  Elimina
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link to="/inserimento-esperti-allenamento" className={styles.addLink}>
        Inserisci un nuovo esperto
      </Link>
    </div>
  );
};

export default EspertiAllenamento;