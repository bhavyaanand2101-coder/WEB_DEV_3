const mongoose = require("mongoose");

// Step -3 Making structure
const trainerSchema = new mongoose.Schema(
  {
    name: String,
    age: Number,
  },
  {
    versionKey: false,
  }
);

// Step -4 Making Model
const trainerModel = mongoose.model("trainer", trainerSchema);

module.exports = { trainerModel };
