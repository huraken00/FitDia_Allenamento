import React, { useState } from 'react';
import styles from './Register.module.css';
import validateForm from "../../shared/utils/validateForm";
import ErrorMessage from '../../components/ErrorMessage';

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    nome: "",
    cognome: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerMessage("");

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

        if (!response.ok) {
          // Mostra il messaggio dal backend
          throw new Error(data.message || "Errore nella registrazione");
        }

        setServerMessage("Registrazione avvenuta con successo!");
      } catch (error) {
        setServerMessage(error.message);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.formBox} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Registrati su FitDia</h2>

        <label className={styles.label}>Username:</label>
        <input
          className={styles.input}
          type="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
        {errors.username && <p className={styles.error}>{errors.username}</p>}

        <label className={styles.label}>Nome:</label>
        <input
          className={styles.input}
          type="name"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
        />
        {errors.nome && <p className={styles.error}>{errors.nome}</p>}

        <label className={styles.label}>Cognome:</label>
        <input
          className={styles.input}
          type="cognome"
          name="cognome"
          value={formData.cognome}
          onChange={handleChange}
        />
        {errors.cognome && <p className={styles.error}>{errors.cognome}</p>}

        <label className={styles.label}>Email:</label>
        <input
          className={styles.input}
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className={styles.error}>{errors.email}</p>}

        <label className={styles.label}>Password:</label>
        <input
          className={styles.input}
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <p className={styles.error}>{errors.password}</p>}

        <button className={styles.button} type="submit">Registrati</button>

        <ErrorMessage message={serverMessage} />
      </form>
    </div>
  );
}

export default Register;

