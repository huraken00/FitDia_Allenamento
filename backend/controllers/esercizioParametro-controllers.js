const express = require("express");
const EsercizioParametro = require("../models/parametro_esercizio");
const Parametro = require("../models/parametro");
const SportEsercizio = require("../models/sport_esercizio");
const Sport = require("../models/sport");
const Esercizio = require("../models/esercizio");

exports.getParametriEsercizi = async (req, res) => {
  try {
    const parametri = await EsercizioParametro.find({ id_esercizio: req.params.id_esercizio })
      .populate("id_parametro", "nome");

    const sportEsercizio = await SportEsercizio.find({ id_esercizio: req.params.id_esercizio })
      .populate("id_sport", "nome");

    const esercizio = await Esercizio.findById(req.params.id_esercizio).select("nome");

    console.log("Parametri:", parametri);
    console.log("Sport:", sportEsercizio);
    console.log("Esercizio:", esercizio);

    // Se ci sono più sport associati, crea un array con i nomi degli sport
    const sportNames = sportEsercizio.map(se => se.id_sport.nome);

    res.json({
      nomeEsercizio: esercizio ? esercizio.nome : "Sconosciuto",
      sport: sportNames.length > 0 ? sportNames : ["Sconosciuto"], // Restituisci un array di sport
      parametri: parametri.map(p => p.id_parametro)
    });

  } catch (err) {
    res.status(500).json({ error: "Errore nel recupero dei parametri e dello sport" });
  }
};
