import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import styles from "./Profilo.module.css"; // nuovo file CSS



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
    const limits = {
      Obiettivo_Kcal: { min: 0, max: 10000 },
      Obiettivo_proteine: { min: 0, max: 1000 },
      Obiettivo_carboidrati: { min: 0, max: 1000 },
      Obiettivo_grassi: { min: 0, max: 1000 },
    };
    if (limits[name] && (numValue < limits[name].min || numValue > limits[name].max)) return;
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

      if (!res.ok) throw new Error("Errore nel salvataggio delle modifiche");

      const data = await res.json();
      setUser(data);
      setEditing(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  if (!user) return <p>Caricamento...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
       
      

        <div className={styles.field}>
          <label>Nome:</label>
          {editing ? (
            <input type="text" name="nome" value={updatedUser.nome} onChange={handleChange} />
          ) : (
            <p>{user.nome}</p>
          )}
        </div>

        <div className={styles.field}>
          <label>Cognome:</label>
          {editing ? (
            <input type="text" name="cognome" value={updatedUser.cognome} onChange={handleChange} />
          ) : (
            <p>{user.cognome}</p>
          )}
        </div>

        <div className={styles.field}>
          <label>Email:</label>
          <p>{user.email}</p>
        </div>

        <div className={styles.field}>
          <label>Scadenza Abbonamento:</label>
          <p>{new Date(user.scadenza_abbonamento).toLocaleDateString()}</p>
        </div>

        {["Obiettivo_Kcal", "Obiettivo_proteine", "Obiettivo_carboidrati", "Obiettivo_grassi"].map((field) => (
          <div className={styles.field} key={field}>
            <label>{field.replace("_", " ")}:</label>
            {editing ? (
              <input
                type="number"
                name={field}
                value={updatedUser[field]}
                onChange={handleChange}
              />
            ) : (
              <p>{user[field]}</p>
            )}
          </div>
        ))}

        {editing ? (
          <button className={styles.button} onClick={handleSave}>Salva</button>
        ) : (
          <button className={styles.button} onClick={() => setEditing(true)}>Modifica</button>
        )}
      </div>
    </div>
  );
};

export default Profilo;
