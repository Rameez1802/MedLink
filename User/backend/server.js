const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/medlink")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Routes
const pharmacyRoutes = require("./routes/pharmacyRoutes");
app.use("/api/pharmacies", pharmacyRoutes);

const orderRoutes = require("./routes/orderRoutes");
app.use("/api/orders", orderRoutes);

const emergencyRoutes = require("./routes/emergencyRoutes");
app.use("/api/emergency", emergencyRoutes);

const donorRoutes = require("./routes/donorRoutes");
app.use("/api/donors", donorRoutes);  

const ownerRoutes = require("./routes/ownerRoutes");
app.use("/api/owner", ownerRoutes);

const ownerOrderRoutes = require("./routes/ownerOrderRoutes");
app.use("/api/owner/orders", ownerOrderRoutes);

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});