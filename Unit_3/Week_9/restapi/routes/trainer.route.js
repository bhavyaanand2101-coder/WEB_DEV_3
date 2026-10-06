const express = require("express");

const { trainerModel } = require("../model/trainer.model");

const trainerRouter = express.Router();

// GET Route: for Read all trainer document
trainerRouter.get("/read", async (req, res) => {
  try {
    const trainer = await trainerModel.find();
    res.send(trainer);
  } catch (error) {
    res.send({ msg: "Something went wrong" });
  }
});

// GET Route: for Read trainer document based upon ID
trainerRouter.get("/read/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const trainer = await trainerModel.findById({ _id: id });
    res.send(trainer);
  } catch (error) {
    res.send({ msg: "Something went wrong" });
  }
});

// POST Route: for Creating trainer
trainerRouter.post("/create", async (req, res) => {
  const payload = req.body; // {name:"lp","age":24}
  try {
    const newtrainer = new trainerModel(payload);
    await newtrainer.save();
    res.send({ msg: "New trainer Successfully" });
  } catch (error) {
    res.send({ msg: "Something went wrong" });
  }
});

module.exports = { trainerRouter };
