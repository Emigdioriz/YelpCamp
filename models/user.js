const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema ({
    email:{
        type: String,
        required: true,
        unique: true
    }
});


// garante que o nosso userSchema tenha um username único e adiciona outros métodos ao modelo
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);