const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema per Allenamento
const allenamentoSchema = new Schema(
  {
    nome: {
      type: String,
      required: true,
    },
    dataCreazione: {
      type: Date,
      default: Date.now,
    },
    appuntiAllenamento: {
      type: String,
      required: false, // Questo campo è opzionale
    },
    // Riferimento all'utente che ha creato l'allenamento
    utente: {
      type: Schema.Types.ObjectId,
      ref: "Utente", // Riferimento al modello Utente
      required: true,
    },
    // Serie appartenenti a questo allenamento
    serie: [
      {
        type: Schema.Types.ObjectId,
        ref: "Serie", // Riferimento al modello Serie
      },
    ],
  },
  { timestamps: true } // Aggiunge createdAt e updatedAt
);

const Allenamento = mongoose.model("Allenamento", allenamentoSchema,"Allenamento");

module.exports = Allenamento;
