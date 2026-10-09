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

// ============================================================
// LECTURE 14 - CRUD OPERATIONS USING MVC
// Express.js
// Temporary Database: Array
// ============================================================

const express = require("express");

const app = express();

// ============================================================
// MIDDLEWARE
// ============================================================

app.use(express.json());

// ============================================================
// TEMPORARY DATABASE
// ============================================================

let students = [
  {
    id: 1,
    name: "Rahul",
    age: 22,
    course: "B.Tech",
  },
  {
    id: 2,
    name: "Aman",
    age: 20,
    course: "BCA",
  },
  {
    id: 3,
    name: "Priya",
    age: 23,
    course: "B.Tech",
  },
];

// ============================================================
// CREATE OPERATION
// POST /students
// ============================================================

const createStudent = (req, res) => {
  const { name, age, course } = req.body;

  const newStudent = {
    id: students.length + 1,
    name: name,
    age: age,
    course: course,
  };

  students.push(newStudent);

  res.status(201).json({
    message: "Student created successfully",
    student: newStudent,
  });
};

// ============================================================
// READ ALL STUDENTS
// GET /students
// ============================================================

const getStudents = (req, res) => {
  res.status(200).json({
    message: "All students",
    students: students,
  });
};

// ============================================================
// READ SINGLE STUDENT
// GET /students/:id
// ============================================================

const getStudentById = (req, res) => {
  const id = parseInt(req.params.id);

  const student = students.find((student) => student.id === id);

  if (!student) {
    return res.status(404).json({
      message: "Student Not Found",
    });
  }

  res.status(200).json({
    message: "Student found",
    student: student,
  });
};

// ============================================================
// UPDATE OPERATION
// PUT /students/:id
// ============================================================

const updateStudent = (req, res) => {
  const id = parseInt(req.params.id);

  const student = students.find((student) => student.id === id);

  if (!student) {
    return res.status(404).json({
      message: "Student Not Found",
    });
  }

  const { name, age, course } = req.body;

  if (name !== undefined) {
    student.name = name;
  }

  if (age !== undefined) {
    student.age = age;
  }

  if (course !== undefined) {
    student.course = course;
  }

  res.status(200).json({
    message: "Student updated successfully",
    student: student,
  });
};

// ============================================================
// DELETE OPERATION
// DELETE /students/:id
// ============================================================

const deleteStudent = (req, res) => {
  const id = parseInt(req.params.id);

  const index = students.findIndex((student) => student.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Student Not Found",
    });
  }

  const deletedStudent = students.splice(index, 1);

  res.status(200).json({
    message: "Student deleted successfully",
    student: deletedStudent[0],
  });
};

// ============================================================
// SEARCH OPERATION
// GET /search?name=rahul
// ============================================================

const searchStudent = (req, res) => {
  const name = req.query.name;

  const student = students.find(
    (student) => student.name.toLowerCase() === name.toLowerCase(),
  );

  if (!student) {
    return res.status(404).json({
      message: "Student Not Found",
    });
  }

  res.status(200).json({
    message: "Student found",
    student: student,
  });
};

// ============================================================
// FILTER OPERATION
// GET /filter?age=21
// ============================================================

const filterStudents = (req, res) => {
  const age = parseInt(req.query.age);

  const filteredStudents = students.filter((student) => student.age > age);

  res.status(200).json({
    message: "Filtered students",
    students: filteredStudents,
  });
};

// ============================================================
// ROUTES
// ============================================================

// CREATE
app.post("/students", createStudent);

// READ ALL
app.get("/students", getStudents);

// READ SINGLE
app.get("/students/:id", getStudentById);

// UPDATE
app.put("/students/:id", updateStudent);

// DELETE
app.delete("/students/:id", deleteStudent);

// SEARCH
app.get("/search", searchStudent);

// FILTER
app.get("/filter", filterStudents);

// ============================================================
// HOME ROUTE
// ============================================================

app.get("/", (req, res) => {
  res.send("Student CRUD API is running");
});

// ============================================================
// START SERVER
// ============================================================

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
