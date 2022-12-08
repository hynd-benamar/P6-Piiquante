//constante qui va importer le package http de node. la commande require sert à importer le package
const http = require("http");

//constante qui va importer notre application
const app = require("./app");

//la fonction normalizePort renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
const normalizePort = val => {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

const port = normalizePort(process.env.PORT || '3000');

//on doit dire à l'application express sur quel port elle va tourner grace à la méthode set
app.set('port', port);

//la fonction errorHandler  recherche les différentes erreurs et les gère de manière appropriée. 
//Elle est ensuite enregistrée dans le serveur
const errorHandler = error => {

    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};


//grâce à l'objet http on peut créer une constante qui va créer un serveur avec la méthode createServer du package http
//au serveur on va passer cette application qui est aussi une fonction qui va recevoir la requete et la reponse pour les modifier
const server = http.createServer(app);


server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

//pour que le serveur renvoie une res(réponse) il faut qu'il écoute les req(requetes) envoyé
//si l'environnement sur lequel tourne le serveur envoie un port à utiliser on utilisera celui là sinon on utlisera le port 3000
server.listen(port);
