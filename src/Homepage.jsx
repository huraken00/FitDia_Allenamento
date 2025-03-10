import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div>
      <h1>Benvenuto su FitDia</h1>
      <p>La tua web app per gestire dieta e allenamento in modo intelligente.</p>
      <Link to="/register">Registrati</Link>
      <br />
      <Link to="/login">Accedi</Link>
    </div>
  );
}

export default HomePage;