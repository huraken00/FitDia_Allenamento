import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div>
      <h1>Benvenuto su FitDia</h1>
      <p>La tua web app per gestire dieta e allenamento in modo intelligente.</p>
      <Link to="/registerUser">Registrati</Link>
      <br />
      <Link to="/loginUser">Accedi</Link>
    </div>
  );
}

export default HomePage;