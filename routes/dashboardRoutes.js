const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

// Route to get chart data
router.get("/chart-data", dashboardController.getChartData);

module.exports = router;
