const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [120, "Product name cannot exceed 120 characters"]
    },
    sku: {
      type: String,
      required: [true, "Product SKU is required"],
      unique: true,
      uppercase: true,
      trim: true
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be a non-negative number"]
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
      default: 0
    },
    reorderLevel: {
      type: Number,
      required: [true, "Reorder level is required"],
      min: [0, "Reorder level cannot be negative"],
      default: 5
    },
    supplier: {
      type: String,
      required: [true, "Supplier is required"],
      trim: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual field for stock value (price * quantity)
productSchema.virtual("stockValue").get(function () {
  return (this.price || 0) * (this.quantity || 0);
});

// Indexing for common queries
productSchema.index({ category: 1 });
productSchema.index({ name: "text", sku: "text" });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
