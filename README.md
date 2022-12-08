# P6-Piiquante

Contexte du projet 

Piiquante se dédie à la création de sauces épicées dont les recettes sont gardées secrètes. Pour tirer parti de son succès et générer davantage de buzz, 
l'entreprise souhaite créer une application web dans laquelle les utilisateurs peuvent ajouter leurs sauces préférées et liker ou disliker les sauces 
ajoutées par les autres.

_______________________________________________________________________________________________________________________________________________________________________

Objectif du projet

Construction d'une API REST sécurisée avec Node.js et le framework Express pour l'application d'avis gastronomiques Piiquante.

_______________________________________________________________________________________________________________________________________________________________________

Exigences de sécurité

- Le mot de passe de l'utilisateur est haché avec la méthode hach() du package bcrypt.
- L'authentification est renforcée sur toutes les routes sauce requises grâce la méthode verify() du package jsonwebtoken permet de vérifier la validité d'un token
- Les adresses électroniques dans la base de données sont uniques et le plugin Mongoose unique validator est utilisé pour garantir leur unicité et signaler les erreurs. 
- Grâce au header de contrôle d'accès présent dans le fichier app.js, la sécurité de la base de données MongoDB n'empêche pas l'application de se lancer sur la machine d'un utilisateur. 
- Le plugin Mongoose assure la remontée des erreurs issues de la base de données. 
- Le contenu du dossier 'images' n'est pas téléchargé sur GitHub grâce au fichier .gitignore

_______________________________________________________________________________________________________________________________________________________________________


Lancer l'application

1. Clonez le repository du projet pour obtenir la partie Frontend
2. Ouvrez un terminal (Linux/Mac) ou une invite de commande/PowerShell (Windows) 
3. Exécutez npm install à partir du répertoire du projet 
4. Exécutez npm run start 
5. Demarrez le back-end sur http://localhost:3000 seulement 
