import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login-direttore");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/direttore/check-auth", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Accesso non autorizzato");
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/login-direttore");
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div>
      <h1>Homepage Direttore</h1>
      <Link to="/lista-utenti">Lista utenti</Link>
      <br />
      <Link to="/esperti-allenamento">Esperti allenamento</Link>
    </div>
  );
};

export default HomePage;