const router = require("express").Router();
const {
  addPolicy,
  getAllPolicies,
  buyPolicy,
  getUserPolicy,
  initializePayment,
  verifyPayment,
} = require("../controllers/policyController");

const authorization = require("../middleware/authorization");

router.post("/add", authorization, addPolicy);
router.post("/:policyId/initialize_payment", authorization, initializePayment);
router.post("/:policyId/verify_payment", authorization, verifyPayment);
router.post("/buy/:id", authorization, buyPolicy);
router.get("/all", getAllPolicies);
router.get("/user_policies", authorization, getUserPolicy);

module.exports = router;
