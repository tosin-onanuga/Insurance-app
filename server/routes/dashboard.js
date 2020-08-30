const router = require("express").Router();

const authorization = require("../middleware/authorization");
const {
  userDashboard,
  policyPlanDetail,
} = require("../controllers/dashboardController");

router.get("/", authorization, userDashboard);
router.get("/policy/:id/detail", authorization, policyPlanDetail);

module.exports = router;
