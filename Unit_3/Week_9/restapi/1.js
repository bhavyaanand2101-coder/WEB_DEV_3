// Step -1 import module
const express = require("express");
const { connection } = require("./db");
const { studentRouter } = require("./routes/student.route");
const { trainerRouter } = require("./routes/trainer.route");

// Step -2 building application via express
const app = express();

app.use(express.json());

app.use("/student", studentRouter);
app.use("/trainer", trainerRouter);
// Step -4 Making API
// API
app.get("/", (req, res) => {
  res.send({ msg: "Welcome to my application" });
});

// Step -3 Run app on 8080 port
app.listen(8080, async () => {
  try {
    // Step - 5 Connect server with DB
    await connection;
    console.log("DB Connected");
  } catch (error) {
    console.log(error);
  }
  console.log("Server started");
});
