const Sport= require("../models/sport")
exports.getAllSports = async (req, res) => {
  try {
    const sports = await Sport.find();
    return res.status(200).json(sports);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Errore nel recupero degli sport." });
  }
};


