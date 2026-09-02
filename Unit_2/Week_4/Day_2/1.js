// Types of Middlewere-
// 3-
// 1. Core/Inbuilt Middlewere eg- express.json(),expressRouter()
// 2. Internal/Custom Middlewere eg- Timelogger M/W, Routelogger M/W, Watchman M/W
// 3. External/Third Party- eg- Multer,CORS

const express = require("express");
const app = express();
const fs = require("fs");
const timeloggerMiddlewere = (req, res, next) => {
  const startTime = Date.now();
  next();
  const endTime = Date.now();
  console.log(`Time taken to process the request: ${endTime - startTime} ms`);
};
// app.use(timeloggerMiddlewere);

// 2. Route logger Middlewere-
const routeLoggerMiddlewere = (req, res, next) => {
  const record = `Request received for route: ${req.originalUrl} and method: ${req.method}`;
  fs.appendFileSync("routeLogs.txt", record + "\n");
  next();
};
app.use(routeLoggerMiddlewere);

// 3. Watchman Middlewere
const watchmanMiddlewere = (req, res, next) => {
  if (req.originalUrl == "/admin") {
    res.send("You are not allowed to access this route");
  } else {
    console.log("You are allowed to access this route");

    next();
  }
};
app.use(watchmanMiddlewere);

app.get("/admin", (req, res) => {
  res.send("Welcome to Admin Page");
});

app.get("/home", (req, res) => {
  res.send("Welcome to Home Page");
});

app.get("/about", (req, res) => {
  res.send("Welcome to About Page");
});

app.get("/read", (req, res) => {
  const data = fs.readFileSync("./1.json", "utf-8");
  res.send(data);
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
