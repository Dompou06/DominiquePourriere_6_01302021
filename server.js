/* eslint-disable no-unreachable */
// Importation du package Node.js pour la création du serveur qui traitera les requêtes et réponses HTTP
const http = require('http')
// Intégration de dotenv pour la configuration des variables environnementales
require('dotenv').config()
// On importe l'application Express créée dans app.js
const app = require('./app')
// Fonction qui renvoie le port (numéro ou string)
const normalizePort = val => {
// Via parseInt(), on vérifie que val peut être converti en nombre, 10 renvoie la décimale de départ de la chaîne
  const port = parseInt(val, 10)
  // Si ce n'est pas un nombre, on retourne val
  if (isNaN(port)) {
    return val
  }
  if (port >= 0) {
    // Si c'est un nombre positif, on retourne le port (soit une décimale)
    return port
  }
  // Sinon, on retourne faux
  return false
}
// On crée une constante du port du serveur écoutant, celui dans .env ou par défault '3000' (généralement utilisé pour le développement)
const port = normalizePort(process.env.PORT || '3000')
// On indique au framework Express sur quel port, il doit fonctionner
app.set('port', port)
// On crée une conqtante pour les erreurs
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error
  }
  const address = server.address()
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.')
      process.exit(1)
      break
    default:
      throw error
  }
}
// On crée un serveur qui prendra en argument la fonction du framework Express, qui recevra la requête et la réponse, appelée pour chaque requête front-end
const server = http.createServer(app)
// Si erreur, on la renvoie
server.on('error', errorHandler)
// Sinon
server.on('listening', () => {
  const address = server.address()
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port
  console.log('Listening on ' + bind)
})
// Le serveur écoute le port
server.listen(port)
