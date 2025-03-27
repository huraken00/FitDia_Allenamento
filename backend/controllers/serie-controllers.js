// controllers/serieController.js
const Serie = require("../models/serie");

// Recupera tutte le serie associate a un allenamento
 exports.getAllSerie = async (req, res) => {
  try {
    const serie = await Serie.find({ allenamento: req.params.allenamentoId })
      .populate("esercizio") // Popola il campo esercizio con i dettagli dell'esercizio
      .exec();

    if (!serie || serie.length === 0) {
      return res.status(404).json({ message: "Nessuna serie trovata per questo allenamento" });
    }

    return res.status(200).json(serie);
  } catch (err) {
    console.error("Errore durante il recupero delle serie:", err);
    return res.status(500).json({ message: "Errore interno del server" });
  }
};


