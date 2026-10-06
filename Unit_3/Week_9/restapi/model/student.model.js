const mongoose = require("mongoose");

// Step -3 Making structure
const studentSchema = new mongoose.Schema(
  {
    name: String,
    age: Number,
  },
  {
    versionKey: false,
  }
);

// Step -4 Making Model
const studentModel = mongoose.model("student", studentSchema);

module.exports = { studentModel };
