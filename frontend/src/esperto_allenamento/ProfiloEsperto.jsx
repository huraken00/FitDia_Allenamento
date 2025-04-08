import { useState } from "react";
import { useContext } from "react";
import {AuthContext} from "../shared/context/auth-context"
import {useNavigate} from "react-router-dom";

const ProfiloEsperto = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate=useNavigate();
  const auth = useContext(AuthContext);
  const eid = auth.userId;
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3001/api/esperti-allenamento/${eid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (res.ok) {
        alert("Esperto aggiornato con successo!");
      } else {
        alert("Errore: Impossibile aggiornare l'esperto");
      }
    } catch (err) {
      alert("Si è verificato un errore durante l'aggiornamento.");
    }
  };

  return (
    <div>
      <h2>Profilo Esperto</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit"  onClick={() => navigate("/homepage-esperto")}>Salva</button>
      </form>
    </div>
  );
};

export default ProfiloEsperto;