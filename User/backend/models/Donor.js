const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema({
    name: String,
    phone: String,
    address: String,
    bloodGroup: String,
    isSelf: {type: Boolean , default: false},
});

module.exports = mongoose.model("Donor", donorSchema);