const router = require('express').Router();
const { addBeneficiary } = require('../controllers/beneficiaryController');

const authorization = require('../middleware/authorization');

router.post('/add', authorization, addBeneficiary);


module.exports = router;
