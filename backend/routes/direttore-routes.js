const express = require("express");
const {login} = require("../controllers/direttore-controllers");
const checkAuth = require("../middleware/check-auth"); 
const router = express.Router();

router.post("/login", login);
router.get("/check-auth", checkAuth, (req, res) => {
    res.json({ authenticated: true, user: req.user });
  });

module.exports = router;