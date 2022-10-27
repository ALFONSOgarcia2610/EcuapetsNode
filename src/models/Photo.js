const mongoose = require('mongoose');

const {Schema} = mongoose;
const PhotoSchema = new Schema({
    imageURL: String,
    public_id: String,
    Mascota: String
});

module.exports = mongoose.model('Photo', PhotoSchema)