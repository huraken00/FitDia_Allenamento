const jwt = require("jsonwebtoken");
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

exports.loginEsperto = async (req, res) => {
  const { username, password } = req.body;
  try {
    console.log("Dati ricevuti dal frontend:", req.body);
    const esperto = await Esperto.findOne({ username });

    if (!esperto) return res.status(400).json({ message: "User not found" });
    const isMatch = await bcrypt.compare(password, esperto.password);

    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    const currentDate = new Date();

    

    // Genera il token JWT
    const token = jwt.sign({ id: esperto._id, email: esperto.email }, process.env.SECRET_KEY, { expiresIn: "1h" });
    const id = esperto._id;

    res.status(200).json({ message: "Login successful", token, id });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
exports.updateEsperto = async (req, res) => {
  const id = req.params.eid;
  const updatedData = { ...req.body }; // Clona i dati in arrivo

  try {
    // Se il client ha inviato una nuova password, hashala prima
    if (updatedData.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(updatedData.password, salt);
      updatedData.password = hashedPassword;
    }

    // Trova e aggiorna l'esperto
    const esperto = await Esperto.findOneAndUpdate(
      { _id: id },
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    if (!esperto) {
      return res.status(404).json({ message: "Esperto non trovato" });
    }

    res.status(200);
  } catch (error) {
    console.error("Errore nell'aggiornamento esperto:", error);
    res.status(500).json({ message: "Errore nell'aggiornamento", error });
  }
};

// controller per ottenere un esperto specifico
exports.getEspertoById = async (req, res) => {
  const id = req.params.eid;

  try {
    const esperto = await Esperto.findById(id, "username");
    if (!esperto) {
      return res.status(404).json({ message: "Esperto non trovato" });
    }

    res.status(200).json(esperto);
  } catch (error) {
    console.error("Errore nel recupero esperto:", error);
    res.status(500).json({ message: "Errore nel recupero esperto", error });
  }
};


// controller per eliminare un esperto
exports.eliminaEsperto = async (req, res) => {
  const id = req.params.eid;

  try {
    const espertoEliminato = await Esperto.findByIdAndDelete(id);

    if (!espertoEliminato) {
      return res.status(404).json({ message: "Esperto non trovato" });
    }

    res.status(200).json({ message: "Esperto eliminato con successo" });
  } catch (error) {
    console.error("Errore nell'eliminazione dell'esperto:", error);
    res.status(500).json({ message: "Errore nell'eliminazione", error });
  }
};
