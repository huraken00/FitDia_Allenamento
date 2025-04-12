const Esercizio = require("../models/esercizio");
const SportEsercizio = require("../models/sport_esercizio");
const ParametroEsercizio = require("../models/parametro_esercizio");
const Serie = require ("../models/serie");
const Allenamento = require('../models/allenamento'); // Modello per allenamento

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

// Funzione per ottenere i progressi di un esercizio per un determinato utente
exports.getProgressiEsercizio = async (req, res) => {
  const { id } = req.params; // ID dell'esercizio
  const userId = req.params.userId;  // ID dell'utente passato dalla URL

  // Prendi i parametri di data dalla query string
  const { from, to } = req.query;  // Date di inizio e fine per il filtraggio

  try {
    // Trova l'esercizio
    const esercizio = await Esercizio.findById(id);
    if (!esercizio) {
      return res.status(404).json({ message: "Esercizio non trovato" });
    }

    // Trova tutte le serie associate a questo esercizio e all'utente corrente
    const serie = await Serie.find({ id_esercizio: id })
      .populate({
        path: "id_allenamento",
        match: { id_utente: userId },  // Filtro per id_utente
      });

      

    // Filtro per le date se 'from' o 'to' sono presenti
    const progressi = serie
      .filter(s => s.id_allenamento) // Solo serie che hanno un allenamento associato
      .map(s => {
        const dataSerie = s.createdAt;

        // Normalizza le date, impostando l'orario a 00:00:00
const normalizeDate = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);  // Imposta l'orario a mezzanotte
  return d;
};

// Confronta la data di allenamento con le date selezionate
const isValidDate =
  (!from || normalizeDate(dataSerie) >= normalizeDate(from)) &&
  (!to || normalizeDate(dataSerie) <= normalizeDate(to));

if (!isValidDate) {
  return null;  // Se la data non rientra nell'intervallo, non includerla
}


        // Estrai i parametri misurabili
        const { Peso, Ripetizioni, Durata, Distanza } = s;

        return {
          data: new Date(dataSerie).toISOString().split("T")[0],  // Formatta la data in "yyyy-mm-dd"
          ...(Peso !== undefined && { Peso }),
          ...(Ripetizioni !== undefined && { Ripetizioni }),
          ...(Durata !== undefined && { Durata }),
          ...(Distanza !== undefined && { Distanza }),
        };
      })
      .filter(progress => progress !== null)  // Rimuovi gli progressi nulli
      .sort((a, b) => new Date(a.data) - new Date(b.data));  // Ordina i progressi per data

    return res.status(200).json({
      nomeEsercizio: esercizio.nome,
      dati: progressi,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Errore nel recupero dei progressi", error: err });
  }
};

// Funzione per ottenere nome e ID degli esercizi per un utente
exports.getEserciziUtente = async (req, res) => {
  const userId = req.params.userId;  // Otteniamo l'ID dell'utente dalla URL

  try {
    // Otteniamo gli allenamenti dell'utente
    const allenamenti = await Allenamento.find({ id_utente: userId });

    if (allenamenti.length === 0) {
      return res.status(404).json({ message: "Nessun allenamento trovato per questo utente." });
    }

    // Per ogni allenamento, otteniamo gli ID degli esercizi delle serie
    const eserciziUtente = await Promise.all(allenamenti.map(async (allenamento) => {
      // Otteniamo le serie per ogni allenamento
      const serie = await Serie.find({ id_allenamento: allenamento._id });

      // Estraiamo solo gli ID degli esercizi dalle serie (senza duplicati)
      const eserciziIds = serie.reduce((acc, s) => {
        if (!acc.includes(s.id_esercizio.toString())) {
          acc.push(s.id_esercizio.toString()); // Aggiungi solo se l'ID non è già presente
        }
        return acc;
      }, []);

      // Ottieni i dettagli degli esercizi utilizzando gli ID estratti
      const eserciziDetails = await Esercizio.find({
        '_id': { $in: eserciziIds }
      }).select('_id nome'); // Selezioniamo solo ID e nome dell'esercizio

      return eserciziDetails;
    }));

    /*
    Senza flat(), avremmo un array di array:
Se non usassimo flat(), eserciziUtente resterebbe un array di array, e quindi il nostro processo di riduzione dei duplicati 
(reduce()) sarebbe un po' più complicato, perché dovremmo iterare attraverso gli array annidati.
    */ 
    const allEsercizi = eserciziUtente.flat();
    
    // Rimuoviamo i duplicati per ID e nome
    const eserciziUnici = allEsercizi.reduce((acc, esercizio) => {
      // Aggiungi l'esercizio solo se non esiste già un esercizio con lo stesso ID o nome
      if (!acc.some(e => e._id.toString() === esercizio._id.toString() || e.nome === esercizio.nome)) {
        acc.push(esercizio);
      }
      return acc;
    }, []);

    // Rispondiamo con l'elenco di esercizi con nome e ID, senza duplicati per ID e nome
    return res.status(200).json(eserciziUnici);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Errore nel recupero degli allenamenti e degli esercizi." });
  }
};

// Funzione per ottenere un esercizio con dettagli di sport e parametri
exports.getParametriById = async (req, res) => {
  try {
    const esercizio = await Esercizio.findById(req.params.id);
    if (!esercizio) {
      return res.status(404).json({ message: "Esercizio non trovato" });
    }


    const parametri = await ParametroEsercizio.find({ id_esercizio: req.params.id }).populate("id_parametro");
    return res.status(200).json({
      parametri: parametri.map(p=>p.id_parametro)
    });
  } catch (err) {
    return res.status(500).json({ message: "Errore nel recupero dell'esercizio", error: err });
  }
};