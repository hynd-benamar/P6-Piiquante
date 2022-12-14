//on importe express pour créer un router
const express = require('express');
//on créer un router grace à la methode router() d'express
const router = express.Router();
//on importe le middleware/fonction de l'authentification
const auth = require('../middleware/auth');
//On importe le controller sauces qui gére le metier des router ci-dessous ds lesquels il faut aussi importer cette const
const saucesCtrl = require('../controllers/sauces');
//on importe notre fonction multer pour l'integrer à notre router post pour qu'il puisse gérer les fichiers
const multer = require('../middleware/multer-config');

//midleware = fonction qui reçoit une req et qui applique la fonction de la logique metier créer dans controllers/sauces

router.post('/', auth, multer, saucesCtrl.createSauce);

router.post('/:id/like', saucesCtrl.likeSauce);//url est dans le fichier pdf requirements_DW_P6
router.put('/:id', auth, multer, saucesCtrl.modifySauce);

//Renvoie un tableau de toutes les sauces de la base de données
router.get('/', auth, saucesCtrl.getAllSauce);

//Renvoie un tableau de la sauce avec l’_id fourni dans la requete
router.get('/:id', auth, saucesCtrl.getOneSauce);


router.delete('/:id', auth, saucesCtrl.deleteSauce);

module.exports = router;