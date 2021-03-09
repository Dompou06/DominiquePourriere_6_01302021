// Schéma mongoose pour créer un compte ou ouvrir une session à un utilisateur
const mongoose = require('mongoose')
// On appelle le plugin qui vérifie si un champ à une donnée unique dans la BD (ici l'email)
const uniqueValidator = require('mongoose-unique-validator')

// Création d'un schéma via la fonction mongoose.Schema du package Mongoose
// Sous la forme d'un objet contenant les clés et leur objet contenant son type et la configuation
const userSchema = mongoose.Schema({
// Email de type string, obligatoire et unique
  email: { type: String, required: true, unique: true },
  // Email masqué pour pouvoir demandé si c'est bien lui, au cas où , un jour, nous décidions de communiquer avec lui
  emailMasked: { type: String, required: true },
  // Le mot de passe de type string et obligatoire
  password: { type: String, required: true }
})

userSchema.plugin(uniqueValidator)
// Exportation via le package Mongoose de ce modèle sous le nom userSchema
module.exports = mongoose.model('User', userSchema)
