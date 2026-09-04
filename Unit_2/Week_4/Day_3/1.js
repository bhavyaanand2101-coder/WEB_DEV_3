// Unit 2 - Week 4 - Day 3
// Topics: Express.js Routing & Middleware

const express = require("express");
const app = express();
const PORT = 8080;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Unit 2 Week 4 Day 3 - Express App");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
