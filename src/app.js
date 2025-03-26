const express = require("express");
const connectDB = require("./config/database");
const app = express();

// Connect to database
connectDB();

app.listen(7777, () => {
    console.log('server is successfully running');
});