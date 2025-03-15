import { Link } from "react-router-dom";

const HomePage = () => {
  

  return (
    <div>
      <h1>Homepage Esperto di allenamento</h1>
      <Link to="/lista-varianti">Varianti generate </Link>
      <br />
      <Link to="/lista-esercizi">Esercizi</Link>
    </div>
  );
};

export default HomePage;