// Express vs HTTP-
// const http = require("http");
// const server = http.createServer((req, res) => {
//   if (req.url === "/" && req.method === "GET") {
//     res.end("Hello from HTTP server");
//   } else if (req.url === "/about" && req.method === "GET") {
//     res.end("Hello from About page");
//   }
// });
// server.listen(8080, () => {
//   console.log("Server is running on port 8080");
// });

// Express
// const express = require("express");
// const app = express();
// const port = 8080;
// app.get("/", (req, res) => {
//   res.send("Hello from Express server");
// });

// Basic Routes-

// app.get("/", (req, res) => {
//   res.send("Hello from Express server");
// });
// app.get("/about", (req, res) => {
//   res.send("Hello from About page");
// });
// app.get("/contact", (req, res) => {
//   res.send("Hello from Contact page");
// });
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
// PPT- 1 Finished

// Request- Response Cycle-
// Request Object-
// app.get("/", (req, res) => {
//   console.log(req);
//   res.send("hello");
// });

// Post- creates new data, Put- updates existing data, Patch- Partially updates existing

// Request Object-
// app.get("/", (req, res) => {
//     const id = req.params.id;
//     res.send(id);
// })

//  MVC Architecture
// let student = [
//   {
//     id: 1,
//     name: "Rahul",
//     age: 20,
//   },
// ];
// const getStudent = (req, res) => {
//   res.send(student);
// };

// Controller-
// const welcome = (req, res) => {
//   res.send("Welcome");
// };
// module.exports = { welcome };
// PPT-3 Finished
