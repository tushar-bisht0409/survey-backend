const { uuid } = require('uuidv4');
const Form = require('../models/form');

exports.saveForm = async (req, res) => {
    try {
        const {
            fields
        } = req.body;

        const newForm = new Form({
            form_id: uuid(),
            fields
        });

        await newForm.save();

        return res.status(201).json({
            success: true,
            message: 'Form Saved Successfully'
        });
        } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error
        });
    }
}

exports.getForm = async (req, res) => {
    try {

        const form = await Form.findOne({}).sort({ created_at: -1 });

        if(!form) {
            return res.status(202).json({
                success: false,
                message: 'Form Not Found',
                error: ''
            });        }

        return res.status(201).json({
            success: true,
            message: 'Form Found',
            form: form
        });
        } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error
        });
    }
}