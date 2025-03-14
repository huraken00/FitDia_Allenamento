import { Link } from "react-router-dom";

const HomePage = () => {
  

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