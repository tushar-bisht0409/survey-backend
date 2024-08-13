const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const bcrypt = require("bcryptjs");

const formSchema = new Schema({
    form_id: {
        type: String,
        unique: true,
        required: true
    },
    fields: [{
        type: Object
    }],
    created_at: {
        type: Date,
        default: Date.now
    }
});

const Forms = Mongoose.model('Forms', formSchema);

module.exports = Forms;