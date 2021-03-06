// Contient la logique métier concernant les sauces, à appliquer aux différentes routes CRUD

const Sauce = require('../models/Sauce') // On récupère le modèle' Sauce'
const fs = require('fs') // On récupère le module 'file system' de Node

exports.createSauce = (req, res, next) => {
  // Pour la route POST = Création d'une sauce
  const sauceObject = JSON.parse(req.body.sauce)
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
  })
  sauce
    .save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
    .catch((error) => res.status(400).json({ error }))
}

exports.modifySauce = (req, res, next) => {
  // Pour la route PUT = modification d'une sauce
  let sauceObject = 0

  if (req.file) {
    // Si la modification contient une image
    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
      // On supprime l'ancienne image du serveur
      const filename = sauce.imageUrl.split('/images/')[1]
      fs.unlinkSync(`images/${filename}`)
    })
    sauceObject = {
      // On ajoute la nouvelle image
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${
        req.file.filename
      }`,
    }
  } else {
    // Si la modification ne contient pas de nouvelle image
    sauceObject = { ...req.body }
  }

  Sauce.updateOne(
    // On applique les paramètre de sauceObject
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
    .catch((error) => res.status(400).json({ error }))
}

exports.deleteSauce = (req, res, next) => {
  // Pour la route DELETE = suppression d'une sauce
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1]
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
          .catch((error) => res.status(400).json({ error }))
      })
    })
    .catch((error) => res.status(500).json({ error }))
}

exports.getOneSauce = (req, res, next) => {
  // Pour la route READ = afficher une sauce en particulier
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }))
}

exports.getAllSauce = (req, res, next) => {
  // Pour la route READ = afficher toutes les sauces
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }))
}

exports.addLikeDislike = (req, res, next) => {
  // Pour la route POST = Ajout/suppression d'un like / dislike à une sauce
  const like = req.body.like
  const user = req.body.userId
  const sauceId = req.params.id
  if (like === 1) { // Si il s'agit d'un like
    Sauce.updateOne(
      { _id: sauceId },
      {
        $push: { usersLiked: user },
        $inc: { likes: like },
      }
    )
      .then(() => res.status(200).json({ message: 'Like ajouté !' }))
      .catch((error) => res.status(400).json({ error }))
  }
  if (like === -1) {
    Sauce.updateOne( // Si il s'agit d'un dislike
      { _id: sauceId },
      {
        $push: { usersDisliked: user },
        $inc: { dislikes: -like },
      }
    )
      .then(() => {
        res.status(200).json({ message: 'Dislike ajouté !' })
      })
      .catch((error) => res.status(400).json({ error }))
  }
  if (like === 0) { // Si il s'agit d'annuler un like ou un dislike
    Sauce.findOne({ _id: sauceId })
      .then((sauce) => {
        if (sauce.usersLiked.includes(user)) { // Si il s'agit d'annuler un like
          Sauce.updateOne(
            { _id: sauceId },
            {
              $pull: { usersLiked: user },
              $inc: { likes: -1 },
            }
          )
            .then(() => res.status(200).json({ message: 'Like retiré !' }))
            .catch((error) => res.status(400).json({ error }))
        }
        if (sauce.usersDisliked.includes(user)) { // Si il s'agit d'annuler un dislike
          Sauce.updateOne(
            { _id: sauceId },
            {
              $pull: { usersDisliked: user },
              $inc: { dislikes: -1 },
            }
          )
            .then(() => res.status(200).json({ message: 'Dislike retiré !' }))
            .catch((error) => res.status(400).json({ error }))
        }
      })
      .catch((error) => res.status(404).json({ error }))
  }
}
