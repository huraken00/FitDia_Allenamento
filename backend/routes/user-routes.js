const express = require("express");
const { check } = require("express-validator");
const { login, register } = require("../controllers/user-controllers");

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

module.exports = router;
