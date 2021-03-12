// On appelle le middleware Node.js multer pour télécharger des fichiers (ici les images)
// Il nécessite que la requête contient un fichier, soit en plusieurs parties (multipart/form-data)
const multer = require('multer')
// On crée une bibliothèque de mime_types possibles de l'image

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
}

// objet de configuration d'enregistrement du fichier sur le disque dans le dossier images, via la fonction de multer
const storage = multer.diskStorage({
  // Indication de la destination d'enregistrement du fichier
  destination: (req, file, callback) => {
    // null pour pas d'erreur et nom du dossier
    callback(null, 'images')
  },
  /**
   * On donne un nouveau nom pour éviter les duppli de nom de fichier
   * @param {*} req  -
   * @param {{fieldname?: string}} file  -
   * @param {*} callback  -
   */
  filename: (req, file, callback) => {
    // Le nom original avec espaces remplacés par _
    let name = file.originalname.split(' ').join('_')
    // On récupère le mime_type du fichier modifié en jpg ou png
    const extension = MIME_TYPES[file.mimetype]
    /* let image
    if (extension !== undefined) {
      name = name.replace('.' + extension, '_')
      // nom modifié avec le nombre de millisecondes écoulées depuis le 1er janvier 1970, un . et l'extension
      image = name + Date.now() + '.' + extension
    } else {
      image = 'no_image.jpg'
    } */

    name = name.replace('.' + extension, '_')
    // nom modifié avec le nombre de millisecondes écoulées depuis le 1er janvier 1970, un . et l'extension
    const image = name + Date.now() + '.' + extension
    // On passe en argument le nom de l'image
    callback(null, image)
  }
})

// On exporte l'action d'enregistrement du fichier en indiquant que c'est une image
module.exports = multer({ storage }).single('image')
