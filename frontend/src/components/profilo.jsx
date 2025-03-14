import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../shared/context/auth-context";

const Profilo = () => {
  const [user, setUser] = useState(null);
  const  auth  = useContext(AuthContext);
  const uid = auth.userId;
 
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        
        const res = await fetch(`http://localhost:3001/api/user/${uid}`, {    
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("frontend id",uid);
        if (!res.ok) {
          throw new Error("Errore nel recupero del profilo utente");
        }

        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchUserProfile();
  }, []);

  if (!user) {
    return <p>Caricamento...</p>;
  }

  return (
    <div>
      <h2>Profilo Utente</h2>
      <p>Nome: {user.nome}</p>
      <p>Cognome: {user.cognome}</p>
      <p>Email: {user.email}</p>
      <p>Scadenza Abbonamento: {new Date(user.scadenza_abbonamento).toLocaleDateString()}</p>
      <p>Obbiettivo Kcal: {user.Obiettivo_Kcal}</p>
      <p>Obbiettivo proteine: {user.Obiettivo_proteine}</p>
      <p>Obiettivo carboidrati: {user.Obiettivo_carboidrati}</p>
      <p>Obiettivo grassi: {user.Obiettivo_grassi}</p>
    </div>
  );
};

export default Profilo;
