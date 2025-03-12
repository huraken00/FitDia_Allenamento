const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();  // Recupera tutti gli utenti
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Errore del server" });
  }
};
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Genera il token JWT
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.SECRET_KEY, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
exports.register = async (req, res) => {
  const { nome, cognome, email, password } = req.body;
  try {
    // Controlla se l'utente esiste già
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Cifra la password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crea un nuovo utente
    const newUser = new User({
      nome,
      cognome,
      email,
      password: hashedPassword,
    });

    // Salva l'utente nel database
    await newUser.save();

    // Genera il token JWT
    const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.SECRET_KEY, { expiresIn: "1h" });

    res.status(201).json({ message: "Registration successful", token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
