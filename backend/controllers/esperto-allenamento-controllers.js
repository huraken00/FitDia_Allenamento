const Esperto = require("../models/esperto-allenamento");
const bcrypt = require("bcryptjs");

// controller per usernames degli esperti
exports.getEsperti = async (req, res) => {
  try {
    // Ottieni solo gli username degli esperti
    const esperti = await Esperto.find({}, "username"); // Seleziona solo il campo "username"
    res.status(200).json(esperti);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero degli esperti", error });
  }
};

//controller per inserire un nuovo esperto
exports.inserimentoEsperti = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Verifica se l'username esiste già
    const esistente = await Esperto.findOne({ username });
    if (esistente) {
      return res.status(400).json({ error: "Username già in uso" });
    }

    // Criptare la password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Creare il nuovo esperto
    const nuovoEsperto = new Esperto({
      username,
      password: hashedPassword,
    });

    await nuovoEsperto.save();
    res.status(201).json({ message: "Esperto aggiunto con successo" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore interno del server" });
  }
};
