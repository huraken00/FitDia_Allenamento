import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../shared/context/auth-context";

const Profilo = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const auth = useContext(AuthContext);
  const uid = auth.userId;
  const token = auth.token;

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

        if (!res.ok) {
          throw new Error("Errore nel recupero del profilo utente");
        }

        const data = await res.json();
        setUser(data);
        setUpdatedUser(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchUserProfile();
  }, [uid, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numValue = value === "" ? 0 : Number(value);
    
    // Definizione dei limiti
    const limits = {
      Obiettivo_Kcal: { min: 0, max: 10000 },
      Obiettivo_proteine: { min: 0, max: 1000 },
      Obiettivo_carboidrati: { min: 0, max: 1000 },
      Obiettivo_grassi: { min: 0, max: 1000 }
    };
    
    if (limits[name]) {
      if (numValue < limits[name].min || numValue > limits[name].max) {
        return;
      }
    }
    
    setUpdatedUser((prev) => ({ ...prev, [name]: numValue }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/user/${uid}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      if (!res.ok) {
        throw new Error("Errore nel salvataggio delle modifiche");
      }

      const data = await res.json();
      setUser(data);
      setEditing(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  if (!user) {
    return <p>Caricamento...</p>;
  }

  return (
    <div>
      <h2>Profilo Utente</h2>
      <p>Nome: {editing ? <input type="text" name="nome" value={updatedUser.nome} onChange={handleChange} /> : user.nome}</p>
      <p>Cognome: {editing ? <input type="text" name="cognome" value={updatedUser.cognome} onChange={handleChange} /> : user.cognome}</p>
      <p>Email: {user.email}</p>
      <p>Scadenza Abbonamento: {new Date(user.scadenza_abbonamento).toLocaleDateString()}</p>
      <p>Obbiettivo Kcal: {editing ? <input type="number" name="Obiettivo_Kcal" value={updatedUser.Obiettivo_Kcal} onChange={handleChange} min="0" max="10000" /> : user.Obiettivo_Kcal}</p>
      <p>Obbiettivo proteine: {editing ? <input type="number" name="Obiettivo_proteine" value={updatedUser.Obiettivo_proteine} onChange={handleChange} min="0" max="1000" /> : user.Obiettivo_proteine}</p>
      <p>Obiettivo carboidrati: {editing ? <input type="number" name="Obiettivo_carboidrati" value={updatedUser.Obiettivo_carboidrati} onChange={handleChange} min="0" max="1000" /> : user.Obiettivo_carboidrati}</p>
      <p>Obiettivo grassi: {editing ? <input type="number" name="Obiettivo_grassi" value={updatedUser.Obiettivo_grassi} onChange={handleChange} min="0" max="1000" /> : user.Obiettivo_grassi}</p>
      {editing ? (
        <button onClick={handleSave}>Salva</button>
      ) : (
        <button onClick={() => setEditing(true)}>Modifica</button>
      )}
    </div>
  );
};

export default Profilo;
