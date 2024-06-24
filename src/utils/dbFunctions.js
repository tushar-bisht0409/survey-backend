const User = require('../models/user'); // Import the User model

exports.ingestUserData = async () => {
    try {
        // Create a new User instance
        const newUser = new User({
            email: 'example@email.com',
            password: 'hashedPassword', // You should hash the password before storing it
            name: 'John Doe'
        });

        // Save the user to the database
        await newUser.save();
        console.log('User data ingested successfully!');
    } catch (error) {
        console.error('Error ingesting user data:', error);
    }
}


exports.checkPhoneNumber = async (phoneNumber) => {
    try {
        const existingUser = await Users.findOne({ phone: phoneNumber });
        if (existingUser) {
            console.log(`Phone number ${phoneNumber} already exists in the database.`);
            return true
        } else {
            console.log(`Phone number ${phoneNumber} does not exist in the database.`);
            return false
        }
    } catch (error) {
        console.error('Error checking phone number:', error);
    }
}

const demoFunction = async () => {}
