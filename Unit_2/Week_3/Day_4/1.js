// =====================================================
// Step - 1
// Import Modules
// =====================================================

const express = require("express");

const fs = require("fs");

// =====================================================
// Step - 2
// Create Express App
// =====================================================

const app = express();

// Middleware --> req.body --> parse

app.use(express.json());

// =====================================================
// Step - 3
// Routes / API
// =====================================================

// =====================================================
// HOME ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.send({
    msg: "Welcome to Express Server",
  });
});

// =====================================================
// HOME PAGE
// =====================================================

app.get("/home", (req, res) => {
  res.send({
    msg: "Welcome to Home Page",
  });
});

// =====================================================
// GET API / Read Route
// Read All Data
// =====================================================

app.get("/read", (req, res) => {
  const data = fs.readFileSync("./1.json", "utf-8");

  // JSON data -> JavaScript object
  const jsData = JSON.parse(data);

  console.log(jsData, typeof jsData);

  console.log(jsData.student);

  res.send({
    data: jsData,
  });
});

// =====================================================
// GET API / Read Route only for Student
// =====================================================

app.get("/stread", (req, res) => {
  const data = fs.readFileSync("./1.json", "utf-8");

  const jsData = JSON.parse(data);

  console.log(jsData, typeof jsData);

  console.log(jsData.student);

  res.send({
    data: jsData.student,
  });
});

// =====================================================
// GET API / Read Route only for Trainer
// =====================================================

app.get("/trread", (req, res) => {
  const data = fs.readFileSync("./1.json", "utf-8");

  const jsData = JSON.parse(data);

  console.log(jsData, typeof jsData);

  console.log(jsData.trainer);

  res.send({
    data: jsData.trainer,
  });
});

// =====================================================
// POST API / Create Student
// =====================================================

app.post("/create", (req, res) => {
  const payload = req.body;

  console.log("Payload:", payload);

  const data = JSON.parse(fs.readFileSync("./1.json", "utf-8"));

  const stdata = data.student;

  console.log("Old Student Data:", stdata);

  // Add new student
  stdata.push(payload);

  console.log("New Student Data:", stdata);

  data.student = stdata;

  // Write updated data to JSON file
  fs.writeFileSync("./1.json", JSON.stringify(data, null, 2));

  res.send({
    msg: "New Student Created Successfully",
  });
});

// =====================================================
// PUT API / Update Student
// Complete Update
// =====================================================

app.put("/update/:id", (req, res) => {
  const payload = req.body;

  console.log("Payload:", payload);

  // Get ID from URL
  const id = req.params.id;

  console.log("ID:", id);

  const data = JSON.parse(fs.readFileSync("./1.json", "utf-8"));

  const stdata = data.student;

  console.log("Old Student Data:", stdata);

  // Update student
  const updatedData = stdata.map((item) => {
    if (item.id == id) {
      return {
        ...item,
        ...payload,
      };
    } else {
      return item;
    }
  });

  console.log("Updated Student Data:", updatedData);

  // Update student array
  data.student = updatedData;

  // Save updated data
  fs.writeFileSync("./1.json", JSON.stringify(data, null, 2));

  res.send({
    msg: "Student Updated Successfully",
  });
});

// =====================================================
// PATCH API / Partial Update Student
// =====================================================

app.patch("/patch/:id", (req, res) => {
  const payload = req.body;

  console.log("Payload:", payload);

  // Get ID from URL
  const id = req.params.id;

  console.log("ID:", id);

  const data = JSON.parse(fs.readFileSync("./1.json", "utf-8"));

  const stdata = data.student;

  console.log("Old Student Data:", stdata);

  // Partial update
  const updatedData = stdata.map((el) => {
    if (el.id == id) {
      return {
        ...el,
        ...payload,
      };
    } else {
      return el;
    }
  });

  console.log("Partially Updated Student Data:", updatedData);

  // Update student array
  data.student = updatedData;

  // Save updated data
  fs.writeFileSync("./1.json", JSON.stringify(data, null, 2));

  res.send({
    msg: "Student Partially Updated Successfully",
  });
});

// =====================================================
// DELETE API / Delete Student
// =====================================================

app.delete("/delete/:id", (req, res) => {
  // Get ID from URL
  const id = req.params.id;

  console.log("ID:", id);

  // Read JSON file
  const data = JSON.parse(fs.readFileSync("./1.json", "utf-8"));

  const stdata = data.student;

  console.log("Old Student Data:", stdata);

  // Delete student
  const updatedData = stdata.filter((el) => {
    return el.id != id;
  });

  console.log("Updated Student Data:", updatedData);

  // Update student array
  data.student = updatedData;

  // Save updated data
  fs.writeFileSync("./1.json", JSON.stringify(data, null, 2));

  res.send({
    msg: "Student Deleted Successfully",
  });
});

// =====================================================
// SERVER
// =====================================================

app.listen(8080, () => {
  console.log("Server started on port 8080");
});

// =====================================================
// There are 3 methods for talking from Client to Server
// =====================================================
//
// 1. Query Parameter
//    --> req.query
//
// 2. Body Parameter
//    --> req.body
//
// 3. Route Parameter
//    --> req.params
//
// =====================================================
