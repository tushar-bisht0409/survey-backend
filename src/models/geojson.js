const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const geojsonSchema = new Schema({
    geojson_id: {
        type: String,
        unique: true,
        required: true
    },
    user_id: {
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

const Geojson = Mongoose.model('Geojson', geojsonSchema);

module.exports = Geojson;