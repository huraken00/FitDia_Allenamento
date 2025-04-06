const Esercizio = require("../models/esercizio");
const Sport = require("../models/sport");
const Parametro = require("../models/parametro");
const SportEsercizio = require("../models/sport_esercizio");
const ParametroEsercizio = require("../models/parametro_esercizio");
const Serie = require("../models/serie");
const Allenamento = require("../models/allenamento");

// Funzione per ottenere tutti gli esercizi con i dettagli di sport e parametri
exports.getAllEsercizi = async (req, res) => {
  try {
    const esercizi = await Esercizio.aggregate([
      {
        $lookup: {
          from: "SportEsercizio",
          localField: "_id",
          foreignField: "id_esercizio",
          as: "sport_relazione"
        }
      },
      {
        $lookup: {
          from: "Sport",
          localField: "sport_relazione.id_sport",
          foreignField: "_id",
          as: "sport"
        }
      },
      {
        $lookup: {
          from: "EsercizioParametro",
          localField: "_id",
          foreignField: "id_esercizio",
          as: "parametri_relazione"
        }
      },
      {
        $lookup: {
          from: "Parametro",
          localField: "parametri_relazione.id_parametro",
          foreignField: "_id",
          as: "parametri"
        }
      },
      {
        $project: {
          nome: 1,
          descrizione: 1,
          sport: 1,
          parametri: 1
        }
      }
    ]);

    return res.status(200).json(esercizi);
    console.log(esercizi)
  } catch (err) {
    return res.status(500).json({ message: "Errore nel recupero degli esercizi", error: err });
  }
};

// Funzione per inserire un nuovo esercizio
exports.addEsercizio = async (req, res) => {
  const { nome, descrizione, id_esperto, id_sport, id_parametri } = req.body;

  try {
    const nuovoEsercizio = new Esercizio({ nome, descrizione, id_esperto });
    const esercizioSalvato = await nuovoEsercizio.save();

    if (id_sport && id_sport.length > 0) {
      await SportEsercizio.insertMany(id_sport.map(sport_id => ({
        id_esercizio: esercizioSalvato._id,
        id_sport: sport_id
      })));
    }

    if (id_parametri && id_parametri.length > 0) {
      await ParametroEsercizio.insertMany(id_parametri.map(parametro_id => ({
        id_esercizio: esercizioSalvato._id,
        id_parametro: parametro_id
      })));
    }

    return res.status(201).json({ message: "Esercizio inserito con successo", esercizio: esercizioSalvato });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Errore nell'inserimento dell'esercizio." });
  }
};

// Funzione per ottenere un esercizio con dettagli di sport e parametri
exports.getEsercizioById = async (req, res) => {
  try {
    const esercizio = await Esercizio.findById(req.params.id);
    if (!esercizio) {
      return res.status(404).json({ message: "Esercizio non trovato" });
    }

    const sport = await SportEsercizio.find({ id_esercizio: req.params.id }).populate("id_sport");
    const parametri = await ParametroEsercizio.find({ id_esercizio: req.params.id }).populate("id_parametro");
    return res.status(200).json({
      ...esercizio._doc,
      sport: sport.map(s => s.id_sport),
      parametri: parametri.map(p=>p.id_parametro)
    });
  } catch (err) {
    return res.status(500).json({ message: "Errore nel recupero dell'esercizio", error: err });
  }
};

// Funzione per aggiornare un esercizio
// Funzione per aggiornare un esercizio
exports.updateEsercizio = async (req, res) => {
  const { id } = req.params;
  const { nome, descrizione, id_sport, id_parametri, id_esperto } = req.body;

  try {
    const esercizio = await Esercizio.findByIdAndUpdate(
      id,
      { 
        nome, 
        descrizione, 
        id_esperto, // Aggiorna l'ID dell'esperto che sta modificando
        data_modifica: new Date() // Salva la data di modifica
      }, 
      { new: true }
    );

    if (!esercizio) {
      return res.status(404).json({ message: "Esercizio non trovato." });
    }

    if (id_sport) {
      await SportEsercizio.deleteMany({ id_esercizio: id });
      if (id_sport.length > 0) {
        await SportEsercizio.insertMany(id_sport.map(sport_id => ({
          id_esercizio: id,
          id_sport: sport_id
        })));
      }
    }

    if (id_parametri) {
      await ParametroEsercizio.deleteMany({ id_esercizio: id });
      if (id_parametri.length > 0) {
        await ParametroEsercizio.insertMany(id_parametri.map(parametro_id => ({
          id_esercizio: id,
          id_parametro: parametro_id
        })));
      }
    }
    
    return res.status(200).json({ message: "Esercizio aggiornato con successo." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Errore nell'aggiornamento dell'esercizio." });
  }
};





// Funzione per eliminare un esercizio e le sue relazioni
exports.deleteEsercizio = async (req, res) => {
  try {
    const esercizioEliminato = await Esercizio.findByIdAndDelete(req.params.id);
    if (!esercizioEliminato) {
      return res.status(404).json({ message: "Esercizio non trovato" });
    }

    await SportEsercizio.deleteMany({ id_esercizio: req.params.id });
    await ParametroEsercizio.deleteMany({ id_esercizio: req.params.id });

    return res.status(200).json({ message: "Esercizio eliminato con successo" });
  } catch (err) {
    return res.status(500).json({ message: "Errore nella cancellazione dell'esercizio", error: err });
  }
};
exports.getProgressiEsercizio = async (req, res) => {
  const { id } = req.params;

  try {
    const esercizio = await Esercizio.findById(id);
    if (!esercizio) return res.status(404).json({ message: "Esercizio non trovato" });

    // Trova tutte le serie di questo esercizio e popola la data dell'allenamento
    const serie = await Serie.find({ id_esercizio: id }).populate("id_allenamento");

    // Trasforma ogni serie in un oggetto { data, ...parametri }
    const progressi = serie
      .filter(s => s.id_allenamento && s.parametri)
      .map(s => {
        const dataAllenamento = s.id_allenamento.data;
        return {
          data: new Date(dataAllenamento).toISOString().split("T")[0], // yyyy-mm-dd
          ...s.parametri
        };
      })
      .sort((a, b) => new Date(a.data) - new Date(b.data)); // Ordina cronologicamente

    return res.status(200).json({
      nomeEsercizio: esercizio.nome,
      dati: progressi
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Errore nel recupero dei progressi", error: err });
  }
};