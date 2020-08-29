const router = require('express').Router();
const { addPolicy, getAllPolicies, buyPolicy, getUserPolicy } = require('../controllers/policyController');

const authorization = require('../middleware/authorization');

router.post('/add', authorization, addPolicy);
router.post('/buy/:id', authorization, buyPolicy);
router.get('/all', getAllPolicies);
router.get('/user_policies', authorization, getUserPolicy);


module.exports = router;
