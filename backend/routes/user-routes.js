const express = require("express");
const { login } = require("../controllers/user-controllers");
const { register } = require("../controllers/user-controllers");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

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
