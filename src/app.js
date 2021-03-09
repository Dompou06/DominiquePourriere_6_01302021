// On appelle le framework Express, qui simplifie la création d’une application Node.js
const express = require('express')
// On installe la collection de middlewares d'Express Helmet, qui définit les en-têtes HTTP liés à la sécurité
// On crée une constante pour l'application Express
const app = express()
// On protège l'accès à l'appli des appels XHR (XMLHttpRequest) depuis une origine différente
const cors = require('cors')
// On importe body-parser (analyse l'objet req.body, ses propriétés et contenu valides)
const bodyParser = require('body-parser')
// Appel du package Mongoose
const mongoose = require('mongoose')
// Appel du module Helmet pour la création et la sécurisation des entêtes HTTP
const helmet = require('helmet')
// Appel vers l'accès au chemin de fichiers (images)
const path = require('path')
// Intégration de dotenv pour la configuration des variables environnementales
require('dotenv').config()
// Intégration de la définition de l'état de la réponse ???
const httpStatus = require('http-status')

// Connection à la base Mongo Atlas pour la collection
mongoose.connect(process.env.MONGO,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))
// Appel des routes
const sauceRoutes = require('../routes/sauce')
const userRoutes = require('../routes/user')
// On utilise la méthode use() pour exécuter une fonction
// Implémentation de l'autorisation à notre seule appli à consulter les ressources
app.use(cors())
// Implémentation des configurations helmet dans les en-têtes HTTP (Cross Origin Resource Sharing (CORS))
app.use(helmet())
// On transforme le corps des requêtes en objet JS
app.use(bodyParser.json())
// VSCode déprécie body-parser, on peut remplacer par
// On reconnaît l'objet de requête entrant sous forme de chaînes ou de tableaux (false), true si n'imprte quel type
// app.use(express.urlencoded({ extended: false }))
// On analyse le json des requêtes (important pour POST et PUT)
// app.use(express.json())
// Pour les post des utilisateurs signup et login, en utilise la route indiqué dans routes/user.js
app.use('/api/auth', userRoutes)
// Indication du chemin vers le dossier images, en servant le dossier statique images
app.use('/images', express.static(path.join(__dirname, 'images')))
// On bloque touteq les routes qui n'ont pas été définies précédement
// Pour les get, post... des sauces, on utilise la route sauce.js
app.use('/api/sauces', sauceRoutes)
app.get('*', (req, res) => {
  return res.status((httpStatus.NOT_FOUND)).json({ error: 'Chemin invalide' })
})
// On exporte l'application pour que l'on puisse la récupérer dans le serveur Node.js
module.exports = app
