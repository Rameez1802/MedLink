const express = require("express");
const router = express.Router();
const Emergency = require("../models/Emergency");

router.post("/", async (req, res) => {
  try {
    const data = new Emergency(req.body);
    await data.save();
    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});



router.get("/", async (req, res) => {
  try {
    const data = await Emergency.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.patch("/accept/:id", async (req, res) => {
  try {
    const { ownerName, phone, pharmacyName, address } = req.body;

    const updated = await Emergency.findByIdAndUpdate(
      req.params.id,
      {
        status: "Accepted",
        acceptedBy: {
          ownerName,
          phone,
          pharmacyName,
          address,
        },
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
});



module.exports = router;