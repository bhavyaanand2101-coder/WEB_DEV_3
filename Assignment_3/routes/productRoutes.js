const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// 1. GET LOW-STOCK ALERT (quantity <= reorderLevel)
// GET /api/products/low-stock
router.get("/low-stock", async (req, res, next) => {
  try {
    const lowStockItems = await Product.find({
      $expr: { $lte: ["$quantity", "$reorderLevel"] }
    }).sort({ quantity: 1 });

    res.status(200).json({
      count: lowStockItems.length,
      lowStockItems
    });
  } catch (error) {
    next(error);
  }
});

// 2. CATEGORY-WISE INVENTORY SUMMARY (Aggregation Pipeline)
// GET /api/products/summary
router.get("/summary", async (req, res, next) => {
  try {
    const summary = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          totalItems: { $sum: 1 },
          totalQuantity: { $sum: "$quantity" },
          totalStockValue: { $sum: { $multiply: ["$price", "$quantity"] } },
          avgPrice: { $avg: "$price" }
        }
      },
      {
        $project: {
          _id: 1,
          totalItems: 1,
          totalQuantity: 1,
          totalStockValue: 1,
          avgPrice: { $round: ["$avgPrice", 2] }
        }
      },
      {
        $sort: { totalStockValue: -1 }
      }
    ]);

    res.status(200).json({
      categories: summary.length,
      summary
    });
  } catch (error) {
    next(error);
  }
});

// 3. GET ALL PRODUCTS (Filtering, Sorting & Pagination)
// GET /api/products
router.get("/", async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      minPrice,
      maxPrice,
      sortBy = "createdAt",
      order = "desc"
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const filter = {};

    // Filter by Category
    if (category) {
      filter.category = { $regex: new RegExp(`^${category.trim()}$`, "i") };
    }

    // Search by Name or SKU
    if (search) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [{ name: regex }, { sku: regex }];
    }

    // Filter by Price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const sortOrder = order.toLowerCase() === "asc" ? 1 : -1;
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.status(200).json({
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
});

// 4. CREATE NEW PRODUCT
// POST /api/products
router.post("/", async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

// 5. GET SINGLE PRODUCT BY ID
// GET /api/products/:id
router.get("/:id", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
});

// 6. UPDATE PRODUCT DETAILS
// PUT /api/products/:id
router.put("/:id", async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
});

// 7. ADJUST STOCK LEVEL (Restock & Sale)
// PATCH /api/products/:id/stock
router.patch("/:id/stock", async (req, res, next) => {
  try {
    const { change } = req.body;
    if (typeof change !== "number" || isNaN(change) || change === 0) {
      return res.status(400).json({ error: "Valid non-zero change number is required" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Prevent negative stock
    if (product.quantity + change < 0) {
      return res.status(400).json({
        error: `Insufficient stock. Current: ${product.quantity}, cannot reduce by ${Math.abs(change)}`
      });
    }

    product.quantity += change;
    await product.save();

    res.status(200).json({
      message: "Stock updated",
      product
    });
  } catch (error) {
    next(error);
  }
});

// 8. DELETE PRODUCT
// DELETE /api/products/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({
      message: "Product deleted",
      id: req.params.id
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
