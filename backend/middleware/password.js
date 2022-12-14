const passwordValidator = require("password-validator");

// Create a schema
const passwordSchema = new passwordValidator();

// Schéma qui doit être respecter pour créer un mdp
passwordSchema
    //on crer un schema grace aux methodes suivantes:
    .is().min(6)                                    // La chaîne doit avoir une longueur minimale de 6 caractères
    .is().max(50)                                  // La chaîne doit avoir une longueur maximale de 30 caractères
    .has().uppercase(2)                              // La chaîne doit avoir au moins 1 lettre majuscule
    .has().lowercase()                              // La chaîne doit avoir au moins 1 lettre minuscule
    .has().digits(2)                                // La chaîne doit avoir un minimum de 1 chiffres
    .has().not().spaces()                           // La chaîne ne doit pas avoir d'espaces

//on verifie la qualité du mdp par rapport au schéma en utilisant une fonction de callback () => []: 
module.exports = (req, res, next) => {
    // Validation par rapport à une chaîne de mot de passe
    //si le mdp qui est dans le corps de la requete est validé par les règles strictes du shema alors execute la suite
    if (passwordSchema.validate(req.body.password)) {
        return next();
    } else {
        // Récupère une liste complète des règles qui ont échoué 
        return res
            .status(400)
            .json({ error: `Le mot de passe choisit n'est pas assez fort ${passwordSchema.validate(req.body.password, { list: true })}` })
    }

};