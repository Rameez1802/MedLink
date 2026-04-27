const express = require("express");
const router = express.Router();
const donor = require("../models/Donor");
const Donor = require("../models/Donor");

// add donor
router.post("/", async(req,res) => {
    const donor = new Donor(req.body);
    await donor.save();
    res.json(donor);

});

// get donors
router.get("/", async(req, res) => {
    const donor = await Donor.find();
    res.json(donor);
});

// delete 
router.delete("/:id", async(req, res)=>{
    await Donor.findByIdAndDelete(req.params.id);
    res.json({msg:"Deleted"});
});

//update
router.put("/:id", async(req, res)=>{
    const updated = await Donor.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    );
    res.json(updated);
});

module.exports = router;

