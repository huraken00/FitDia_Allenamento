// controllers/allenamentoController.js
const Allenamento = require("../models/allenamento");
const Serie = require("../models/serie");

// Recupera tutti gli allenamenti per un determinato utente
exports.getAllAllenamenti = async (req, res) => {
  try {
    // Recupera allenamenti dell'utente
    const allenamenti = await Allenamento.find({ utente: req.params.utenteId })
      .populate({
        path: "serie", // Popola il campo serie con i dati relativi
        populate: {
          path: "esercizio", // Popola il campo esercizio con i dati relativi
        },
      })
      .exec();

    if (!allenamenti) {
      return res.status(404).json({ message: "Nessun allenamento trovato" });
    }

    return res.status(200).json(allenamenti);
  } catch (err) {
    console.error("Errore durante il recupero degli allenamenti:", err);
    return res.status(500).json({ message: "Errore interno del server" });
  }
};

// Aggiungi un allenamento al database (per esempio in caso di creazione di un nuovo allenamento)
 exports.createAllenamento = async (req, res) => {
  try {
    const { nome, appuntiAllenamento, serie } = req.body;

    const newAllenamento = new Allenamento({
      nome,
      appuntiAllenamento,
      utente: req.params.utenteId, // L'utente è preso dai parametri della richiesta
      serie,
    });

    await newAllenamento.save();
    return res.status(201).json(newAllenamento);
  } catch (err) {
    console.error("Errore durante la creazione dell'allenamento:", err);
    return res.status(500).json({ message: "Errore interno del server" });
  }
};

