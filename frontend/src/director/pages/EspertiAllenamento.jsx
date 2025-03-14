import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const EspertiAllenamento = () => {
  const [esperti, setEsperti] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login-direttore");
      return;
    }

    const fetchData = async () => {
      try {
        // Verifica dell'autenticazione del direttore
        const authRes = await fetch("http://localhost:3001/api/direttore/check-auth", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!authRes.ok) {
          throw new Error("Accesso non autorizzato");
        }

        // Recupero della lista esperti solo se l'autenticazione ha avuto successo
        const res = await fetch("http://localhost:3001/api/esperti-allenamento");
        if (!res.ok) throw new Error("Errore nel recupero degli esperti");

        const data = await res.json();
        setEsperti(data);
      } catch (err) {
        if (err.message === "Accesso non autorizzato") {
          // Solo in caso di errore di autenticazione, rimuoviamo il token
          localStorage.removeItem("token");
          navigate("/login-direttore");
        } else {
          // Se l'errore riguarda il recupero dei dati, non rimuoviamo il token
          console.error("Errore nel recupero degli esperti:", err);
        }
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div>
      <h2>Lista Esperti Allenamento</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          {esperti.map((esperto, index) => (
            <tr key={index}>
              <td>{esperto.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to ="/inserimento-esperti-allenamento">Inserisci un nuovo esperto</Link>
    </div>
  );
};

export default EspertiAllenamento;