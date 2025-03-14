const Director = require("../models/direttore");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const director = await Director.findOne({ username });
    if (!director) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, director.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Genera il token JWT
    const token = jwt.sign({ id: director._id, username: director.username }, process.env.SECRET_KEY, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = login;