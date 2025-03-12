const express = require("express");
const { check } = require("express-validator");

const usersController = require("../controllers/user-controllers");

const router = express.Router();

// Ottieni tutti gli utenti
router.get("/", usersController.getUsers);

// Registrazione utente
router.post(
  "/register",
  [
    check("nome").not().isEmpty(),
    check("cognome").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersController.register
);

// Login utente
router.post("/login", usersController.login);

module.exports = router;
