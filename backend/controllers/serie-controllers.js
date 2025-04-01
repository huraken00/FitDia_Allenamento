
const Serie = require("../models/serie");
const Allenamento = require("../models/allenamento");
const Esercizio = require("../models/esercizio");

// Funzione per recuperare tutte le serie associate a un allenamento
exports.getAllSerie = async (req, res) => {
  try {
    const serie = await Serie.find({ id_allenamento: req.params.allenamentoId })
      .populate("id_esercizio")
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

// Funzione per creare una nuova serie
exports.createSerie = async (req, res) => {
  const { peso, distanza, durata, ripetizioni, id_allenamento, id_esercizio } = req.body;

  // Verifica che id_allenamento e id_esercizio siano presenti
  if (!id_allenamento || !id_esercizio) {
    return res.status(400).json({ message: "id_allenamento e id_esercizio sono obbligatori" });
  }

  try {
    const nuovaSerie = new Serie({
      peso,
      distanza,
      durata,
      ripetizioni,
      id_allenamento,
      id_esercizio,
    });

    const serieSalvata = await nuovaSerie.save();
    return res.status(201).json(serieSalvata);
  } catch (error) {
    console.error("Errore nel salvataggio della serie:", error);
    return res.status(500).json({ message: "Errore interno del server" });
  }
};