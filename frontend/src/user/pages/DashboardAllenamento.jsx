import React from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // 👈 Aggiungi questa riga
import ListaAllenamenti from "./ListaAllenamenti";
import styles from "./DashboardAllenamento.module.css"; // 👈 Se non ce l’hai, puoi crearlo

const DashboardAllenamento = () => {
  return (
    <div className={styles.container}>

      <h2 className={styles.title}>Dashboard Allenamento</h2>
      <p>Benvenuto nella tua dashboard allenamento!</p>

      <h3 className={styles.subtitle}>Lista degli Allenamenti</h3>
      <ListaAllenamenti />

      <div className={styles.buttonGroup}>
        <Link to="/crea-allenamento">
          <button className={styles.button}>Crea e Avvia Nuovo Allenamento</button>
        </Link>
        <Link to="/monitoraggio-progressi">
          <button className={styles.button}>Monitora i Progressi</button>
        </Link>
        <Link to="/varianti-esercizi">
          <button className={styles.button}>Genera Varianti degli Esercizi</button>
        </Link>
      </div>
    </div>
  );
};

export default DashboardAllenamento;
