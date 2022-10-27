const mongoose = require('mongoose');
process.env.MONGODB_URL
mongoose.connect(process.env.MONGODB_URL)
.then (db => console.log('DB Conectada'))
.catch (err => console.error(err));
