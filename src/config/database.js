const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(
            "mongodb+srv://krishmehra13yu:468AGxFTUDVPnLSC@cluster1.izagn.mongodb.net/"
        );
    } catch (err) {
        // console.error("database connection failed", err);
    }
};

// Export the connection function
module.exports = connectDB;
