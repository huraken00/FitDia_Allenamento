const express = require("express");
const { login } = require("../controllers/user-controllers");
const { register } = require("../controllers/user-controllers");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

module.exports = router;