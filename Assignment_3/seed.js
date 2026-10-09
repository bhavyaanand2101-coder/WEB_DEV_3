const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const seedProducts = require("./data/seedProducts.json");

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/inventory_db";
    await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB at ${mongoUri}`);

    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products from database.");

    // Insert initial seed data
    const inserted = await Product.insertMany(seedProducts);
    console.log(`Successfully seeded ${inserted.length} products!`);

    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
