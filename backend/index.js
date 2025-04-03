require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const direttore_routes = require("./routes/direttore-routes");
const user_routes = require("./routes/user-routes");
const esperto_routes = require("./routes/esperto-allenamento-routes");
const esercizi_routes = require("./routes/esercizi-routes");
const sport_routes = require("./routes/sport-routes");
const parametro_routes = require("./routes/parametri-routes");
const allenamento_routes = require("./routes/allenamenti-routes");
const serie_routes = require("./routes/serie-routes");

const app = express();
app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI);

app.use("/api/direttore", direttore_routes);
app.use("/api/user", user_routes);
app.use("/api/esperti-allenamento", esperto_routes);
app.use("/api/allenamenti", allenamento_routes);  // Usato "/api/allenamenti" per gli allenamenti
app.use("/api/serie", serie_routes);  // Usato "/api/serie" per le serie
app.use("/api/esercizi", esercizi_routes);
app.use("/api/sport", sport_routes);
app.use("/api/parametri", parametro_routes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
