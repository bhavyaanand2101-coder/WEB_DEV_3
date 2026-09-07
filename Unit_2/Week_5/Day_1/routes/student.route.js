const express = require("express");
const fs = require("fs");

const studentRouter = express.Router();
studentRouter.get("/read", (req, res) => {
  const data = fs.readFileSync("./1.json", "utf-8");
  res.send(data);
});

module.exports = { studentRouter };
