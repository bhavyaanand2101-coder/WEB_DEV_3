const express = require("express");
const fs = require("fs");

const {} = require("./routes/student.route");
const app = express();

app.use("/students", studentRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
