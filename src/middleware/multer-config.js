// On appelle le middleware Node.js multer pour télécharger des fichiers (ici les images)
// Il nécessite que la requête contient un fichier, soit en plusieurs parties (multipart/form-data)
const multer = require('multer')
// On crée une bibliothèque de mime_types possibles de l'image
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
}
// objet de configuration d'enregistrement du fichier dans le dossier images, via multer
const storage = multer.diskStorage({
  // Indication de la destination
  destination: (req, file, callback) => {
    // null pour pas d'erreur
    callback(null, 'images')
  },
  // On donne un nouveau nom pour éviter les duppli de nom de fichier
  filename: (req, file, callback) => {
    // L'objet multer comprend
    /* {
    fieldname: 'image',
    originalname: 'aoili.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    destination: 'images',
    filename: 'aoili_1612522709601.jpg',
    path: 'images\\aoili_1612522709601.jpg',
    size: 7097
    } */
    // Le nom original avec espaces remplacés par _
    let name = file.originalname.split(' ').join('_')
    // On récupère le mime_type du fichier modifié en jpg ou png
    const extension = MIME_TYPES[file.mimetype]
    // On replace l'extension actuelle par _
    name = name.replace('.' + extension, '_')
    // On passe en argument le nom modifié avec le nombre de millisecondes écoulées depuis le 1er Janvier 1970, un . et l'extension
    callback(null, name + Date.now() + '.' + extension)
  }
})
// On exporte l'action d'enregistrement du fichier en indiquant que c'est une image
module.exports = multer({ storage }).single('image')
