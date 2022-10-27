const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;
const UserSchema = new Schema({
nombre: {type: String, require: true},
apellido: {type: String, require: true},
email: {type: String, require: true},
password: {type: String, require: true},
genero: {type: String, require: true},
provincia: {type: String, require: false},
canton: {type: String, require: false},
c1: {type: String, require: false},
c2: {type: String, require: false},
tel1: {type: String, require: false},
tel2: {type: String, require: false},
date: {type: Date, default: Date.now}
});
//Cifrado de Contraseña
UserSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  };
//Desifrado de Contraseña 
  UserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

module.exports = mongoose.model('User', UserSchema)