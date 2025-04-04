
const Serie = require("../models/serie");
const Esercizio = require("../models/esercizio");
const EsercizioParametro = require("../models/parametro_esercizio");
const SportEsercizio = require("../models/sport_esercizio");

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

exports.getPropEsercizio = async (req, res) => {
  try {
    const parametri = await EsercizioParametro.find({ id_esercizio: req.params.id_esercizio })
      .populate("id_parametro", "nome");

    const sportEsercizio = await SportEsercizio.find({ id_esercizio: req.params.id_esercizio })
      .populate("id_sport", "nome");

    const esercizio = await Esercizio.findById(req.params.id_esercizio).select("nome");


    // Se ci sono più sport associati, crea un array con i nomi degli sport
    const sportNames = sportEsercizio.map(se => se.id_sport.nome);
    const parametriNames=parametri.map(p=>p.id_parametro);
    res.json({
      nomeEsercizio: esercizio ? esercizio.nome : "Sconosciuto",
      sport: sportNames.length > 0 ? sportNames : ["Sconosciuto"], // Restituisci un array di sport
      parametri: parametriNames.length > 0 ? parametriNames :["Sconosciuto"],
    });

  } catch (err) {
    res.status(500).json({ error: "Errore nel recupero dei parametri e dello sport" });
  }
};

// Funzione per eliminare una serie
exports.deleteSerie = async (req, res) => {
  try {
    const serieId = req.params.id;

    // Verifica se la serie esiste
    const serie = await Serie.findById(serieId);
    if (!serie) {
      return res.status(404).json({ message: "Serie non trovata" });
    }

    // Elimina la serie
    await Serie.findByIdAndDelete(serieId);

    return res.status(200).json({ message: "Serie eliminata con successo" });
  } catch (error) {
    console.error("Errore durante l'eliminazione della serie:", error);
    return res.status(500).json({ message: "Errore durante l'eliminazione della serie" });
  }
};
