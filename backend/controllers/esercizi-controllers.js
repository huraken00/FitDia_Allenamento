const Esercizio = require("../models/esercizio");
const Sport = require("../models/sport");
const Parametro = require("../models/parametro");
const SportEsercizio = require("../models/sport_esercizio");
const ParametroEsercizio = require("../models/parametro_esercizio");

// Funzione per ottenere tutti gli esercizi con i dettagli di sport e parametri
exports.getAllEsercizi = async (req, res) => {
  try {
    const esercizi = await Esercizio.aggregate([
      {
        $lookup: {
          from: "SportEsercizio", // La collezione che unisce sport e esercizi
          localField: "_id",      // Riferimento all'ID dell'esercizio
          foreignField: "esercizio_id", // Campo nella collezione "SportEsercizio" che fa riferimento all'esercizio
          as: "sport_relazione"   // Alias per i risultati
        }
      },
      {
        $lookup: {
          from: "Sport",          // La collezione degli sport
          localField: "sport_relazione.sport_id", // Riferimento all'ID dello sport associato
          foreignField: "_id",    // Riferimento all'ID nella collezione "Sport"
          as: "sport"             // Alias per gli sport trovati
        }
      },
      {
        $lookup: {
          from: "EsercizioParametro",  // Collezione per i parametri
          localField: "_id",           // Riferimento all'ID dell'esercizio
          foreignField: "esercizio_id", // Campo nella collezione EsercizioParametro che fa riferimento all'esercizio
          as: "relazioni"              // Alias per le relazioni trovate
        }
      },
      {
        $lookup: {
          from: "Parametro",           // La collezione dei parametri
          localField: "relazioni.parametri", // Array di ObjectId dei parametri
          foreignField: "_id",         // Riferimento all'ID dei parametri nella collezione "Parametro"
          as: "parametri"              // Alias per i parametri trovati
        }
      },
      {
        $project: {
          nome: 1,
          descrizione: 1,
          sport: 1,                // Includiamo gli sport associati
          parametri: 1             // Includiamo i parametri associati
        }
      }
    ]);

    return res.status(200).json(esercizi);
  } catch (err) {
    return res.status(500).json({ message: "Errore nel recupero degli esercizi", error: err });
  }
};





// Funzione per inserire un nuovo esercizio
exports.addEsercizio = async (req, res) => {
  const { nome, descrizione, id_esperto, id_sport, id_parametro } = req.body;

  try {
    const nuovoEsercizio = new Esercizio({
      nome,
      descrizione,
      id_esperto,
      id_sport,
      id_parametro
    });

    const esercizioSalvato = await nuovoEsercizio.save();

    // Associa l'esercizio al suo sport
    const sportEsercizio = new SportEsercizio({
      id_sport,
      id_esercizio: esercizioSalvato._id,
    });
    await sportEsercizio.save();

    // Associa l'esercizio ai parametri
    const parametroEsercizio = new ParametroEsercizio({
      id_parametro,
      id_esercizio: esercizioSalvato._id,
    });
    await parametroEsercizio.save();

    return res.status(201).json({ message: "Esercizio inserito con successo", esercizio: esercizioSalvato });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Errore nell'inserimento dell'esercizio." });
  }
};
exports.getEsercizioById = async (req, res) => {
  try {
    const esercizio = await Esercizio.findById(req.params.id);
    if (!esercizio) {
      return res.status(404).json({ message: "Esercizio non trovato" });
    }
    return res.status(200).json(esercizio);
  } catch (err) {
    return res.status(500).json({ message: "Errore nel recupero dell'esercizio", error: err });
  }
};

// Funzione per aggiornare un esercizio
exports.updateEsercizio = async (req, res) => {
  const { id } = req.params;
  const { nome, descrizione, id_sport, id_parametri } = req.body;

  try {
      const esercizio = await Esercizio.findByIdAndUpdate(id, { nome, descrizione }, { new: true });

      if (!esercizio) {
          return res.status(404).json({ message: "Esercizio non trovato." });
      }

      // Aggiorna Sport
      await SportEsercizio.deleteMany({ id_esercizio: id });
      await SportEsercizio.insertMany(id_sport.map(sport_id => ({ id_esercizio: id, id_sport: sport_id })));

      // Aggiorna Parametri
      await ParametroEsercizio.deleteMany({ id_esercizio: id });
      await ParametroEsercizio.insertMany(id_parametri.map(parametro_id => ({ id_esercizio: id, id_parametro: parametro_id })));

      return res.status(200).json({ message: "Esercizio aggiornato con successo." });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Errore nell'aggiornamento dell'esercizio." });
  }
};

// Funzione per eliminare un esercizio
exports.deleteEsercizio = async (req, res) => {
  try {
    const esercizioEliminato = await Esercizio.findByIdAndDelete(req.params.id);
    if (!esercizioEliminato) {
      return res.status(404).json({ message: "Esercizio non trovato" });
    }
    return res.status(200).json({ message: "Esercizio eliminato con successo" });
  } catch (err) {
    return res.status(500).json({ message: "Errore nella cancellazione dell'esercizio", error: err });
  }
};