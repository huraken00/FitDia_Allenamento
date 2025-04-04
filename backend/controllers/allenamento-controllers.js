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

// Elimina un allenamento e tutte le sue serie collegate
exports.deleteAllenamento = async (req, res) => {
  try {
    const allenamentoId = req.params.id;

    // Verifica se l'allenamento esiste
    const allenamento = await Allenamento.findById(allenamentoId);
    if (!allenamento) {
      return res.status(404).json({ message: "Allenamento non trovato" });
    }

    // Elimina tutte le serie collegate all'allenamento
    await Serie.deleteMany({ id_allenamento: allenamentoId });

    // Elimina l'allenamento
    await Allenamento.findByIdAndDelete(allenamentoId);

    return res.status(200).json({ message: "Allenamento e serie eliminati con successo" });
  } catch (error) {
    console.error("Errore durante l'eliminazione dell'allenamento:", error);
    return res.status(500).json({ message: "Errore durante l'eliminazione dell'allenamento." });
  }
};

// Recupera i dettagli di un allenamento specifico
exports.getAllenamentoDettagli = async (req, res) => {
  try {
    const allenamentoId = req.params.id;
    
    // Trova l'allenamento per ID
    const allenamento = await Allenamento.findById(allenamentoId);
    if (!allenamento) {
      return res.status(404).json({ message: "Allenamento non trovato" });
    }
    
    // Trova tutte le serie correlate a questo allenamento
    const serie = await Serie.find({ id_allenamento: allenamentoId });

    // Restituisci l'allenamento con le sue serie
    return res.status(200).json({ ...allenamento.toObject(), serie });
  } catch (err) {
    console.error("Errore durante il recupero dei dettagli dell'allenamento:", err);
    return res.status(500).json({ message: "Errore interno del server" });
  }
};

// Funzione per aggiornare un allenamento
exports.aggiornaAllenamento = async (req, res) => {
  const { id } = req.params;  // Ottieni l'ID dell'allenamento dai parametri della URL
  const { nome, appuntiAllenamento } = req.body;  // Ottieni i nuovi dati dal body della richiesta

  try {
    // Trova l'allenamento da aggiornare
    const allenamento = await Allenamento.findById(id);

    if (!allenamento) {
      return res.status(404).json({ message: 'Allenamento non trovato' });
    }

    // Aggiorna i campi dell'allenamento
    allenamento.nome = nome || allenamento.nome;
    allenamento.appuntiAllenamento = appuntiAllenamento || allenamento.appuntiAllenamento;

    // Salva le modifiche nel database
    const allenamentoAggiornato = await allenamento.save();

    res.status(200).json(allenamentoAggiornato);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore durante l\'aggiornamento dell\'allenamento' });
  }
};