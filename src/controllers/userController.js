const { uuid } = require('uuidv4');
const User = require('../models/user');
const Geojson = require('../models/geojson');

exports.saveUser = async (req, res) => {
    try {
        const {
            user_id,
            password,
            coordinates
        } = req.body;

        const newUser = new User({
            user_id,
            password,
        });
        const newGeojson = new Geojson({
            geojson_id: uuid(),
            user_id,
            coordinates
        });

        await newGeojson.save();
        await newUser.save();

        return res.status(201).json({
            success: true,
            message: 'User Saved Successfully'
        });
        } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error
        });
    }
}

exports.getUser = async (req, res) => {
    try {
        const {
            user_id
        } = req.query;

        const user = await User.findOne({ user_id });

        if(!user) {
            return res.status(401).json({
                success: false,
                message: 'User Not Found',
                error: ''
            });        }

        return res.status(201).json({
            success: true,
            message: 'User Found',
            user: user
        });
        } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error
        });
    }
}

exports.getAllUser = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const skip = (page - 1) * limit;

        const users = await User.find()
            .skip(skip)
            .limit(limit)
            .exec();

        const totalCount = await User.countDocuments();
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No users found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Users found',
            users: users,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            totalCount: totalCount
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const {
            user_id,
            password,
            coordinates
        } = req.body;

        const newGeojson = new Geojson({
            geojson_id: uuid(),
            user_id,
            coordinates
        });

        await newGeojson.save();

        const user = await User.findOneAndUpdate({ user_id },
            {password}
        );

        if(!user) {
            return res.status(401).json({
                success: false,
                message: 'User Not Found',
                error: ''
            });        }

        return res.status(201).json({
            success: true,
            message: 'User Updated Successfully'
        });
        } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error
        });
    }
}

exports.updateActiveStatus = async (req, res) => {
    try {
        const {
            user_id,
            active
        } = req.body;

        const user = await User.findOneAndUpdate({ user_id },
            {active}
        );

        if(!user) {
            return res.status(401).json({
                success: false,
                message: 'User Not Found',
                error: ''
            });        }

        return res.status(201).json({
            success: true,
            message: 'User Updated Successfully'
        });
        } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error
        });
    }
}

exports.verifyPassword = async (req, res) => {
    try {
        const {
            user_id,
            password
        } = req.query;

        const user = await User.findOne({ user_id, password });

        if(!user) {
            return res.status(401).json({
                success: false,
                message: 'Wrong User ID or Password',
                error: ''
            });        }

        return res.status(201).json({
            success: true,
            message: 'User Found',
            user: user
        });
        } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error
        });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const {
            user_id
        } = req.body;

        const user = await User.findOneAndDelete({ user_id });

        if(!user) {
            return res.status(401).json({
                success: false,
                message: 'User Not Found',
                error: ''
            });        }

        return res.status(201).json({
            success: true,
            message: 'User Deleted Successfully'
        });
        } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error
        });
    }
}