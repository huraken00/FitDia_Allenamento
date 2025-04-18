const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema per Allenamento
const allenamentoSchema = new Schema(
  {
    id_utente: { 
      type: String, 
      required: true // ID dell'utente che ha creato l'allenamento
    },
    nome: { 
      type: String, 
      required: true // Nome dell'allenamento
     
    },
    dataCreazione: { 
      type: Date, 
       // Data di creazione dell'allenamento
    },
    appuntiAllenamento: { 
      type: String, 
      required: false // Appunti relativi all'allenamento (opzionali)
    }
  },
  { timestamps: true } // Aggiunge createdAt e updatedAt
);

module.exports = mongoose.model("Allenamento", allenamentoSchema, "Allenamento");
