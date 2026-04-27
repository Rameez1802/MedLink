const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  name: String,
  price: Number,
  stock: Number,
  expiry: String,
});

const pharmacySchema = new mongoose.Schema({
  ownerName: String,
  phone: String,

  name: String,
  address: String,

  open: {
    type: Boolean,
    default: true,
  },

  medicines: [medicineSchema],
});

module.exports = mongoose.model("Pharmacy", pharmacySchema);