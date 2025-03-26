const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(
            "mongodb+srv://krishmehra13yu:468AGxFTUDVPnLSC@cluster1.izagn.mongodb.net/devTinder"
        );
        console.log("database connection established");
    } catch (err) {
        console.error("database connection failed", err);
    }
};

module.exports = connectDB;