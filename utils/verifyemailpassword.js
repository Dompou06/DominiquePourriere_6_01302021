// Librairie de validation de données JS
const Joi = require('joi')
const httpStatus = require('http-status')

// Middleware qui analyse l'email et le password.
module.exports = (req, res, next) => {
  const error = checkSignUp(req.body.email, req.body.password)
  if (error) {
    // Renvoie un statut NOT FOUND et me message d'erreur si au moins un n'est pas valide
    return res.status(httpStatus.NOT_FOUND).json({ message: error.details[0].message })
  } else {
    // Si valides, on continue
    next()
  }
}
/**
 * Check email & password
 * Définition du type, nom et description des paramètres utilisées dans la fonction checkSignUp
 * @param {string} email  email
 * @param {string} password  password
 * @returns {}
 */
// Fonction testant la validité de l'email et du password fournit par l'utilisateur lors de son inscription
function checkSignUp (email, password) {
  // On indique les éléments que doivent être présents dans le password
  const pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%_])([-+!*$@%_\w]{8,15})$/
  // On crée un objet sous forme de schéma (.objet()) où la valeur des clés (.keys()) est scrutée l'une après l'autre
  const schema = Joi.object().keys(
    {
      // L'email ne doit pas être vide, doit être une chaîne et correspondre à une adresse email
      email: Joi.string().email(),
      // Le password ne doit pas être vide, doit être une chaîne sous forme d'expression régulière contenant le pattern indiqué
      password: Joi.string().regex(RegExp(pattern))
      // required inutile puisque ne pas être vide à cause de string()
      // password: Joi.string().regex(RegExp(pattern)).required()
    }
  )
  // Retourne l'objet validé par Joi avec en valeurs un objet contenant les propriétés du schéma
  return schema.validate({ email, password })
}
