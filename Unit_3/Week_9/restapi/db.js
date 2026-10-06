// Step -1 import module
const mongoose = require("mongoose");
require("dotenv").config();

// Step -2 Connection bulding
const connection = mongoose.connect(process.env.mongourl);

// Step -5 Export module for using in 1.js
module.exports = { connection };
