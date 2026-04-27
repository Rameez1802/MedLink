const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: String,
  pharmacyPhone: String,
  items: Array,
  address: String,
  paymentMethod: String,
  total: Number,
  status: {
    type: String,
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);