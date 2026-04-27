const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// GET OWNER ORDERS
router.get("/:phone", async (req, res) => {
  const orders = await Order.find({
    pharmacyPhone: req.params.phone,
  }).sort({ createdAt: -1 });

  res.json(orders);
});

// UPDATE STATUS
router.patch("/:id", async (req, res) => {
  const { status } = req.body;

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  res.json(order);
});

module.exports = router;