const express = require("express");
const router = express.Router();
const Pharmacy = require("../models/Pharmacy");


// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { ownerName, phone, name, address } = req.body;

    const exists = await Pharmacy.findOne({ phone });
    if (exists) {
      return res.status(400).json({ msg: "Already registered" });
    }

    const newPharmacy = new Pharmacy({
      ownerName,
      phone,
      name,
      address,
      medicines: [],
      open: false,
    });

    await newPharmacy.save();
    res.json(newPharmacy);
  } catch (err) {
    res.status(500).json(err);
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { phone } = req.body;

    const user = await Pharmacy.findOne({ phone });

    if (!user) {
      return res.status(404).json({ msg: "Not registered" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});


// GET OWNER DATA
router.get("/:phone", async (req, res) => {
  try {
    const user = await Pharmacy.findOne({ phone: req.params.phone });
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});


// TOGGLE SHOP
router.patch("/status/:phone", async (req, res) => {
  try {
    const { open } = req.body;

    const user = await Pharmacy.findOneAndUpdate(
      { phone: req.params.phone },
      { open },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});



// ADD MEDICINE
router.post("/medicine/:phone", async (req, res) => {
  try {
    const shop = await Pharmacy.findOne({ phone: req.params.phone });

    if (!shop) return res.status(404).json({ msg: "Shop not found" });

    shop.medicines.push(req.body);
    await shop.save();

    res.json(shop.medicines);
  } catch (err) {
    res.status(500).json(err);
  }
});


// EDIT MEDICINE
router.put("/medicine/:phone/:id", async (req, res) => {
  try {
    const shop = await Pharmacy.findOne({ phone: req.params.phone });

    const med = shop.medicines.id(req.params.id);

    if (!med) return res.status(404).json({ msg: "Medicine not found" });

    med.name = req.body.name;
    med.price = req.body.price;
    med.stock = req.body.stock;
    med.expiry = req.body.expiry;

    await shop.save();

    res.json(shop.medicines);
  } catch (err) {
    res.status(500).json(err);
  }
});


// DELETE MEDICINE
router.delete("/medicine/:phone/:id", async (req, res) => {
  try {
    const shop = await Pharmacy.findOne({ phone: req.params.phone });

    shop.medicines = shop.medicines.filter(
      (m) => m._id.toString() !== req.params.id
    );

    await shop.save();

    res.json(shop.medicines);
  } catch (err) {
    res.status(500).json(err);
  }
});

//  GET ORDERS FOR OWNER
router.get("/owner/:phone", async (req, res) => {
  const orders = await Order.find({
    pharmacyPhone: req.params.phone,
  }).sort({ createdAt: -1 });

  res.json(orders);
});

//  UPDATE STATUS
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