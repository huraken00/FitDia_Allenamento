import React from "react";
import {useNavigate } from "react-router-dom";
import Card from "../../components/ui/card";
import styles from "./Dashboard.module.css"; // Importa il modulo CSS

const Dashboard = () => {
  const navigate = useNavigate();

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className={styles.container}>
  

      <h2 className={styles.title}>Benvenuto nella tua Dashboard</h2>

      <div className={styles.cardContainer}>
        <Card
          title="Alimentazione"
          description="Visualizza le informazioni nutrizionali"
          onClick={() => handleCardClick("/alimentazione")}
          className={styles.card}
        />
        <Card
          title="Allenamento"
          description="Gestisci i tuoi allenamenti"
          onClick={() => handleCardClick("/dashboard-allenamento")}
          className={styles.card}
        />
      </div>
    </div>
  );
};

export default Dashboard;
