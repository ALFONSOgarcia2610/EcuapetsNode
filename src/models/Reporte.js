const mongoose = require('mongoose');
const {Schema} = mongoose;
const ReporteSchema = new Schema({
    lugar: String,
    detalle: String,
    recompensa: Number,
    Mascota: String,
    date: {type: Date, default: Date.now()}
    
});

module.exports = mongoose.model('Reporte', ReporteSchema)