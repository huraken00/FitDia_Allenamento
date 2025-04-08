import React from "react";
import { Link } from "react-router-dom";
import ListaAllenamenti from "./ListaAllenamenti"; // Importa la componente ListaAllenamenti

const DashboardAllenamento = () => {
  return (
    <div>
      <h2>Dashboard Allenamento</h2>
      <p>Benvenuto nella tua dashboard allenamento!</p>
      
      

      {/* Renderizza la lista degli allenamenti */}
      <ListaAllenamenti />

      {/* Pulsante per creare un nuovo allenamento */}
      <Link to="/crea-allenamento">
        <button>Crea Nuovo Allenamento</button>
      </Link>

      {/* Pulsante per andare alla pagina di monitoraggio degli esercizi */}
      <Link to="/monitoraggio-progressi">
        <button>Monitora i Progressi</button>
      </Link>

      {/* Pulsante per generare varianti degli esercizi */}
      <Link to="/varianti-esercizi">
        <button>Genera Varianti degli Esercizi</button>
      </Link>
    </div>
  );
};

export default DashboardAllenamento;

