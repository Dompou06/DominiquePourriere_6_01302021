// On récupère le schéma mongoose pour l'utilisateur
const User = require('../models/user')
// Intégration de la définition de l'état de la réponse
const httpStatus = require('http-status')
// Appel du cryptage de l'email
const emailCrypted = require('../utils/utils')
// On ajoute une librairie pour le hashage du password au signup et sa comparaison avec un autre hash au login
const bcrypt = require('bcrypt')
// Création d'un token
const jwt = require('jsonwebtoken')
// Intégration de dotenv pour la configuration des variables environnementales
require('dotenv').config()
// Librairie pour masquer de masquage de valeurs
const MaskData = require('maskdata')
// On paramètre le masquage de l'email
const emailMaskOptions = {
  maskWith: '*',
  unmaskedStartCharactersBeforeAt: 3,
  unmaskedEndCharactersAfterAt: 2,
  maskAtTheRate: false
}
exports.signup = (req, res) => {
  // On chiffre la requête email
  const userCrypt = emailCrypted.encrypt(req.body.email)
  // On hasche le mdp (fonction asyncr) avec un salt de 10 chaînes aléatoires
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        // email: req.body.email,
        email: userCrypt,
        // On masque l'email pour norme RGPD
        emailMasked: MaskData.maskEmail2(req.body.email, emailMaskOptions),
        // On récupère le hash
        password: hash
      })
      user.save()
        .then(() => res.status(httpStatus.CREATED).json({ message: 'Utilisateur enregistré' }))
        .catch(error => res.status(httpStatus.NOT_FOUND).json({ error }))
    })
    .catch(error => res.status(httpStatus.NOT_FOUND).json({ error }))
}
exports.login = (req, res) => {
  // On chiffre la requête email
  const userCrypt = emailCrypted.encrypt(req.body.email)
  // On cherche l'email tapé par l'utilisateur puis crypté dans ceux dans la bd
  User.findOne({ email: userCrypt })
    .then(user => {
      if (!user) {
        return res.status(httpStatus.UNAUTHORIZED).json({ error: 'Utilisateur inconnu' })
      }
      // On compare le hash du password du req.body avec celui de la base données correspondant à l'email
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          // Retour sous forme de boolean
          if (!valid) {
            return res.status(httpStatus.UNAUTHORIZED).json({ error: 'Mot de passe erronné' })
          }
          res.status(httpStatus.OK).json({
            userId: user._id,
            // On renvoie un token (jeton d’accès pour sécuriser l’échange entre l’utilisation de l'appli et le serveur) créé ou celui des requêtes précédentes de l'utilisateur pendant 24 h
            token: jwt.sign(
              // On s'assure que la requête s'adresse bien à l'utilisateur et on encode celui-ci pour empêcher qu'un autre utilisateur puisse modifier une de ses ssauces
              { userId: user._id },
              // On indique la clé secrète pour l'encodage, à complexifier pour la production
              process.env.TOKEN,
              // On indique le délai d'expiration 24 h pour le développement, plus court (1h) en production
              { expiresIn: '24h' }
            )
          })
        })
        .catch(error => res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error }))
    })
    .catch(error => res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error }))
}
