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
          from: "EsercizioParametro",  // Collezione da unire
          localField: "_id",           // Campo della collezione "Esercizio" per il join
          foreignField: "esercizio_id", // Campo della collezione "EsercizioParametro" per il join
          as: "relazioni"              // Alias per memorizzare i risultati del lookup
        }
      },
      {
        $lookup: {
          from: "Parametro",              // Collezione "Parametro"
          localField: "relazioni.parametri", // Array di ObjectId nella collezione "EsercizioParametro"
          foreignField: "_id",            // Campo corrispondente nella collezione "Parametro"
          as: "parametri"                 // Alias per i parametri trovati
        }
      },
      {
        $project: {                      // Rimuovere il campo 'relazioni' dal risultato finale
          nome: 1,
          descrizione: 1,
          parametri: 1
        }
      }
    ]);

    // Restituisci il risultato in formato JSON
    return res.status(200).json(esercizi);

  } catch (err) {
    return res.status(500).json({ message: "Errore nel recupero degli esercizi", error: err });
  }
};



// Funzione per inserire un nuovo esercizio
 exports.addEsercizio = async (req, res) => {
  const { nome, descrizione, id_esperto, id_sport, id_parametro } = req.body; // Ottieni i dati inviati nel corpo della richiesta

  try {
    // Crea un nuovo esercizio
    const nuovoEsercizio = new Esercizio({
      nome,
      descrizione,
      id_esperto,
    });

    // Salva l'esercizio nel database
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

