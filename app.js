// On appelle le framework Express
const express = require('express')
// On installe la collection de middlewares d'Express Helmet, qui définit les en-têtes HTTP liés à la sécurité
// On crée une constante pour l'application Express
const app = express()
// On importe body-parser (analyse l'objet req.body, ses propriétés et contenu valides)
const bodyParser = require('body-parser')
// Appel du module Helmet pour la création et la sécurisation des entêtes HTTP
const helmet = require('helmet')
// Appel du package Mongoose
const mongoose = require('mongoose')
// Intégration de dotenv pour la configuration des variables environnementales
require('dotenv').config()

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
const sauceRoutes = require('./routes/sauce')
const userRoutes = require('./routes/user')
// Implémentation des configurations helmet dans les en-têtes HTTP (Cross Origin Resource Sharing (CORS))
app.use(helmet())
// On transforme le corps de la requête en objet JS
app.use(bodyParser.json())
// On exporte l'application pour que l'on puisse la récupérer dans le serveur Node.js
// On utilise la méthode use()
app.use((req, res) =>{

})
module.exports = app
