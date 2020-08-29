const router = require('express').Router();
const multer = require('multer');
const { addBeneficiary } = require('../controllers/beneficiaryController');

const authorization = require('../middleware/authorization');

//multer config
const upload = multer({ dest: 'uploads/' })

router.post('/:policyId/add', upload.single('passport'), authorization, addBeneficiary);


module.exports = router;
