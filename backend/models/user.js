const mongoose = require('mongoose');
//on install le package npm install --save mongoose-unique-validator puis on l'importe
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
//on applique la methode plugin du package npm install --save mongoose-unique-validator
//pour aider le unique: true ci-dessus
userSchema.plugin(uniqueValidator);
//on exporte le shéma sous forme de model grace à la methode model de mongoose
module.exports = mongoose.model('User', userSchema);