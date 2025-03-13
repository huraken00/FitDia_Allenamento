import React from 'react';
import { useState } from "react";
import validateForm from "../../shared/utils/validateForm";

function Register() {
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
/*Come viene individuato il campo corretto?

e.target.name contiene il nome del campo (name="nome", name="email", ecc.).
e.target.value è il valore attuale del campo, ovvero ciò che l'utente sta digitando.
[e.target.name]: e.target.value permette di aggiornare dinamicamente il valore del campo corretto senza dover scrivere un aggiornamento manuale per ogni campo.*/
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    
    if (Object.keys(validationErrors).length === 0) {
      alert("Registrazione avvenuta con successo!");
      // Qui puoi aggiungere la logica per inviare i dati a un server
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div>
      <h2>Registrati su FitDia</h2>
      <form onSubmit={handleSubmit}>
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
    </div>
  );
}

export default Register;
