import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/ui/card";

// Dashboard Component
const Dashboard = () => {
  const navigate = useNavigate(); // Hook per la navigazione

  const handleCardClick = (path) => {
    navigate(path); // Esegue la navigazione
  };

  return (
    <div>
      <h1>Dashboard Fitness</h1>

      <Card 
        title="Alimentazione"
        description="Visualizza le informazioni nutrizionali"
        onClick={() => handleCardClick("/alimentazione")}
      />
      <Card 
        title="Allenamento"
        description="Gestisci i tuoi allenamenti"
        onClick={() => handleCardClick("/DashboardAllenamento")}
      />
      
    </div>
  );
};

export default Dashboard;
