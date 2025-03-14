import React from "react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/card";


  const handleCardClick = () => {
    console.log('Card clicked!');
  }

// Dashboard Component
const Dashboard = () => {

  return (
    <div>
      <h1>Dashboard Fitness</h1>
      
      <Card 
        title = "Alimentazione"
        description="Visualizza le informazioni nutrizionali"
        onClick={handleCardClick}
      />
       <Card 
        title = "Allenamento"
        description="Gestisci i tuoi allenamenti"
        onClick={handleCardClick}
      />
      
    </div>
  );
};


// Alimentazione Component
const Alimentazione = () => {
  return (
    <div>
      <h1>Sezione Alimentazione</h1>
      <p>Qui puoi monitorare le tue calorie, macronutrienti e altro.</p>
    </div>
  );
};

// Allenamento Component
const Allenamento = () => {
  return (
    <div>
      <h1>Sezione Allenamento</h1>
      <p>Qui puoi gestire i tuoi allenamenti e monitorare i progressi.</p>
    </div>
  );
};

export default Dashboard;