const mongoose = require('mongoose');
const {Schema} = mongoose;
const MascotaSchema = new Schema({
  nombre: {type: String, required: true},
  especie: {type: String, required: true},
  raza: {type: String, required: true},
  genero: {type: String, required: true},
  fechanacimiento: {type: Date, required: true},
  v1: {type: String, required: false},
  fechav1: {type: Date, required: false},
  v2: {type: String, required: false},
  fechav2: {type: Date, required: false},
  v3: {type: String, required: false},
  fechav3: {type: Date, required: false},
  v4: {type: String, required: false},
  fechav4: {type: Date, required: false},
  v5: {type: String, required: false},
  fechav5: {type: Date, required: false},
  descripcion: {type: String, required: false},
  medicamentos: {type: String, required: false},
  estado: {type: Number, default: '0'},
  url: {type: String, default: 'url', required: false},
  propietario: {type: String,  required: false},
    perfil: { type: String, default: null, required: false },
  date: { type: Date, default: Date.now}
});

module.exports = mongoose.model('Mascota', MascotaSchema)