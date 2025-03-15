require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const direttore_routes = require("./routes/direttore-routes");
const user_routes = require("./routes/user-routes")
const esperto_routes = require("./routes/esperto-allenamento-routes");
const esercizi_routes = require("./routes/esercizi-routes");

const app = express();
app.use(cors());

app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI
mongoose.connect(MONGODB_URI);

app.use("/api/direttore", direttore_routes);
app.use("/api/user", user_routes);
// Usa le route degli esperti di allenamento
app.use("/api/esperti-allenamento", esperto_routes);
app.use("/api/esercizi",esercizi_routes);


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})