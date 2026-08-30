// // No require needed — process is global
// console.log('Node version:', process.version);    // v24.11.0
// console.log('Platform:    ', process.platform);   // darwin
// console.log('PID:         ', process.pid);        // 2505
// console.log('Working dir: ', process.cwd());      //

// // Environment variables
// console.log('PATH:', process.env.PATH);
// console.log('USER:', process.env.USER);

// // Listening to process events
// process.on('exit', (code) => {
//     console.log(`Process exiting with code ${code}`);
// });

// // console.log('Node version:', process.version);

// Using .env file with dotenv package:

// npm install dotenv

// Create .env file:
// PORT=3000
// DB_URL=mongodb://...

// In your code:
// require('dotenv').config();

// // Then access:
// console.log('PORT:', process.env.PORT);
// console.log('DB_URL:', process.env.DB_URL);

const http = require("http");
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("<h1>Hello, World!</h1>");
  res.end();
});
server.listen(8080, () => {
  console.log("Server running at http://localhost:8080");
});
