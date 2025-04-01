const mongoose = require("mongoose");
const Allenamento = require("../models/allenamento");
const Serie = require("../models/serie");

// Recupera tutti gli allenamenti per un determinato utente
exports.getAllAllenamenti = async (req, res) => {
  try {
    console.log("Richiesta allenamenti per utente:", req.params.utenteId); // DEBUG
    const allenamenti = await Allenamento.find({ id_utente: req.params.utenteId }).exec();

    if (!allenamenti || allenamenti.length === 0) {
      return res.status(404).json({ message: "Nessun allenamento trovato" });
    }

    return res.status(200).json(allenamenti);
  } catch (err) {
    console.error("Errore durante il recupero degli allenamenti:", err);
    return res.status(500).json({ message: "Errore interno del server" });
  }
};

// Aggiunge un allenamento e le sue serie al database
exports.createAllenamento = async (req, res) => {
  try {
    const { nome, appuntiAllenamento, id_utente, serie } = req.body;

    if (!nome || !id_utente) {
      return res.status(400).json({ message: "Nome e id_utente sono obbligatori" });
    }

    // Creazione dell'allenamento con la data automatica
    const nuovoAllenamento = new Allenamento({
      nome,
      appuntiAllenamento,
      id_utente,
      data: new Date(), // ✅ Data generata automaticamente
    });

    const allenamentoSalvato = await nuovoAllenamento.save();

    // Se ci sono serie, le salviamo col riferimento all'allenamento
    if (Array.isArray(serie) && serie.length > 0) {
      const serieDaSalvare = serie.map((s) => ({
        peso: s.peso || null,
        distanza: s.distanza || null,
        durata: s.durata || null,
        ripetizioni: s.ripetizioni || null,
        id_allenamento: allenamentoSalvato._id, // Collega la serie all'allenamento
        id_esercizio: s.id_esercizio, // Associa la serie a un esercizio
      }));

      // Inserisce tutte le serie in un'unica operazione
      await Serie.insertMany(serieDaSalvare);
    }

    return res.status(201).json({
      message: "Allenamento e serie inseriti con successo",
      allenamento: allenamentoSalvato,
    });
  } catch (error) {
    console.error("Errore durante la creazione dell'allenamento:", error);
    return res.status(500).json({ message: "Errore nell'inserimento dell'allenamento.", error });
  }
};
