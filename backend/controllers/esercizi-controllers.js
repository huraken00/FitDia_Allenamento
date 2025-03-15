const Esercizio = require("../models/esercizio");
const Sport = require("../models/sport");
const Parametro = require("../models/parametro");
const SportEsercizio = require("../models/sport_esercizio");
const ParametroEsercizio = require("../models/parametro_esercizio");

// Funzione per ottenere tutti gli esercizi con i dettagli di sport e parametri
exports.getAllEsercizi = async (req, res) => {
  try {
    // Recupera tutti gli esercizi e popola i riferimenti a sport e parametri
    const esercizi = await Esercizio.find()
      .populate("id_esperto", "username")
      .populate({
        path: "sport",
        model: "Sport", // Popola il campo 'sport' con i dati relativi al modello 'Sport'
        select: "nome", // Seleziona solo il campo 'nome' dello sport
      })
      .populate({
        path: "parametri",
        model: "Parametro", // Popola il campo 'parametri' con i dati relativi al modello 'Parametro'
        select: "tipo", // Seleziona solo il campo 'tipo' del parametro
      });

    // Se non vengono trovati esercizi
    if (!esercizi || esercizi.length === 0) {
      return res.status(404).json({ message: "Nessun esercizio trovato." });
    }

    return res.json(esercizi); // Risponde con tutti gli esercizi, inclusi sport e parametri
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Errore nel recupero degli esercizi." });
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

