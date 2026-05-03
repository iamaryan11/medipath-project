const express = require("express");
const router = express.Router();
const { addHospital, getNearestHospitals, getHospitals, getRoute, getRecommendations } = require("../controllers/hospitalController");
const { protect } = require("../utils/authMiddleware");

// Protected Data Setup Route
router.post("/seed", addHospital);

// Database queries
router.get("/nearest", protect, getNearestHospitals);
router.get("/", protect, getHospitals);

// ML Service Gateway
router.post("/route", protect, getRoute);
router.post("/recommend", protect, getRecommendations);

module.exports = router;
