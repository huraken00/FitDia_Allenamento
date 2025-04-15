import React from "react";
import { Link } from "react-router-dom";
import styles from "./Homepage.module.css";

function HomePage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Benvenuto su FitDia</h1>
      <p className={styles.description}>
        La tua web app per gestire dieta <br /> e allenamento in modo intelligente.
      </p>
      <div className={styles.linkContainer}>
        <Link to="/register-utente" className={styles.button}>Registrati</Link>
        <Link to="/login-utente" className={styles.button}>Accedi</Link>
      </div>
    </div>
  );
}

export default HomePage;
