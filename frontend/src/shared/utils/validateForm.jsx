export default function validateForm(data) {
  let errors = {};

  if (!data.nome.trim()) {
    errors.nome = "Il nome è obbligatorio";
  }

  if (!data.cognome.trim()) {
    errors.cognome = "Il cognome è obbligatorio";
  }

  if (!data.email.trim()) {
    errors.email = "L'email è obbligatoria";
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = "L'email non è valida";
  }

  if (!data.password) {
    errors.password = "La password è obbligatoria";
  } else if (data.password.length < 6) {
    errors.password = "La password deve essere lunga almeno 6 caratteri";
  }

  return errors;
}