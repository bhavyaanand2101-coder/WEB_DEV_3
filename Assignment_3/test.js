// Simple Test Script for Inventory API
require("dotenv").config();

const findBaseUrl = async () => {
  // Test if our API is running on 5000 or 5001
  for (const port of [process.env.PORT || 5000, 5001]) {
    try {
      const res = await fetch(`http://localhost:${port}/`);
      const data = await res.json();
      if (data && data.version) {
        return `http://localhost:${port}/api/products`;
      }
    } catch {}
  }
  return `http://localhost:5000/api/products`;
};

const testServer = async () => {
  const baseUrl = await findBaseUrl();
  console.log("Testing Inventory API at:", baseUrl);

  try {
    // 1. Create a product
    console.log("\n1. Creating Product...");
    const createRes = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Pen",
        sku: "TEST-PEN-" + Date.now(),
        category: "Stationery",
        price: 50,
        quantity: 10,
        reorderLevel: 15,
        supplier: "Test Supplier"
      })
    });
    const created = await createRes.json();
    console.log("Created:", created.name, "| SKU:", created.sku, "| Stock Value:", created.stockValue);
    const id = created._id;

    // 2. Get all products (with pagination)
    console.log("\n2. Getting All Products...");
    const allRes = await fetch(`${baseUrl}?page=1&limit=5`);
    const all = await allRes.json();
    console.log(`Total: ${all.total}, Page: ${all.page}, Returned: ${all.count}`);

    // 3. Low stock report
    console.log("\n3. Checking Low Stock Items...");
    const lowRes = await fetch(`${baseUrl}/low-stock`);
    const low = await lowRes.json();
    console.log("Low Stock Items Count:", low.count);

    // 4. Category summary (Aggregation)
    console.log("\n4. Checking Category Summary...");
    const sumRes = await fetch(`${baseUrl}/summary`);
    const sum = await sumRes.json();
    console.log("Categories:", sum.categories, "| Summary:", sum.summary.map(s => s._id));

    // 5. Update stock (PATCH /:id/stock)
    console.log("\n5. Updating Stock (+5)...");
    const stockRes = await fetch(`${baseUrl}/${id}/stock`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ change: 5 })
    });
    const stockData = await stockRes.json();
    console.log("New Quantity:", stockData.product.quantity);

    // 6. Delete product
    console.log("\n6. Deleting Test Product...");
    const delRes = await fetch(`${baseUrl}/${id}`, { method: "DELETE" });
    const delData = await delRes.json();
    console.log("Delete status:", delData.message);

    console.log("\n✅ All basic API tests completed successfully!");
  } catch (error) {
    console.error("Test error:", error.message);
  }
};

testServer();
