const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces');
const path = require('path');
const helmet = require('helmet');
const app = express();
require('dotenv').config();
//Avec ceci, Express prend toutes les requêtes qui ont comme Content-Type application/json et met à disposition 
//leur body directement sur l'objet req, ce qui nous permet d'écrire le middleware POST
app.use(express.json());

//connexion à Mongodb 
mongoose.connect(
    process.env.SECRET_BDD,
    { useNewUrlParser: true, useUnifiedTopology: true }
)
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));

//Ces headers permettent : d'accéder à notre API depuis n'importe quelle origine ( '*' ) ;
//d'ajouter les headers mentionnés aux requêtes envoyées vers notre API (Origin , X-Requested-With , etc.) ;
//d'envoyer des requêtes avec les méthodes mentionnées ( GET ,POST , etc.).
app.use((req, res, next) => {
    //Toutes les origines peuvent accéder à l'API
    res.setHeader('Access-Control-Allow-Origin', '*');
    //Ajoute les headers nécessaires aux requêtes envoyées à l'API
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    //Permet d'envoyer les différentes requêtes
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(helmet.xssFilter());
//Gère la ressource "images" de manière statique à chaque fois qu'elle reçoit une requête vers la route "/images"
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', saucesRoutes);//route sauce
app.use('/api/auth', userRoutes);//route authentification
module.exports = app;

