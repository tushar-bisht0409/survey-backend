const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const userSchema = new Schema({
    user_id: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    range: {
        type: Number,
        default: 15
    },
    center: {
        latitude: Number,
        longitude: Number
    },
    active: {
        type: Boolean,
        default: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const Users = Mongoose.model('Users', userSchema);

module.exports = Users;