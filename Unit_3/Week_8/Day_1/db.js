// const mongoose = require("mongoose");

// // const connection = mongoose.connect("mongodb://127.0.0.1:27017/day_3");
// const connection = mongoose.connection("mongodb://127.0.0.1:27017/day_3");

// const userSchema = new mongoose.Schema({
//   name: String,
//   age: Number,
// });

// const userModel = mongoose.model("user", userSchema);

// module.exports = {
//   connection,
//   userModel,
// };

const mongoose = require("mongoose");

// Connect to MongoDB
const connection = mongoose.connect("mongodb://127.0.0.1:27017/day_3");

// Create Schema
const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
});

// Create Model
const userModel = mongoose.model("user", userSchema);

// Export
module.exports = {
  connection,
  userModel,
};
