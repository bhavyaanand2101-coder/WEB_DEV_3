# Lab Assignment 3: Inventory and Data Management System

**Course:** Web Dev III (Unit – 3)  
**CO Mapping:** CO3 | **Marks:** 2.5 | **Mode:** In-Class Lab Practical  
**Tech Stack:** Node.js, Express.js, MongoDB, Mongoose, dotenv  
**Author:** Bhavya  

---

## 📌 Project Overview

A clean, lightweight RESTful backend built with **Node.js**, **Express.js**, and **MongoDB (Mongoose ODM)** for warehouse inventory management.

---

## 📁 Simple Project Structure

```text
Assignment_3/
├── models/
│   └── Product.js          # Mongoose Schema, validation & virtual stockValue
├── routes/
│   └── productRoutes.js    # All 8 API endpoints (CRUD, queries, aggregations)
├── data/
│   └── seedProducts.json   # Initial dataset matching lab screenshots
├── .env                    # Environment variables (PORT, MONGO_URI)
├── package.json            # Dependencies & scripts
├── seed.js                 # Seed database with initial products
├── server.js               # Express server entry point & error handler
├── test.js                 # Simple API test script
└── README.md               # Documentation & API reference
```

---

## 🚀 How to Run

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Seed sample data:**
   ```bash
   npm run seed
   ```

3. **Start the server:**
   ```bash
   npm start
   # or with nodemon:
   npm run dev
   ```

4. **Run test script:**
   ```bash
   npm test
   ```

---

## 📡 API Endpoints Summary

Base URL: `http://localhost:5000/api/products`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/products` | Create a new product (validates SKU, required fields, calculates `stockValue`) |
| `GET` | `/api/products` | Get all products (supports `?page=1&limit=10`, `?category=...`, `?search=...`, `?minPrice=...&maxPrice=...`, `?sortBy=price&order=asc`) |
| `GET` | `/api/products/low-stock` | Get low stock items (`quantity <= reorderLevel`) |
| `GET` | `/api/products/summary` | Category summary aggregation (`totalItems`, `totalQuantity`, `totalStockValue`, `avgPrice`) |
| `GET` | `/api/products/:id` | Get single product by MongoDB ID |
| `PUT` | `/api/products/:id` | Update product details |
| `PATCH` | `/api/products/:id/stock` | Adjust stock level safely (restock / sale via `{"change": 10}`) |
| `DELETE` | `/api/products/:id` | Delete product by ID |
