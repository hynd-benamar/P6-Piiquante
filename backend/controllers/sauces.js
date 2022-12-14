const theModelsSauce = require('../models/modelsSauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    //sauceObject = model sauce qui est ds le corps de la requete parsé
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;//ce sauce object on lui supprime l'id et le userId
    delete sauceObject._userId;
    const sauce = new theModelsSauce({
        //l'operateur spread ... sert à recup tout les données appartenant à sauceObject
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => { res.status(201).json({ message: 'une nouvelle sauce a été posté !' }) })
        .catch(error => { res.status(400).json({ error }) })
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    delete sauceObject._userId;
    theModelsSauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non authorizé' });
            } else {
                //on utilise la méthode updateOne() ds theModelsSauce pr maj
                //l'objet({ dont l'_id est égal à l'id envoyé dans les parametre de la requete})
                //le 2eme argument = la nouvelle version de l'objet {...} sert à recup l'objet sauce 
                //qui est dans le corps de la requete
                theModelsSauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'La sauce a été modifiée !' }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.deleteSauce = (req, res, next) => {
    theModelsSauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non-authorisé' });
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    theModelsSauce.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Sauce supprimée !' }) })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

//ce middleware/route utilise la méthode get() pour répondre uniquement aux demandes GET
exports.getOneSauce = (req, res, next) => {
    //on utilise la méthode findOne() ds theModelsSauce pour trouver 
    //l'objet ({ dont l'_id est égal à l'id envoyé dans les parametre de la requete})
    theModelsSauce.findOne({ _id: req.params.id })
        //dans le then on va récupérer le tableau de tous les things retourné par la base 
        //et on les renvoie en réponse avec un code(200) et le tableau        
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

//cet route utilise la méthode get() pour répondre à toutes les demandes GET à cet endpoint
exports.getAllSauce = (req, res, next) => {
    //on utilise la méthode find() de notre modèle Mongoose pour renvoyer un tableau 
    // qui contient toutes les sauces dans la base de données
    theModelsSauce.find()
        //dans le then on va récupérer le tableau de tous les things retourné par la base 
        //et on les renvoie en réponse avec un code(200) et le tableau
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

//le user like une sauce qu'il n'avait jamais ni liker ni disliké auparavent
exports.likeSauce = (req, res, next) => {
    //si dans le corps de la requete l'objet like est présent donc == à 1
    if (req.body.like == 1) {
        //on utilise la methode updateOne sur l'objet theModelsSauce 
        theModelsSauce.updateOne(
            //dont l'id correspond à l'id des parametres de la requete
            { _id: req.params.id },
            {
                $push: { usersLiked: req.body.userId },
                $inc: { likes: +1 }
            }
        )
            .then(() => res.status(200).json({ message: 'Sauce liké !' }))
            .catch(error => res.status(400).json({ error }));
    }
    //le user veut modifier son like en dislike sur une sauce
    //si dans le corps de la requete l'objet like est égal à 0
    if (req.body.like == 0) {
        //il faut retrouver l id de la sauce qu'il avait liké avec la methode findOne
        theModelsSauce.findOne({ _id: req.params.id })
            .then((sauce) => {
                //si un like de cette sauce par cet user existe est 
                if (sauce.usersLiked.includes(req.body.userId)) {
                    //et la modifier avec la methode updateOne
                    theModelsSauce.updateOne(
                        { _id: req.params.id },
                        {
                            $pull: { usersLiked: req.body.userId },
                            $inc: { likes: -1 }
                        }
                    )
                        .then(() => res.status(200).json({ message: "Vous n'aimez plus cette sauce" }))
                        .catch(error => res.status(400).json({ error }));
                }
                if (sauce.usersDisliked.includes(req.body.userId)) {
                    theModelsSauce.updateOne(
                        { _id: req.params.id },
                        {
                            $pull: { usersDisliked: req.body.userId },
                            $inc: { dislikes: -1 }
                        }
                    )
                        .then(() => res.status(200).json({ message: "Vous n'aimez plus cette sauce" }))
                        .catch(error => res.status(400).json({ error }));
                }
            })
            .catch(error => res.status(400).json({ error }));
    }
    //le user veut disliker la sauce et qu'il n'avait pas liker ni disliké auparavent cette sauce
    //si dans le corps de la requete l'objet like est égal à -1
    if (req.body.like == -1) {
        //on utilise la methode updateOne sur l'objet theModelsSauce 
        theModelsSauce.updateOne(
            //dont l'id correspond à l'id des parametre de la requete
            { _id: req.params.id },
            {
                $push: { usersDisliked: req.body.userId },
                $inc: { dislikes: +1 }
            }
        )
            .then(() => res.status(200).json({ message: 'Sauce disliké !' }))
            .catch(error => res.status(400).json({ error }));
    }
};
