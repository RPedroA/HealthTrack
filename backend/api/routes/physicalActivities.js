const express = require("express");
const router = express.Router();
const {
  createPhysicalActivity,
  getAllPhysicalActivities,
  updatePhysicalActivity,
  deletePhysicalActivity,
  searchPhysicalActivities, 
} = require("../controllers/physical_activities");

router.post("/", createPhysicalActivity);
router.get("/", getAllPhysicalActivities);
router.put("/:id", updatePhysicalActivity);
router.delete("/:id", deletePhysicalActivity);
router.get("/search", searchPhysicalActivities); 
module.exports = router;
