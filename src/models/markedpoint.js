const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const markedpointSchema = new Schema({
    mp_id: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    coordinates: [{
        lat: Number,
        lng: Number
    }],
    created_at: {
        type: Date,
        default: Date.now
    }
});

const Markespoint = Mongoose.model('Markespoints', markedpointSchema);

module.exports = Markespoint;