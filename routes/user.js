const express = require('express')
// On appalle le middleware de niveau routeur, qui crée un objet routeur pour gérer les requêtes
const router = express.Router()
// On charge le middleware de vérification de l'email et password pour le signup
const verifyEmailPassword = require('../utils/verifyemailpassword')
// On charge le controller pour le cryptage et le hashage
const userCtrl = require('../controllers/user')
// Appel de la librairie Express pour limiter les connexions avec login invalide pendant un temps
const rateLimit = require('express-rate-limit')
const limiter = rateLimit({
  // Temps de blocage après 5 essais
  windowMs: 60 * 1000, // 1 minute
  // Limite de requêtes pour un IP
  max: 5,
  message: ':)'
})
// indique au routeur le chemin et le type de requête, ici : la méthode post
// Si l'email et le password sont validés (verifyEmailPassword), on récupère l'objet exporté par userCtrl.signup
router.post('/signup', verifyEmailPassword, userCtrl.signup)
// Si la limite de tentatives n'est pas atteinte selon les conditions de limiter, on récupère l'objet exporté par userCtrl.login
router.post('/login', limiter, userCtrl.login)
// On encapsule et envoie l'objet router
module.exports = router
