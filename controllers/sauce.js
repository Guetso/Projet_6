// Contient la logique métier

const Sauce = require('../models/Sauce')

exports.createSauce = (req, res, next) => {
  const thingObject = JSON.parse(req.body.thing)
  delete thingObject.userId
  const sauce = new Sauce({
    ...thingObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  })
  sauce
    .save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
    .catch((error) => res.status(400).json({ error }))
}

exports.modifySauce = (req, res, next) => {
  Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifié !' }))
    .catch((error) => res.status(400).json({ error }))
}

exports.deleteSauce = (req, res, next) => {
  Sauce.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce supprimé !' }))
    .catch((error) => res.status(400).json({ error }))
}

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((thing) => res.status(200).json(thing))
    .catch((error) => res.status(404).json({ error }))
}

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }))
}
