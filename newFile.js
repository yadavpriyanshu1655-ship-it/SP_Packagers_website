const { app, readOrders } = require("./server");

// ========================================
// GET ORDERS
// ========================================
app.get(
  "/api/orders",
  (req, res) => {

    const orders = readOrders();

    orders.sort(
      (a, b) => new Date(b.createdAt) -
        new Date(a.createdAt)
    );

    res.json(orders);
  }
);

// ========================================
// START SERVER (Required for Render hosting)
// ========================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});