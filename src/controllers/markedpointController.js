const Markedpoint = require('../models/markedpoint');
const { uuid } = require('uuidv4');

exports.saveMarkedpoint = async (req, res) => {
    try {
        const {
            name,
            coordinates,
        } = req.body;

        const newMarkedpoint = new Markedpoint({
            mp_id: uuid(),
            name,
            coordinates
        });

        await newMarkedpoint.save();

        return res.status(201).json({
            success: true,
            message: 'Markedpoint Saved Successfully'
        });
        } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error
        });
    }
}

exports.getMarkedpoint = async (req, res) => {
    try {
        const {
            mp_id
        } = req.query;

        const markedpoint = await Markedpoint.findOne({ mp_id });

        if(!markedpoint) {
            return res.status(401).json({
                success: false,
                message: 'Markedpoint Not Found',
                error: ''
            });        }

        return res.status(201).json({
            success: true,
            message: 'Markedpoint Found',
            markedpoint: markedpoint
        });
        } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error
        });
    }
}

exports.getMarkedpointList = async (req, res) => {
    try {

        const {
            limit = 20,
            page = 1
        } = req.query;

        let survey;
        let totalCount;
        const offset = (page - 1) * limit;

        const markedpoint = await Markedpoint.find({}, 'mp_id name').sort({ created_at: -1 })
        .skip(offset)
        .limit(parseInt(limit));
        totalCount = await Markedpoint.countDocuments();

        if(!markedpoint) {
            return res.status(401).json({
                success: false,
                message: 'Markedpoint Not Found',
                error: ''
            });        }

        return res.status(201).json({
            success: true,
            message: 'Markedpoint Found',
            markedpoint: markedpoint,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            totalCount: totalCount
        });
        } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error
        });
    }
}