# Lab Assignment 3 – In-Depth Technical & Viva Guide

**Course:** Web Development III  
**Unit:** Unit 3 – Persistent Storage with MongoDB & Mongoose  
**Topic:** Inventory and Data Management System  

---

## 1. Architectural Highlights

### 1.1 MVC (Model-View-Controller) Pattern
The backend follows the standard industry-grade separation of concerns:
1. **Config (`config/db.js`):** Encapsulates the MongoDB connection logic using Mongoose and `process.env.MONGO_URI`.
2. **Model (`models/Product.js`):** Defines the document schema, field-level constraints, unique indexes, and virtual getters (`stockValue`).
3. **Controller (`controllers/productController.js`):** Contains business logic for CRUD operations, safe stock updates, pagination math, and aggregation pipelines.
4. **Routes (`routes/productRoutes.js`):** Connects HTTP verbs and URL paths to corresponding controller handlers with correct route precedence.
5. **Middleware (`middleware/errorHandler.js`):** Catches and formats validation, casting, duplicate key, and 404 errors centrally.

---

## 2. Key Technical Concepts & Implementation Details

### 2.1 Route Precedence in Express.js
In Express, route paths are matched in the order they are registered.
- Dynamic route: `/api/products/:id` matches any string after `/api/products/`.
- Static endpoints: `/api/products/low-stock` and `/api/products/summary`.
- **Critical Design Decision:**
  If `/api/products/:id` were declared before `/api/products/summary`, Express would treat `"summary"` as an `:id` parameter and attempt `Product.findById("summary")`, resulting in a `CastError` (400 Bad Request).
  Therefore, static endpoints are declared **before** parametric routes:
  ```javascript
  router.get("/low-stock", getLowStockProducts);
  router.get("/summary", getInventorySummary);
  router.get("/:id", getProductById);
  ```

---

### 2.2 Mongoose Schema Validation & Virtuals
The `Product` schema enforces strict validation:
- **Field Constraints:**
  - `name`: Required, trimmed, max length 120.
  - `sku`: Required, unique (`unique: true`), uppercase (`uppercase: true`), trimmed.
  - `price`: Required, non-negative (`min: [0, ...]`).
  - `quantity`: Required, non-negative integer (`min: [0, ...]`).
  - `reorderLevel`: Required, non-negative (`min: [0, ...]`, default: 5).
  - `supplier`: Required string.
- **Virtual Property `stockValue`:**
  A virtual field does not take up disk storage in MongoDB. Instead, it is computed on-the-fly during serialization:
  ```javascript
  productSchema.virtual("stockValue").get(function () {
    return (this.price || 0) * (this.quantity || 0);
  });
  ```
- **Serialization Flags:**
  ```javascript
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
  ```
  This ensures `stockValue` and the virtual `id` property appear automatically in JSON responses.

---

### 2.3 MongoDB Aggregation Pipeline (`/summary`)
To generate real-time business reports across thousands of products, aggregation happens at the database level rather than inside Node.js memory.

Pipeline stages used:
1. **`$group`:** Groups all documents by `category`:
   ```javascript
   {
     $group: {
       _id: "$category",
       totalItems: { $sum: 1 },
       totalQuantity: { $sum: "$quantity" },
       totalStockValue: { $sum: { $multiply: ["$price", "$quantity"] } },
       avgPrice: { $avg: "$price" }
     }
   }
   ```
2. **`$project`:** Rounds the calculated average price to 2 decimal places:
   ```javascript
   {
     $project: {
       _id: 1,
       totalItems: 1,
       totalQuantity: 1,
       totalStockValue: 1,
       avgPrice: { $round: ["$avgPrice", 2] }
     }
   }
   ```
3. **`$sort`:** Sorts categories in descending order of total inventory financial value:
   ```javascript
   { $sort: { totalStockValue: -1 } }
   ```

---

### 2.4 Low-Stock Alert Querying (`/low-stock`)
Products must be flagged when inventory drops to or below the reorder threshold.
Since this requires comparing two fields within the same document (`quantity` and `reorderLevel`), we use MongoDB's `$expr` operator:
```javascript
const lowStockItems = await Product.find({
  $expr: { $lte: ["$quantity", "$reorderLevel"] }
}).sort({ quantity: 1 });
```

---

### 2.5 Safe Stock Adjustments (`PATCH /:id/stock`)
Warehouse operations require increasing stock (restocking) or decreasing stock (sales/dispatch).
- The controller validates that the `change` parameter is a non-zero number.
- It performs a safety guard to prevent stock from dropping below zero:
  ```javascript
  if (product.quantity + change < 0) {
    return res.status(400).json({
      error: `Insufficient stock. Current quantity is ${product.quantity}, cannot reduce by ${Math.abs(change)}.`
    });
  }
  product.quantity += change;
  await product.save();
  ```

---

### 2.6 Querying: Filtering, Searching & Pagination
`GET /api/products` supports flexible query parameters:
- **Pagination:**
  - `page` (default 1) and `limit` (default 10).
  - Skips `(page - 1) * limit` documents.
  - Returns metadata: `total`, `page`, `totalPages`, `count`, and `products`.
- **Search:** Case-insensitive regular expression across both `name` and `sku`:
  ```javascript
  filter.$or = [
    { name: { $regex: search, $options: "i" } },
    { sku: { $regex: search, $options: "i" } }
  ];
  ```
- **Price Range:** Supports `minPrice` (`$gte`) and `maxPrice` (`$lte`).
- **Sorting:** Supports customizable sorting via `sortBy` and `order` (`asc` / `desc`).

---

### 2.7 Centralized Error Handling
All errors thrown by controllers are passed to `next(error)` and handled in `middleware/errorHandler.js`:
- **`ValidationError`:** Formats field-level error messages into readable feedback.
- **`MongoServerError` (Code 11000):** Catches duplicate SKU attempts and returns a descriptive 400 Bad Request error.
- **`CastError`:** Handles malformed MongoDB ObjectIDs gracefully.
- **404 Handler:** Catches any requests made to unregistered paths.

---

## 3. Potential Viva / Exam Questions & Answers

**Q1: What is the purpose of Mongoose virtuals, and do they get saved in MongoDB?**  
> *Answer:* Virtuals are logical document properties that can be gotten and set, but do not get persisted to the MongoDB database. They are computed dynamically when accessing or serializing documents (e.g. `stockValue = price * quantity`).

**Q2: Why do we use `$expr` in the low-stock query?**  
> *Answer:* Standard Mongoose query selectors compare a document field to a constant value. When comparing two fields of the same document (`quantity` and `reorderLevel`), MongoDB's `$expr` operator allows aggregation expressions within normal `.find()` queries.

**Q3: What happens if an API user passes a negative quantity change that exceeds the current stock?**  
> *Answer:* The controller validates `product.quantity + change < 0`. If true, it rejects the request with HTTP `400 Bad Request` and an explanatory message, preventing negative inventory.

**Q4: How does the aggregation pipeline in `/summary` differ from standard `.find()`?**  
> *Answer:* `.find()` returns raw documents matching criteria. The aggregation pipeline processes documents in sequential stages (`$group`, `$project`, `$sort`) directly inside the database engine, calculating summaries like sum and average without transferring all records into Node.js memory.
