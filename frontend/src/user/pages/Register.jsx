import React, { useState } from 'react';
import validateForm from "../../shared/utils/validateForm";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    nome: "",
    cognome: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await fetch("http://localhost:3001/api/user/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (response.ok) {
          setMessage("Registrazione avvenuta con successo!");
        } else {
          setMessage(data.message || "Errore nella registrazione");
        }
      } catch (error) {
        setMessage("Errore di connessione al server");
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div>
      <h2>Registrati su FitDia</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} />
          {errors.username && <p>{errors.username}</p>}
        </div>

        <div>
          <label>Nome:</label>
          <input type="text" name="nome" value={formData.nome} onChange={handleChange} />
          {errors.nome && <p>{errors.nome}</p>}
        </div>

        <div>
          <label>Cognome:</label>
          <input type="text" name="cognome" value={formData.cognome} onChange={handleChange} />
          {errors.cognome && <p>{errors.cognome}</p>}
        </div>

        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <p>{errors.email}</p>}
        </div>

        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
          {errors.password && <p>{errors.password}</p>}
        </div>

        <button type="submit">Registrati</button>
      </form>

      {serverResponse && <p>{serverResponse}</p>}
    </div>
  );
}

export default Register;
