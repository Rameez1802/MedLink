const mongoose = require("mongoose");

const emergencySchema = new mongoose.Schema(
  {
    type: String, // medicine / blood
    medicine: String,
    bloodGroup: String,
    phone: String,
    address: String,
    status: { type: String, default: "Pending" },
    acceptedBy: {
      ownerName: String,
      phone: String,
      pharmacyName: String,
      address: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Emergency", emergencySchema);