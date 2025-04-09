const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Variante=require("../models/variante-esercizio");


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.inserisciVariante = async (req, res) => {
  const { nome, sport, luogo, livello, userId } = req.body; // userId passato nel body

  const prompt = `Come un esperto di sport, genera una descrizione semplice (massimo 100 parole) di una variante per l'esercizio "${nome}" adattata a chi pratica ${sport}, si allena in ${luogo} ed è di livello ${livello}.`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const descrizione = response.text(); // Potresti voler fare un controllo su response.text()

    // Crea la variante associata all'utente
    const nuovaVariante = new Variante({
      nome,
      descrizione,
      utente: userId, // Associa l'ID dell'utente
    });

    await nuovaVariante.save();

    res.json({ variante: nuovaVariante });
  } catch (error) {
    console.error("Errore generazione variante:", error);
    res.status(500).json({ error: "Errore nella generazione della variante" });
  }
};
exports.getVariantiByUtente = async (req, res) => {
    const userId = req.params.userId; // Assumiamo che l'ID utente venga passato come parametro
    try {
      const varianti = await Variante.find({ utente: userId }).sort({ _id: -1 });
      res.json(varianti);
    } catch (err) {
      res.status(500).json({ error: "Errore nel recupero delle varianti" });
    }
  };
  exports.getAllVarianti = async (req, res) => {
    try {
      const varianti = await Variante.find();
      res.status(200).json(varianti);
    } catch (err) {
      res.status(500).json({ message: "Errore nel recupero delle varianti" });
    }
  };
  
  exports.validaVariante = async (req, res) => {
    const { id } = req.params;
    const { stato, messaggio } = req.body;
  
    if (!["approvata", "scartata"].includes(stato)) {
      return res.status(400).json({ message: "Stato non valido" });
    }
  
    try {
      const variante = await Variante.findByIdAndUpdate(
        id,
        { validazione: { stato, messaggio } },
        { new: true }
      );
      res.status(200).json(variante);
    } catch (err) {
      res.status(500).json({ message: "Errore nella validazione" });
    }
  };
  
  
