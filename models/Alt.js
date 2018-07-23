const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const AltSchema = new Schema({
	email: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    altOwner: { type: String, default: 'FocDev' }
});


// Set Model & export it
module.exports = Alt = mongoose.model('Alt', AltSchema);