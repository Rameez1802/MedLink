const express = require("express");
const router = express.Router();
const Pharmacy = require("../models/Pharmacy");

// GET all pharmacies
router.get("/", async (req, res) => {
  const data = await Pharmacy.find();
  res.json(data);
});

// ADD pharmacy
router.post("/", async (req, res) => {
  const pharmacy = new Pharmacy(req.body);
  await pharmacy.save();
  res.json(pharmacy);
});

// GET single pharmacy
router.get("/:id", async (req, res) => {
  const data = await Pharmacy.findById(req.params.id);
  res.json(data);
});

router.get("/search/:name", async (req, res) => {
  const query = req.params.name;

  const pharmacies = await Pharmacy.find({
    "medicines.name": { $regex: query, $options: "i" },
  });

  // Flatten results
  const results = [];

  pharmacies.forEach((pharmacy) => {
    pharmacy.medicines.forEach((med) => {
      if (med.name.toLowerCase().startsWith(query.toLowerCase())) {
        results.push({
          pharmacyName: pharmacy.name,
          address: pharmacy.address,
          distance: pharmacy.distance,
          time: pharmacy.time,
          open: pharmacy.open,
          price: med.price,
          stock: med.stock,
          medicine: med.name,
        });
      }
    });
  });

  res.json(results);
});

module.exports = router;