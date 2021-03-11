const express = require('express')
// On appelle la méthode Router d'Express
const router = express.Router()
const sauceCtrl = require('../controllers/sauce')
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')
// On protège les routes via le jeton d'authentification, en ajoutant le middleware auth
// On vérifie que le fichier .env valide l'authenfication
if (process.env.AUTH) {
  // On passe les chemins caractéristiques aux actions, l'authentification du jeton, les traitements de fichiers si besoin et l'action spécifique sur la ou les sauces
  router.post('/', auth, multer, sauceCtrl.createSauce)
  router.get('/:id', auth, sauceCtrl.getOneSauce)
  router.put('/:id', auth, multer, sauceCtrl.modifySauce)
  router.delete('/:id', auth, sauceCtrl.deleteSauce)
  router.get('/', auth, sauceCtrl.getAllSauce)
  router.post('/:id/like', auth, sauceCtrl.likeSauce)
} else {
  // Pour Postman
  router.post('/', multer, sauceCtrl.createSauce)
  router.get('/:id', sauceCtrl.getOneSauce)
  router.put('/:id', multer, sauceCtrl.modifySauce)
  router.delete('/:id', sauceCtrl.deleteSauce)
  router.get('/', sauceCtrl.getAllSauce)
  router.post('/:id/like', sauceCtrl.likeSauce)
}
// eslint-disable-next-line eol-last
module.exports = router