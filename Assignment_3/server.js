const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const productRoutes = require("./routes/productRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/inventory_db";

// Middleware
app.use(express.json());

// Root Route
app.get("/", (req, res) => {
  res.json({
    message: "Inventory and Data Management System API",
    version: "1.0.0"
  });
});

// Product Routes
app.use("/api/products", productRoutes);

// 404 Not Found Middleware
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  // Validation Error
  if (err.name === "ValidationError") {
    const details = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ error: "Validation Error", details });
  }
  // Duplicate SKU (E11000)
  if (err.code === 11000) {
    return res.status(400).json({ error: "Product SKU must be unique" });
  }
  // Invalid ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({ error: `Invalid ${err.path}: ${err.value}` });
  }
  // Default server error
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

// Connect to MongoDB and start server
const start = async (port = PORT) => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`Connected to MongoDB: ${MONGO_URI}`);

    const server = app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });

    // Auto-fallback if port 5000 is occupied by macOS AirPlay
    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        const nextPort = Number(port) + 1;
        console.log(`Port ${port} in use. Switching to http://localhost:${nextPort}...`);
        start(nextPort);
      }
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

start();
