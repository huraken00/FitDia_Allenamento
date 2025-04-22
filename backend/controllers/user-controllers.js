const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "nome cognome scadenza_abbonamento");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Errore nel recupero degli utenti" });
  }
};

// controller utente
exports.getUser = async (req, res) => {
  const id = req.params.uid;
  try {
    console.log("id utente", id)
    // restituisce il nome e il cognome 
    const user = await User.findOne({ _id: id });
    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero dell' utente", error });
  }
};

exports.setUser = async (req, res) => {
  const id = req.params.uid;
  const updatedData = req.body; // Dati aggiornati dal client

  try {

    // Trova e aggiorna l'utente nel database
    const user = await User.findOneAndUpdate(
      { _id: id },
      { $set: updatedData },
      { new: true, runValidators: true } // Restituisce il nuovo documento aggiornato
    );

    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Errore nell'aggiornamento", error });
  }
};


//------------------------------------------------------------------------------------------------------------------------------?
// modificare con const existingUser = await User.findOne({ email, username }); ???
exports.register = async (req, res) => {
  const { username, nome, cognome, email, password } = req.body;


  try {
    // Controlla se l'utente esiste già
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash della password
    const hashedPassword = await bcrypt.hash(password, 10);

    //calcolo di scadenza_abbonamento
    const dataScadenzaAbbonamento = new Date();
    dataScadenzaAbbonamento.setMonth(dataScadenzaAbbonamento.getMonth() + 1);

    // Crea un nuovo utente
    const newUser = new User({
      username,
      nome,
      cognome,
      email,
      password: hashedPassword,
      scadenza_abbonamento: dataScadenzaAbbonamento,

    });

    // Salva l'utente nel database
    await newUser.save();

    // Genera un token JWT
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(201).json({ message: "User registered successfully", token });
  } catch (err) {
    res.status(500).json({ message: "Email già utilizzata", error: err.message });
  }
};



exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log("Dati ricevuti dal frontend:", req.body);
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
   
    const currentDate = new Date();
    //controllo della data scadenza abbonamento
    if (new Date(user.scadenza_abbonamento) < currentDate) {
      return res.status(403).json({ message: "Subscription expired. Please renew your subscription." });
    }

    // Genera il token JWT
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.SECRET_KEY, { expiresIn: "1h" });
    const id = user._id;

    res.status(200).json({ message: "Login successful", token, id });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};






