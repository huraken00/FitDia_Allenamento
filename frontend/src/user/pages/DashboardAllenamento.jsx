import React from "react";
import { Link } from "react-router-dom";

const DashboardAllenamento = () => {
  return (
    <div>
      <h2>Dashboard Allenamento</h2>
      {/* Altri componenti della dashboard */}
      <Link to="/varianti-esercizi">Genera Varianti degli Esercizi</Link>
    </div>
  );
};

export default DashboardAllenamento;