const Geojson = require('../models/geojson');

exports.saveGeojson = async (req, res) => {
    try {
        const {
            geojson_id,
            user_id,
            coordinates
        } = req.body;

        const newGeojson = new Geojson({
            geojson_id,
            user_id,
            coordinates
        });

        await newGeojson.save();

        return res.status(201).json({
            success: true,
            message: 'Geojson Saved Successfully'
        });
        } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error
        });
    }
}

exports.getUserGeojson = async (req, res) => {
    try {
        const {
            user_id
        } = req.query;

        const geojson = await Geojson.findOne({ user_id }).sort({ created_at: -1 });

        if(!geojson) {
            return res.status(401).json({
                success: false,
                message: 'Geojson Not Found',
                error: ''
            });        }

        return res.status(201).json({
            success: true,
            message: 'Geojson Found',
            geojson: geojson
        });
        } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error
        });
    }
}
