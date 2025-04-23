const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Variante=require("../models/variante-esercizio");


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.inserisciVariante = async (req, res) => {
  const { nome, sport, luogo, livello, userId } = req.body;

  const prompt = `Come un esperto di sport, crea una variante originale dell'esercizio "${nome}" adatta a chi pratica ${sport}, si allena in ${luogo} ed è di livello ${livello}.
Rispondi nel seguente formato:
Nome: <nome descrittivo della variante>
Descrizione: <una descrizione semplice (massimo 100 parole)>`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Regex robusto con tolleranza a spazi, trattini, ecc.
    const nomeMatch = text.match(/(?:Nome|Titolo)\s*[:\-–]\s*(.+)/i);
    const descrizioneMatch = text.match(/Descrizione\s*[:\-–]\s*([\s\S]+)/i);

    const nomeGenerato = nomeMatch?.[1]?.trim() || `${nome} Variante`;
    const descrizione = descrizioneMatch?.[1]?.trim() || "Descrizione non disponibile";

    // Salva nel DB
    const nuovaVariante = new Variante({
      nome: nomeGenerato,
      descrizione,
      utente: userId,
    });

    await nuovaVariante.save();

    res.json({ variante: nuovaVariante });
  } catch (error) {
    res.status(500).json({ message: "Errore nella generazione della variante" });
  }
};


exports.getVariantiByUtente = async (req, res) => {
    const userId = req.params.userId; // Assumiamo che l'ID utente venga passato come parametro
    try {
      const varianti = await Variante.find({ utente: userId }).sort({ _id: -1 });
      return  res.json(varianti);
    } catch (err) {
       return res.status(500).json({ message: "Errore nel recupero delle varianti" });
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
  
  
