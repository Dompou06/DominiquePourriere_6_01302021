require('dotenv').config()
const jwt = require('jsonwebtoken')
const httpStatus = require('http-status')
module.exports = (req, res, next) => {
  try {
    // On récupère le token de l'utilisateur créé dans le controllers user.js et contenu le header (HTTP) d'autorisation (après l'espace qui suit Bearer)
    const token = req.headers.authorization.split(' ')[1]
    // On décode le token obtenu avec la clé de token
    const decodedToken = jwt.verify(token, process.env.TOKEN)
    // On récupère l'userId du token décodé
    const userId = decodedToken.userId
    // Si la requête envoie un userId et que celui-ci est différent de l'userId du token décodé
    if (req.body.userId && req.body.userId !== userId) {
      // L'utilisateur n'est pas reconnu comme valide, on n'exucte pas la requête et on va au catch
      throw new Error('Utilisateur non autorisé')
    } else {
      // S'il est reconnu, on continue
      next()
    }
  } catch (error) {
    // Si pas de clé token dans l'en-tête d'autorisation, la requête est rejettée
    res.status(httpStatus.UNAUTHORIZED).json({ error: 'Requête non authentifiée' })
  }
}
