// Intégration de dotenv pour la configuration des variables environnementales
require('dotenv').config()
// Appel de la librairie crypto intégrée à Node.js
const crypto = require('crypto')
const algorithm = 'aes-192-cbc'
// Clé de décryptage via la clé privée créée dans .env
const keyCrypt = process.env.CRYPT
// Le sel permet de ne pas générer toujours la même clé via le salage
const key = crypto.scryptSync(keyCrypt, 'salt', 24)
// objet tampon de la taille spécifiée 16, valeur pour remplir 8 pour agrantir un chiffrement différent
const iv = Buffer.alloc(16, 8)
// On crée un chiffrage via l'algorithm ,la clé et le iv
exports.encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return encrypted
}
// On fait un déchiffrage via la clé
// Non utilisé ici mais serait utile si besoin d'envoter un mail à l'utilisateur
exports.decrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv)
  let decrypted = cipher.update(text, 'utf8', 'hex')
  decrypted += cipher.final('hex')
  return decrypted
}
