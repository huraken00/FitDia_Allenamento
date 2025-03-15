const express = require("express");
const { check } = require("express-validator");
const { login, register, getUsers, getUser, setUser } = require("../controllers/user-controllers");

const router = express.Router();

// Registrazione utente con validazione
router.post(
  "/register",
  [
    check("nome").not().isEmpty(),
    check("cognome").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  register
);

// Login utente
router.post("/login", login);

// Rotta per ottenere la lista degli utenti con nome, cognome e scadenza abbonamento
router.get("/", getUsers);

// Rotta per ottenere l'id dell'utente 
router.get("/:uid", getUser);

// Rotta per impostare i valori dell' utente
router.put("/:uid",setUser);

module.exports = router;
