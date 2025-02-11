const express = require("express");
const router = express.Router();
const {
  createGoal,
  getAllGoals,
  updateGoal,
  deleteGoal,
  searchGoals,
} = require("../controllers/goalsController");

router.post("/", createGoal);
router.get("/", getAllGoals);
router.put("/:id", updateGoal);
router.delete("/:id", deleteGoal);
router.get("/search", searchGoals);

module.exports = router;
