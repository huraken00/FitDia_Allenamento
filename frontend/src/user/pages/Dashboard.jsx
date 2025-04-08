import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../components/ui/card";



// Dashboard Component
const Dashboard = () => {
  const navigate = useNavigate(); // Hook per la navigazione

  const handleCardClick = (path) => {
    navigate(path); // Esegue la navigazione
  };

  return (
    <div>
      
       <Link to={`/profilo`}>
                  <button>Profilo</button>
                </Link>
      

      <Card 
        title="Alimentazione"
        description="Visualizza le informazioni nutrizionali"
        onClick={() => handleCardClick("/alimentazione")}
      />
      <Card 
        title="Allenamento"
        description="Gestisci i tuoi allenamenti"
        onClick={() => handleCardClick("/dashboard-allenamento")}
      />
      
    </div>
  );
};

export default Dashboard;
