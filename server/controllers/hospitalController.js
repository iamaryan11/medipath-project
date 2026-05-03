const Hospital = require("../models/Hospital");
const axios = require("axios");
const addHospital = async (req, res) => {
  try {
    const hospital = new Hospital(req.body);
    await hospital.save();
    res.status(201).json({ message: "Hospital added successfully!" });
  } catch (err) {
    console.error("Mongoose Error:", err.message);
    res.status(400).json({ error: err.message });
  }
};

const getNearestHospitals = async (req, res) => {
  try {
    const { lat, lng, limit = 5, specialty, type, emergency } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "Latitude and Longitude are required query parameters.",
      });
    }

    const query = {
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
        },
      },
    };

    if (specialty) {
      query.specialties = { $regex: specialty, $options: "i" };
    }

    if (type) {
      query.type = { $regex: type, $options: "i" };
    }

    if (emergency === "true" || emergency === "1") {
      query.emergency24x7 = true;
    }

    const nearestHospitals = await Hospital.find(query)
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
};

const getHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find().limit(5);
    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getRoute = async (req, res) => {
  try {
    const { start_lat, start_lng, end_lat, end_lng } = req.body;
    
    if (!start_lat || !start_lng || !end_lat || !end_lng) {
      return res.status(400).json({ success: false, message: "Missing coordinates." });
    }

    const pythonApiUrl = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';
    
    const response = await axios.post(`${pythonApiUrl}/calculate-route`, {
      start_lat: parseFloat(start_lat),
      start_lng: parseFloat(start_lng),
      end_lat: parseFloat(end_lat),
      end_lng: parseFloat(end_lng)
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Gateway Routing Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching route from ML service",
      error: error.response?.data || error.message
    });
  }
};

const getRecommendations = async (req, res) => {
  try {
    const { latitude, longitude, k = 5 } = req.body;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ success: false, message: "Missing coordinates." });
    }

    const pythonApiUrl = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';
    
    const response = await axios.post(`${pythonApiUrl}/recommend`, {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        k: parseInt(k)
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Gateway Recommendation Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching recommendations from ML service",
      error: error.response?.data || error.message
    });
  }
};

module.exports = {
  addHospital,
  getNearestHospitals,
  getHospitals,
  getRoute,
  getRecommendations
};
