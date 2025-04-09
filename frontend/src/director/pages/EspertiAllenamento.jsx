import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const EspertiAllenamento = () => {
  const [esperti, setEsperti] = useState([]);
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

      // Aggiorna la lista rimuovendo l'esperto eliminato
      setEsperti(esperti.filter((e) => e._id !== eid));
    } catch (err) {
      console.error("Errore durante l'eliminazione:", err);
    }
  };

  return (
    <div>
      <h2>Lista Esperti Allenamento</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {esperti.map((esperto, index) => (
            <tr key={index}>
              <td>{esperto.username}</td>
              <td>
                <button onClick={() => handleDelete(esperto._id)}>Elimina</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/inserimento-esperti-allenamento">Inserisci un nuovo esperto</Link>
    </div>
  );
};

export default EspertiAllenamento;
