const Admin = require('../models/admin');
const jwt = require("jwt-simple");

exports.registerAdmin = async (req, res) => {
    try {

        const { admin_id, password } = req.body;

        const newAdmin = new Admin({
            admin_id, password
        });

        await newAdmin.save();

        return res.status(201).json({ success: true, message: 'Admin saved successfully', admin_id: newAdmin._id });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error
        });    }
}

exports.verifyPassword= async function (req, res) {

    try{
    var obj = req.query;
    const admin = await Admin.findOne(
        {
            admin_id: obj.admin_id
        });
            if (!admin) {
                return res.status(401).json({ success: false, message: "Authentication Failed,Admin Not Found" });
            }
            else {
                admin.comparePassword(obj.password, function (err, isMatch) {
                    if (isMatch && !err) {
                        var token = jwt.encode(admin, process.env.SECRET);
                        return res.status(201).json({ 
                            success: true,
                            token: token,
                            admin_id: admin._id
                        });
                    }
                    else {
                        return res.status(202).json({
                            success: false,
                            message: "Authentication Failed,Wrong Password"
                        });
                    }
                });
            }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error
        });    }
},

exports.changePassword = async function (req, res) {
    try {
        const admin = await Admin.findOne({ admin_id: req.body.admin_id })
        if (!admin) {
            return res.json({
                success: false,
                message: "Failed to Change Password",
            });
        } else {
            admin.comparePassword(req.body.password, async function (err, isMatch) {
                if (isMatch && !err) {
                    admin.password = req.body.new_password;
                    await admin.save();
                            return res.status(201).json({
                                success: true,
                                message: "Password Successfully Changed",
                            });
                }
                else {
                    return res.status(202).json({
                        success: false,
                        message: "Wrong Password"
                    });
                }
            });
        }
} catch (error) {
    return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: error
    });    }
}