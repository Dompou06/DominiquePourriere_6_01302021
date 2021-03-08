// On appelle le schéma des sauces
const Sauce = require('../models/sauce')
const httpStatus = require('http-status')
// On appelle le module pour les fichiers a supprimé (image ici) inclus dans images du backend
const fs = require('fs')
// L'utilisateur crée une sauce
exports.createSauce = (req, res, next) => {
  // On récupère l'objet crée dans le front-end
  const sauceObject = JSON.parse(req.body.sauce)
  // On lui applique le schéma du modèle
  const sauce = new Sauce({
    // On utilise l'opérateur spread (...) qui récupère tous les values des champs du front-end
    ...sauceObject,
    // Et l'image créée via multer et indiquée au préalable dans la route
    // req.protocol = http ou https
    // req.get('host') = nom du domaine (racine du serveur en production) ou ici localhost:3000
    // req.file.filename = fichier créé via multer dans le dossier images
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  })
  // On enregistre la sauce dans la BD
  sauce.save()
    .then(() => {
      res.status(httpStatus.OK).json({ message: 'Sauce enregistrée' })
    })
    .catch(error => res.status(httpStatus.BAD_REQUEST).json({ error }))
}
// On sélectionne la sauce appelée par l'utilisateur
exports.getOneSauce = (req, res, next) => {
  // On utilise la méthode mongoose pour sélectionner dans la BD l'élément ayant le _id correspondant au id dans les paramètres envoyées dans la route
  Sauce.findOne({ _id: req.params.id })
    .then(
    // Le id correspond à un _id de la BD
      (sauce) => {
        res.status(httpStatus.OK).json(sauce)
      })
    .catch(

      (error) => {
      // Le id ne correspond pas à un _id de la BD
        res.status(httpStatus.NOT_FOUND).json({
          error: error
        })
      }
    )
}
// On modifie la sauce suivant les indication de l'utilisateur
exports.modifySauce = (req, res, next) => {
  // On regarde s'il y a un fichier (image) dans la requête
  const sauceObject = req.file
  // Si true
    ? {
        // On récupère via le spread l'ensemble des données du body
        ...JSON.parse(req.body.sauce),
        // Et le chemin de l'image crée via le middleware avec multer
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      }
  // Sinon, on ne récupère que les données du body
    : req.body
  // On met à jour l'élément ayant un id correspondant au _id de la BD
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(
      () => {
        res.status(httpStatus.CREATED).json({ message: 'Sauce mise à jour' })
      }
    ).catch(
      (error) => {
        res.status(httpStatus.BAD_REQUEST).json({ error: error })
      }
    )
}
// On supprime la sauce sélectionnée par l'utilisateur
exports.deleteSauce = (req, res, next) => {
  // On cherche la sauce ayant le id correspondant à un _id dans la BD
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      // S'il existe
      // On récupère le nom du ficier image dans la BD
      // et avec la méthode split() on le divise en deux jusqu'à images/ et on ne garde que ce qui suit
      // c'est-à-dire le nom du fichier qui se trouve dans dossier images
      const filename = sauce.imageUrl.split('images/')[1]
      // On utilise la méthode native de gestion de fichier de Node.js (fs)
      // On supprime le fichier image du répertoire grâce à fonction .unlink() de fs
      fs.unlink(`images/${filename}`, () => {
        // On supprime l'élément de BD ayant le id correspondant au _id
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => {
            res.status(httpStatus.ACCEPTED).json({
              message: 'Sauce supprimée'
            })
          })
          .catch(
            (error) => {
              res.status(httpStatus.BAD_REQUEST).json({
                error: error
              })
            }
          )
      })
    })
    .catch(
      // Si le id ne correspond à aucun _id, le problème vient du serveur car la sauce est sensée existée
      (error) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          error: error
        })
      })
}
// On affiche toutes les sauces
exports.getAllSauce = (req, res, next) => {
  // On cherce les sauces
  Sauce.find()
    .then(sauces => res.status(httpStatus.OK).json(sauces))
    .catch(error => res.status(httpStatus.NOT_FOUND).json({ error }))
}
// On gère les likes et dislikes
exports.likeSauce = async (req, res, next) => {
  // On essaie de récupérer la sauce dans la BD en comparant de le id avec le _id
  try {
    const sauce = await Sauce.findOne({ _id: req.params.id })
    // On récupère le nombre de likes et dislikes
    const acountLikes = sauce.likes
    const acountDislikes = sauce.dislikes
    // On récupère les tableaux des utilisateurs ayant likés et dislikés
    const usersLiked = sauce.usersLiked
    const usersDisliked = sauce.usersDisliked
    // On recherche si l'utilisateur (via son userId) est déjà dans les tableaux précédents
    const includeLikes = usersLiked.includes(req.body.userId)
    const includeDislikes = usersDisliked.includes(req.body.userId)
    // On prépare une constante avec userId de l'utilisateur qui a liké ou disliké la sauce
    const newUser = req.body.userId
    // console.log(newUsersDisliked)
    if (req.body.like === 1) {
      // Si l'utilisateur click sur Like
      // On vérifie qu'il n'a pas disliké la sauce auparavant et n'est donc pas dans le tableau dislikes
      const newUsersDisliked = usersDisliked.filter(arrayDisliked => arrayDisliked !== newUser)
      // On l'ajoute alors à la fin du tableau des likes
      usersLiked.push(newUser)
      if (includeDislikes !== true) {
        // L'utlisateur n'a pas disliké cette sauce
        // On met à jour la sauce dans la BD
        Sauce.updateOne(
          { _id: req.params.id },
          {
            // J'aurais pu incrémenter le acountLikes via
            // $inc: {likes: acountLikes},
            // $set: { likes: acountLikes + 1 },
            // J'ai choisi d'ajouter 1 au nombre de likes
            likes: Number(acountLikes) + 1,
            // J'aurais pu l'insérer dans le tableau $push: { usersLiked: req.body.userId }
            // ou l'insérer dans le tableau sans doublon
            // $addToSet: { usersLiked: req.body.userId }
            // J'ai choisi de l'ajouter à la fin du tableau précédement
            usersLiked: usersLiked
          }
        )
          .then(() =>
            res.status(201).json({ message: 'Like ajouté' })
          )
          .catch((error) => res.status(httpStatus.BAD_REQUEST).json({ error }))
      } else {
        // S'il avait disliké la sauce auparavant
        // On filtre les usersDisliked pour ne plus y avoir le userId et on l'ajoute dans les likes
        Sauce.updateOne(
          { _id: req.params.id },
          {
            likes: Number(acountLikes) + 1,
            dislikes: Number(acountDislikes) - 1,
            usersLiked: usersLiked,
            usersDisliked: newUsersDisliked
          }
        )
          .then(() =>
            res.status(httpStatus.ACCEPTED).json({ message: 'Like ajouté et dislike supprimé' })
          )
          .catch((error) => res.status(httpStatus.NOT_FOUND).json({ error }))
      }
    } else if (req.body.like === -1) {
      // Si l'utilisateur click sur Dislike
      const newUsersLiked = usersLiked.filter(arrayLiked => arrayLiked !== newUser)
      usersDisliked.push(newUser)
      if (includeLikes !== true) {
        // S'il n'avait pas liké précédemment la sauce
        Sauce.updateOne(
          { _id: req.params.id },
          {
            dislikes: Number(acountDislikes) + 1,
            usersDisliked: usersDisliked
          }
        )
          .then(() =>
            res.status(201).json({ message: 'Dislike ajouté' })
          )
          .catch((error) => res.status(400).json({ error }))
      } else {
        // S'il avait liké précédemment la sauce
        Sauce.updateOne(
          { _id: req.params.id },
          {
            likes: Number(acountLikes) - 1,
            dislikes: Number(acountDislikes) + 1,
            usersLiked: newUsersLiked,
            usersDisliked: usersDisliked
          }
        )
          .then(() =>
            res.status(201).json({ message: 'Dislike ajouté et like supprimé' })
          )
          .catch((error) => res.status(400).json({ error }))
      }
    } else {
      // L'utilisateur a liké ou disliké deux fois, on annule son choix
      const newUsersDisliked = usersDisliked.filter(arrayDisliked => arrayDisliked !== newUser)
      switch (includeLikes) {
        // S'il est dans les tableau des likes
        case true :
          Sauce.updateOne(
            { _id: req.params.id },
            {
              likes: Number(acountLikes) - 1,
              usersLiked: usersLiked
            }
          )
            .then(() =>
              res.status(httpStatus.CREATED).json({ message: 'Like retiré' })
            )
            .catch((error) => res.status(httpStatus.BAD_REQUEST).json({ error }))
          break
          // S'il n'y est pas et est donc dans le tabeau des Dislikes
        case false :
          Sauce.updateOne(
            { _id: req.params.id },
            {
              dislikes: Number(acountDislikes) - 1,
              usersDisliked: newUsersDisliked
            }
          )
            .then(() =>
              res.status(httpStatus.ACCEPTED).json({ message: 'Like retiré' })
            )
            .catch((error) => res.status(httpStatus.BAD_REQUEST).json({ error }))
          break
        default:
          return res.status(httpStatus.BAD_REQUEST).json({ error: 'Votre choix n\'est pas défini' })
      }
    }
  } catch (error) {
    // Si on est parvenu à récupérer la sauce
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: error
    })
  }
}
