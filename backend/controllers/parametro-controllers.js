const Parametro = require("../models/parametro");

exports.getAllParametri = async (req, res) => {
    try {
        const parametri = await Parametro.find();
        return res.status(200).json(parametri);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Errore nel recupero dei parametri." });
    }
};