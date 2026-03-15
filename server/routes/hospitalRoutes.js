const express = require("express");
const router = express.Router();
const Hospital = require("../models/Hospital");

router.post("/seed", async (req, res) => {
  try {
    const hospital = new Hospital(req.body);
    await hospital.save();
    res.status(201).json({ message: "Hospital added successfully!" });
  } catch (err) {
    console.error("Mongoose Error:", err.message);
    res.status(400).json({ error: err.message });
  }
});


router.get("/nearest", async (req, res) => {
  try {
    const { lat, lng, limit = 5 } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "Latitude and Longitude are required query parameters.",
      });
    }

    const nearestHospitals = await Hospital.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
        },
      },
    })
      .limit(parseInt(limit))
      .lean();
    const cleanedHospitals = nearestHospitals.map((hospital) => {
      return {
        ...hospital,
        specialties: (hospital.specialties || []).filter(
          (s) => s && s.toLowerCase() !== "nan" && s !== "",
        ),
        contactNumber:
          hospital.contactNumber === "0.0" || hospital.contactNumber === "nan"
            ? "Contact info unavailable"
            : hospital.contactNumber,
        distanceInMeters: "Calculated by GeoJSON index",
      };
    });

    res.status(200).json({
      success: true,
      count: cleanedHospitals.length,
      data: cleanedHospitals,
    });
  } catch (err) {
    console.error("KNN Query Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error during proximity search.",
      error: err.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const hospitals = await Hospital.find().limit(5);
    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
