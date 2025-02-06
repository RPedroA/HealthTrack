const express = require("express");
const router = express.Router();

const usersRoutes = require("./user");
const authRoutes = require("./auth");
const dailyHealthMetricsRoutes = require("./dailyHealthMetrics");
const physicalActivitiesRoutes = require("./physicalActivities");
const groupsRoutes = require("./groups");
const goalsRoutes = require("./goals");
const postsRoutes = require("./posts");

router.use("/users", usersRoutes);
router.use("/auth", authRoutes);
router.use("/dhm", dailyHealthMetricsRoutes);
router.use("/pa", physicalActivitiesRoutes);
router.use("/groups", groupsRoutes);
router.use("/goals", goalsRoutes);
router.use("/posts", postsRoutes);

module.exports = router;
