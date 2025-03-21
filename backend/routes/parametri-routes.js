const express = require("express");
const { getAllParametri } = require("../controllers/parametro-controllers");

const router = express.Router();

router.get("/", getAllParametri);

module.exports = router;
