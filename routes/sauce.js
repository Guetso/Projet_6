const express = require('express')
const router = express.Router()

const Sauce = require('../models/Sauce')

router.post('/', (req, res, next) => {
  delete req.body.userId
  const sauce = new Sauce({
    ...req.body,
  })
  sauce
    .save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
    .catch((error) => res.status(400).json({ error }))
})

router.put('/:id', (req, res, next) => {
  Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifié !' }))
    .catch((error) => res.status(400).json({ error }))
})

router.delete('/:id', (req, res, next) => {
  Sauce.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce supprimé !' }))
    .catch((error) => res.status(400).json({ error }))
})

router.get('/:id', (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((thing) => res.status(200).json(thing))
    .catch((error) => res.status(404).json({ error }))
})

router.get('/', (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }))
})

module.exports = router