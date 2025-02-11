const express = require("express");
const router = express.Router();
const {
  createOrUpdateDailyHealthMetrics,
  getAllDailyHealthMetrics,
  updateDailyHealthMetrics,
  deleteDailyHealthMetrics,
  searchDailyHealthMetrics,
} = require("../controllers/dailyHealthMetricsController");


router.post("/", createOrUpdateDailyHealthMetrics);
router.get("/", getAllDailyHealthMetrics);
router.put("/:id", updateDailyHealthMetrics);
router.delete("/:id", deleteDailyHealthMetrics);
router.get("/search", searchDailyHealthMetrics); 

module.exports = router;
