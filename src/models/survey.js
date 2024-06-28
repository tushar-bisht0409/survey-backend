const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const surveySchema = new Schema({
    survey_id: {
        type: String,
        unique: true,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    coordinates: {
        latitude: Number,
        longitude: Number
    },
    image_url: {
        type: String
    },
    survey_status: {
        type: String,
        default: 'pending'
    },
    survey_remarks: [{
        type: String,
    }],
    information: {},
    created_at: {
        type: Date,
        default: Date.now
    }
});

const Survey = Mongoose.model('Surveys', surveySchema);

module.exports = Survey;