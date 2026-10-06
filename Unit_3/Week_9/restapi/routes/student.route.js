const express = require("express");

const { studentModel } = require("../model/student.model");

const studentRouter = express.Router();

// GET Route: for Read all student document
studentRouter.get("/read", async (req, res) => {
  try {
    const student = await studentModel.find();
    res.send(student);
  } catch (error) {
    res.send({ msg: "Something went wrong" });
  }
});

// GET Route: for Read student document based upon ID
studentRouter.get("/read/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const student = await studentModel.findById({ _id: id });
    res.send(student);
  } catch (error) {
    res.send({ msg: "Something went wrong" });
  }
});

// POST Route: for Creating student
studentRouter.post("/create", async (req, res) => {
  const payload = req.body; // {name:"lp","age":24}
  try {
    const newstudent = new studentModel(payload);
    await newstudent.save();
    res.send({ msg: "New student Successfully" });
  } catch (error) {
    res.send({ msg: "Something went wrong" });
  }
});

module.exports = { studentRouter };
